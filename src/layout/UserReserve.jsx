import axios from "axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function UserReserve() {
  const { user } = useAuth();
  const [input, setInput] = useState({
    dueDate: dayjs().format("YYYY-MM-DD"), // กำหนดวันที่ปัจจุบันเป็นค่าเริ่มต้น
    startTime: "",
    endTime: "",
    selectedField: "",
  });
  const navigate = useNavigate();
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedFieldPrice, setSelectedFieldPrice] = useState(0); // ราคาต่อชั่วโมงของสนามที่เลือก
  const [fields, setFields] = useState([]); // รายการสนามทั้งหมด
  const [existingBookings, setExistingBookings] = useState([]); // รายการจองที่มีอยู่แล้ว
  const [calendarDate, setCalendarDate] = useState(new Date()); // วันที่ที่เลือกในปฏิทิน
  const [bookedTimes, setBookedTimes] = useState([]); // เวลาที่ถูกจองแล้ว

  // กำหนดช่วงเวลาที่สามารถจองได้
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  // แก้ไข State
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectionStart, setSelectionStart] = useState(null);

  // ฟังก์ชันจัดการการเลือกเวลาใหม่
  const handleSlotInteraction = (slot, isShiftKey) => {
    if (bookedTimes.some((t) => slot >= t.startTime && slot < t.endTime))
      return;

    let newSlots = [...selectedSlots];

    if (isShiftKey && selectionStart) {
      const startIdx = timeSlots.indexOf(selectionStart);
      const endIdx = timeSlots.indexOf(slot);
      const [start, end] = [
        Math.min(startIdx, endIdx),
        Math.max(startIdx, endIdx),
      ];
      newSlots = Array.from(
        new Set([...newSlots, ...timeSlots.slice(start, end + 1)])
      );
    } else {
      if (newSlots.includes(slot)) {
        newSlots = newSlots.filter((s) => s !== slot);
      } else {
        newSlots.push(slot);
      }
      setSelectionStart(slot);
    }

    setSelectedSlots(newSlots);
    updateBookingTimes(newSlots);
  };

  // ฟังก์ชันอัปเดตเวลาจอง
  const updateBookingTimes = (slots) => {
    if (slots.length === 0) {
      setInput((prev) => ({ ...prev, startTime: "", endTime: "" }));
      return;
    }

    const sorted = [...slots].sort();
    const start = sorted[0];
    const end = timeSlots[timeSlots.indexOf(sorted[sorted.length - 1]) + 1];

    setInput((prev) => ({
      ...prev,
      startTime: start,
      endTime:
        end || `${parseInt(sorted[sorted.length - 1].split(":")[0]) + 1}:00`,
    }));
  };

  const hdlChange = (e) => {
    const { name, value } = e.target;

    if (name === "startTime" || name === "endTime") {
      const [hours] = value.split(":");
      const adjustedTime = `${hours}:00`;

      setInput((prev) => {
        if (name === "endTime" && input.startTime) {
          const startHour = parseInt(input.startTime.split(":")[0]);
          const endHour = startHour + 1;
          const adjustedEndTime = `${endHour}:00`;
          return { ...prev, [name]: adjustedEndTime };
        }
        return { ...prev, [name]: adjustedTime };
      });
    } else {
      setInput((prevState) => ({ ...prevState, [name]: value }));
    }

    if (name === "selectedField") {
      const price = calculateFieldPrice(value);
      setSelectedFieldPrice(price);
    }

    if (name === "dueDate") {
      setCalendarDate(value); // ✅ อัปเดตวันที่ในปฏิทินเมื่อเลือกจาก input
      fetchBookings(value);
    }
  };

  const calculateFieldPrice = (selectedField) => {
    // ค้นหาสนามที่เลือกและคืนค่าราคาต่อชั่วโมง
    const field = fields.find((field) => field.id == selectedField);
    return field ? field.pricePerHour : 0;
  };

  const calculateTotalCost = () => {
    if (!input.startTime || !input.endTime) return 0;
    const startHour = parseInt(input.startTime.split(":")[0]);
    const endHour = parseInt(input.endTime.split(":")[0]);
    const hours = endHour - startHour;
    return hours * selectedFieldPrice;
  };

  const fetchBookings = async (date) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/bookings/all?dueDate=${date}`
      );
      // กรองเฉพาะสถานะที่ต้องการ และวันที่ตรงกัน
      const filteredBookings = response.data.filter(
        (booking) =>
          dayjs(booking.dueDate).format("YYYY-MM-DD") === date &&
          ["Pending", "Confirm", "Completed"].includes(booking.status)
      );
      setExistingBookings(filteredBookings);
      const times = filteredBookings.map((booking) => ({
        startTime: dayjs(booking.startTime).format("HH:mm"),
        endTime: dayjs(booking.endTime).format("HH:mm"),
      }));
      setBookedTimes(times);
    } catch (error) {
      console.error("Error fetching existing bookings:", error);
    }
  };

  const checkDuplicateBooking = async (output) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/bookings/${
          user.id
        }/id?dueDate=${output.dueDate}&fieldId=${output.fieldId}`
      );
      const bookings = response.data.filter((booking) =>
        ["Pending", "Confirm", "Completed"].includes(booking.status)
      );

      return bookings.some((booking) => {
        const existingStartTime = dayjs(booking.startTime);
        const existingEndTime = dayjs(booking.endTime);
        const inputStartTime = dayjs(output.startTime);
        const inputEndTime = dayjs(output.endTime);

        return (
          booking.fieldId === output.fieldId &&
          ((inputStartTime.isAfter(existingStartTime) &&
            inputStartTime.isBefore(existingEndTime)) ||
            (inputEndTime.isAfter(existingStartTime) &&
              inputEndTime.isBefore(existingEndTime)) ||
            (inputStartTime.isSame(existingStartTime) &&
              inputEndTime.isSame(existingEndTime)))
        );
      });
    } catch (error) {
      console.error("Error checking duplicate booking:", error);
      return false;
    }
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบหรือไม่
    if (!user || !user.id) {
      Swal.fire({
        title: "Error",
        text: "กรุณาเข้าสู่ระบบ",
        icon: "error",
        confirmButtonText: "ตกลง",
        customClass: {
          title: "text-red-600", // สีของหัวข้อ (แดง)
          content: "text-gray-800", // สีของข้อความ (เทาเข้ม)
          confirmButton: "bg-red-500 text-white hover:bg-red-600", // สีของปุ่มตกลง (แดง)
        },
      });
      return; // หยุดการทำงานหากยังไม่ได้เข้าสู่ระบบ
    }

    // เตรียมข้อมูลสำหรับการจอง
    const output = {
      startTime: dayjs(`${input.dueDate}T${input.startTime}`),
      endTime: dayjs(`${input.dueDate}T${input.endTime}`),
      dueDate: dayjs(`${input.dueDate}T${input.startTime}`),
      totalCost: calculateTotalCost(),
      fieldId: parseInt(input.selectedField),
    };

    // ตรวจสอบการจองซ้ำ
    const isDuplicate = await checkDuplicateBooking(output);
    if (isDuplicate) {
      Swal.fire({
        title: "Error",
        text: "มีการจองในช่วงเวลาดังกล่าวอยู่แล้ว",
        icon: "error",
        confirmButtonText: "ตกลง",
        customClass: {
          title: "text-red-600",
          content: "text-gray-800",
          confirmButton: "bg-red-500 text-white hover:bg-red-600",
        },
      });
      return;
    }

    // สร้าง URL สำหรับ QR Code ตามยอดชำระเงินที่คำนวณได้
    const qrCodeUrl = `https://promptpay.io/0810841055/${calculateTotalCost()}.png`;

    // แสดง SweetAlert2 ให้ผู้ใช้ชำระเงินและแนบสลิปการชำระเงิน
    Swal.fire({
      title: "กรุณาชำระเงินและแนบสลิป",
      html: `
        <p>กรุณาสแกน QR Code เพื่อชำระเงินก่อนดำเนินการต่อ</p>
        <div style="display: flex; justify-content: center;">
          <img src="${qrCodeUrl}" alt="QR Code" style="width:200px; height:200px;"/>
        </div>
        <p>วันที่จอง: ${input.dueDate}</p>
        <p>เวลาเริ่มต้น: ${input.startTime}</p>
        <p>เวลาสิ้นสุด: ${input.endTime}</p>
        <p>สนามที่เลือก: ${
          fields.find((field) => field.id === parseInt(input.selectedField))
            ?.name
        }</p>
        <p>ราคาต่อชั่วโมง: ${selectedFieldPrice} บาท</p>
        <p>ราคารวม: ${calculateTotalCost()} บาท</p>
        <input type="file" id="swalFile" accept="image/*" style="margin-top: 10px;" />
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "✅ ชำระเงินแล้ว",
      cancelButtonText: "❌ ยกเลิก",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
      preConfirm: () => {
        const fileInput = document.getElementById("swalFile");
        if (!fileInput || fileInput.files.length === 0) {
          Swal.showValidationMessage("กรุณาแนบสลิปการชำระเงิน");
        }
        return fileInput.files[0];
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const slipFile = result.value;

        const formData = new FormData();
        formData.append(
          "startTime",
          dayjs(`${input.dueDate}T${input.startTime}`).toISOString()
        );
        formData.append(
          "endTime",
          dayjs(`${input.dueDate}T${input.endTime}`).toISOString()
        );
        formData.append(
          "dueDate",
          dayjs(`${input.dueDate}T${input.startTime}`).toISOString()
        );
        formData.append("totalCost", calculateTotalCost());
        formData.append("fieldId", parseInt(input.selectedField));
        formData.append("slip", slipFile);

        try {
          const rs = await axios.post(
            `${import.meta.env.VITE_API_URL}/booking/bookings/create/${
              user.id
            }`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          if (rs.status === 200) {
            Swal.fire({
              title: "Success",
              text: "ชำระเงินเรียบร้อย กรุณาบันทึกหน้าจอเพื่อให้พนักงานตรวจสอบ",
              icon: "success",
              confirmButtonText: "ตกลง",
              customClass: {
                title: "text-green-600",
                content: "text-gray-800",
                confirmButton: "bg-green-500 text-white hover:bg-green-600",
              },
            });

            setTimeout(() => {
              navigate("/current-bookings");
            }, 2000);
          } else {
            throw new Error("Failed to create booking.");
          }
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: "เกิดข้อผิดพลาดในการบันทึกการจอง",
            icon: "error",
            confirmButtonText: "ตกลง",
            customClass: {
              title: "text-red-600",
              content: "text-gray-800",
              confirmButton: "bg-red-500 text-white hover:bg-red-600",
            },
          });
        }
      } else {
        console.log("User cancelled the payment process.");
      }
    });
  };

  useEffect(() => {
    // ดึงข้อมูลสนามทั้งหมดเมื่อ component โหลด
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/field`
        );
        setFields(response.data);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // ดึงข้อมูลการจองเมื่อวันที่ในปฏิทินเปลี่ยน
    fetchBookings(dayjs(calendarDate).format("YYYY-MM-DD"));
  }, [calendarDate]);

  // ฟังก์ชันสำหรับเลือกเวลาในตาราง
  // แก้ไขฟังก์ชันจัดการการเลือกเวลา
  const handleSelectTime = (slot) => {
    const isBooked = bookedTimes.some(
      (time) => slot >= time.startTime && slot < time.endTime
    );

    if (isBooked) return;

    // หาตำแหน่งของ slot ที่คลิกใน timeSlots
    const slotIndex = timeSlots.indexOf(slot);

    if (slotIndex === -1) return;

    // กรณีไม่มีช่วงเวลาเลือก หรือกด Shift ค้างไว้เพื่อเลือกช่วง
    if (!input.startTime || (input.startTime && !input.endTime)) {
      if (!input.startTime) {
        // เริ่มเลือกเวลาใหม่
        setInput((prev) => ({
          ...prev,
          startTime: slot,
          endTime: "",
        }));
      } else {
        // จบการเลือกช่วงเวลา
        const startIndex = timeSlots.indexOf(input.startTime);
        const endIndex = slotIndex;
        const [start, end] = [
          Math.min(startIndex, endIndex),
          Math.max(startIndex, endIndex),
        ];

        // สร้างช่วงเวลาที่เลือกทั้งหมด
        const selected = timeSlots.slice(start, end + 1);
        const endTime = timeSlots[end]
          ? `${parseInt(timeSlots[end].split(":")[0]) + 1}:00`
          : `${parseInt(slot.split(":")[0]) + 1}:00`;

        setInput((prev) => ({
          ...prev,
          startTime: timeSlots[start],
          endTime: endTime,
        }));
      }
    } else {
      // รีเซ็ตการเลือกถ้าคลิกใหม่
      setInput({
        dueDate: input.dueDate,
        startTime: slot,
        endTime: "",
        selectedField: input.selectedField,
      });
    }
  };

  // แก้ไขฟังก์ชันเรนเดอร์ตารางเวลา
  const renderTimeSlots = () => {
    const slotsPerRow = 5;
    const rows = [];

    // แปลงเวลาเริ่มต้นและสิ้นสุดเป็น index
    const startIndex = timeSlots.indexOf(input.startTime);
    const endIndex = timeSlots.indexOf(
      input.endTime ? `${parseInt(input.endTime.split(":")[0]) - 1}:00` : null
    );

    for (let i = 0; i < timeSlots.length; i += slotsPerRow) {
      rows.push(timeSlots.slice(i, i + slotsPerRow));
    }

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-between mb-2">
        {row.map((slot, index) => {
          const isBooked = bookedTimes.some(
            (time) => slot >= time.startTime && slot < time.endTime
          );

          const currentIndex = timeSlots.indexOf(slot);
          const isInRange =
            startIndex !== -1 &&
            endIndex !== -1 &&
            currentIndex >= Math.min(startIndex, endIndex) &&
            currentIndex <= Math.max(startIndex, endIndex);

          const isFirst = currentIndex === Math.min(startIndex, endIndex);
          const isLast = currentIndex === Math.max(startIndex, endIndex);

          return (
            <div
              key={index}
              className={`w-1/5 text-center p-2 cursor-pointer transition-all
              ${
                isBooked
                  ? "bg-red-200 text-red-700 line-through cursor-not-allowed"
                  : isInRange
                  ? "bg-blue-500 text-white"
                  : "bg-green-200 hover:bg-green-300"
              }
              ${isFirst ? "rounded-l-full" : ""}
              ${isLast ? "rounded-r-full" : ""}
              ${isInRange && !isFirst && !isLast ? "rounded-none" : ""}
            `}
              onClick={() => handleSelectTime(slot)}
            >
              {slot}
            </div>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start min-h-screen px-4 py-8 bg-gray-100">
      {/* ฟอร์มการจอง */}
      <div className="card w-full max-w-md shadow-lg bg-white p-6 rounded-lg mb-6 md:mb-0 md:mr-6">
        <h1 className="text-3xl font-bold text-center mb-6">จองสนาม</h1>
        <form onSubmit={hdlSubmit}>
          <fieldset className="mb-4">
            <legend className="text-lg font-semibold mb-2">ข้อมูลการจอง</legend>
            <div className="mb-4">
              <label className="block text-gray-700">วันที่จอง</label>
              <input
                type="date"
                name="dueDate"
                value={input.dueDate}
                onChange={hdlChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">ช่วงเวลาที่เลือก</label>
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                {input.startTime && input.endTime ? (
                  <div className="flex items-center text-green-600">
                    <span className="mr-2">🕒</span>
                    {`${input.startTime} - ${input.endTime}`}
                    <span className="ml-2 text-gray-500">
                      (ทั้งหมด{" "}
                      {parseInt(input.endTime.split(":")[0]) -
                        parseInt(input.startTime.split(":")[0])}{" "}
                      ชั่วโมง)
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-500">ยังไม่ได้เลือกเวลา</div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">เลือกสนาม</label>
              <select
                name="selectedField"
                value={input.selectedField}
                onChange={hdlChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              >
                <option value="">เลือกสนาม</option>
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.name}
                  </option>
                ))}
              </select>
              {selectedFieldPrice > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  ราคาต่อชั่วโมง: {selectedFieldPrice} บาท
                </p>
              )}
            </div>
          </fieldset>
          <div className="mb-4">
            <label className="block text-gray-700">ราคารวม</label>
            <p className="text-lg font-semibold">
              {calculateTotalCost() || 0} บาท
            </p>
          </div>
          <button type="submit" className="btn btn-success w-full">
            ยืนยัน
          </button>
        </form>
      </div>

      {/* ปฏิทินและตรวจสอบการจอง */}
      <div className="card w-full max-w-md shadow-lg bg-white p-6 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-4">ตรวจสอบการจอง</h2>
          <Calendar
            onChange={(date) => {
              const formattedDate = dayjs(date).format("YYYY-MM-DD");
              setCalendarDate(formattedDate); // ✅ กำหนดวันที่ที่เลือกในปฏิทิน
              setInput((prev) => ({ ...prev, dueDate: formattedDate })); // ✅ อัปเดตใน input date
              fetchBookings(formattedDate); // ✅ โหลดการจองของวันนั้น
            }}
            value={calendarDate}
            className="mb-6 p-4 rounded-lg shadow-lg bg-white border border-gray-300"
            tileClassName={({ date, view }) => {
              if (dayjs(date).isSame(calendarDate, "day")) {
                return "bg-blue-500 text-white"; // ✅ เน้นวันที่เลือกด้วยสีฟ้า
              }
              return "";
            }}
          />

          <div>
            <h3 className="text-xl font-semibold mb-2">
              การจองในวันที่ {dayjs(calendarDate).format("DD/MM/YYYY")}
            </h3>
            <div>
              <h4 className="text-lg font-medium">เวลาที่ว่าง:</h4>
              <div className="mt-2">{renderTimeSlots()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
