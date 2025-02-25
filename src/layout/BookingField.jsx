//ไม่ได้ใช้ เก็บไว้ก่อน

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function BookingField() {
  // สถานะต่างๆ สำหรับการจัดการข้อมูลการจอง
  const [bookings, setBookings] = useState([]); // เก็บข้อมูลการจองทั้งหมด
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
  const { user } = useAuth(); // ดึงข้อมูลผู้ใช้จาก context (AuthContext)
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  // สถานะสำหรับการแก้ไขการจอง
  const [editingBooking, setEditingBooking] = useState(null);

  // สถานะสำหรับการเปิด/ปิดฟอร์มการเพิ่มการจอง
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);

  // ข้อมูลฟอร์มการจอง
  const [formData, setFormData] = useState({
    dueDate: dayjs().format("YYYY-MM-DD"), // วันที่ที่กำหนดให้เป็นวันนี้
    startTime: "", // เวลาที่เริ่มต้นของการจอง
    endTime: "", // เวลาที่สิ้นสุดของการจอง
    selectedField: "", // ฟิลด์ที่เลือก
    userId: "", // รหัสผู้ใช้
  });

  // สถานะเพิ่มเติม
  const [fields, setFields] = useState([]); // รายการสนาม
  const [users, setUsers] = useState([]); // รายชื่อผู้ใช้
  const [existingBookings, setExistingBookings] = useState([]); // การจองที่มีอยู่ในวันที่เลือก
  const [calendarDate, setCalendarDate] = useState(new Date()); // วันที่ที่เลือกจากปฏิทิน
  const [bookedTimes, setBookedTimes] = useState([]); // เวลาที่จองแล้วในวันที่เลือก
  const [selectedFieldPrice, setSelectedFieldPrice] = useState(0); // ราคาสนามที่เลือก

  // ช่วงเวลาในการจองที่มี
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
    "23:00",
  ];

  // ดึงข้อมูลการจองทั้งหมดเมื่อ component ถูกติดตั้ง
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/booking`
        );
        setBookings(response.data); // อัพเดทสถานะ bookings ด้วยข้อมูลที่ดึงมา
      } catch (error) {
        console.error("Error fetching bookings:", error);
        Swal.fire(
          "Error!",
          "There was an error fetching the bookings.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ดึงข้อมูลสนามฟุตบอล
  useEffect(() => {
    async function fetchFields() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/field`
        );
        setFields(response.data);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    }
    fetchFields();
  }, []);

  // ดึงข้อมูลผู้ใช้
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/users`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  // ดึงข้อมูลการจองที่มีอยู่ตามวันที่ที่เลือก
  useEffect(() => {
    fetchBookingsByDate(dayjs(calendarDate).format("YYYY-MM-DD"));
  }, [calendarDate]);

  // ฟังก์ชันดึงข้อมูลการจองตามวันที่
  const fetchBookingsByDate = async (date) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/bookings/all?dueDate=${date}`
      );
      const filteredBookings = response.data.filter(
        (booking) => dayjs(booking.dueDate).format("YYYY-MM-DD") === date
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

  // ฟังก์ชันที่ใช้จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // ถ้าเป็นการเลือกสนาม, คำนวณราคา
    if (name === "selectedField") {
      const price = calculateFieldPrice(value);
      setSelectedFieldPrice(price);
    }

    // ถ้าเป็นการเปลี่ยนวันที่, รีเฟรชการจองตามวันที่ใหม่
    if (name === "dueDate") {
      setCalendarDate(new Date(value));
      fetchBookingsByDate(value);
    }
  };

  // ฟังก์ชันคำนวณราคาของสนามที่เลือก
  const calculateFieldPrice = (selectedField) => {
    const field = fields.find((f) => f.id == selectedField);
    return field ? field.pricePerHour : 0;
  };

  // ฟังก์ชันคำนวณราคาทั้งหมด
  const calculateTotalCost = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours * selectedFieldPrice;
  };

  // ฟังก์ชันตรวจสอบการจองซ้ำ
  const checkDuplicateBooking = async (output) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/bookings/${
          user.id
        }/id?dueDate=${output.dueDate}&fieldId=${output.fieldId}`
      );
      const bookings = response.data;

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

  // ฟังก์ชันเปิดฟอร์มการเพิ่มการจอง
  const handleAddBookingOpen = () => {
    setIsAddBookingOpen(true);
    resetForm();
    setEditingBooking(null);
    fetchBookingsByDate(dayjs().format("YYYY-MM-DD"));
  };

  // ฟังก์ชันส่งข้อมูลการจองเมื่อเพิ่มการจอง
  const handleAddBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const output = {
        startTime: dayjs(`${formData.dueDate}T${formData.startTime}`),
        endTime: dayjs(`${formData.dueDate}T${formData.endTime}`),
        dueDate: dayjs(`${formData.dueDate}T${formData.startTime}`),
        totalCost: calculateTotalCost(),
        fieldId: parseInt(formData.selectedField),
        userId: formData.userId ? parseInt(formData.userId) : null,
      };

      // ตรวจสอบการจองซ้ำ
      const isDuplicate = await checkDuplicateBooking(output);

      if (isDuplicate) {
        Swal.fire({
          title: "Error",
          text: "มีการจองในช่วงเวลาดังกล่าวอยู่แล้ว",
          icon: "error",
          confirmButtonText: "ตกลง",
        }).then(() => {
          setTimeout(() => {
            navigate("/admin/manage/bookingfield");
          }, 2000);
        });
        return;
      }

      // ส่งข้อมูลการจองไปยัง API
      const rs = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking/bookings/create/${
          output.userId
        }`,
        output
      );

      if (rs.status === 200) {
        setBookings((prev) => [...prev, rs.data]);
        Swal.fire({
          title: "Success",
          text: `กรุณาบันทึกหน้าจอ \nวันที่จอง: ${
            formData.dueDate
          }\nเวลาเริ่มต้น: ${formData.startTime}\nเวลาสิ้นสุด: ${
            formData.endTime
          }\nราคาต่อชั่วโมง: ${selectedFieldPrice} บาท\nราคารวม: ${calculateTotalCost()} บาท`,
          icon: "success",
          confirmButtonText: "เรียบร้อย",
        }).then(() => {
          window.location.reload();
        });
        setIsAddBookingOpen(false);
        resetForm();
      } else {
        throw new Error("Failed to create new.");
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      }).then(() => {
        setTimeout(() => {
          navigate("/admin/manage/bookingfield");
        }, 2000);
      });
    }
  };

  // ฟังก์ชันแก้ไขการจอง
  const handleEditBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const output = {
        startTime: dayjs(`${formData.dueDate}T${formData.startTime}`),
        endTime: dayjs(`${formData.dueDate}T${formData.endTime}`),
        dueDate: dayjs(`${formData.dueDate}T${formData.startTime}`),
        totalCost: calculateTotalCost(),
        fieldId: parseInt(formData.selectedField, 10),
        userId: formData.userId ? parseInt(formData.userId, 10) : null,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/booking/bookings/${editingBooking.id}`,
        output
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === editingBooking.id ? response.data : booking
        )
      );

      setEditingBooking(null);
      resetForm();

      Swal.fire(
        "Updated!",
        "Booking details have been updated.",
        "success"
      ).then(() => {
        setTimeout(() => {
          navigate("/admin/manage/bookingfield");
        }, 1000);
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      const errorMessage =
        error.response?.data?.message ||
        "There was an error while updating the booking.";
      Swal.fire("Error!", errorMessage, "error");
    }
  };

  // ฟังก์ชันรีเซ็ตฟอร์ม
  const resetForm = () => {
    setFormData({
      dueDate: dayjs().format("YYYY-MM-DD"),
      startTime: "",
      endTime: "",
      selectedField: "",
      userId: "",
    });
    setSelectedFieldPrice(0);
  };

  // ฟังก์ชันลบการจอง
  const handleDeleteClick = async (booking) => {
    Swal.fire({
      title: `แน่ใจว่าต้องการลบ ${booking.field.name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/booking/bookings/${booking.id}`
          );
          setBookings((prevBookings) =>
            prevBookings.filter((b) => b.id !== booking.id)
          );
          Swal.fire(
            "Deleted!",
            `Booking for ${booking.field.name} has been deleted.`,
            "success"
          );
        } catch (error) {
          console.error("Error deleting booking:", error);
          Swal.fire(
            "Error!",
            "There was an error while deleting the booking.",
            "error"
          );
        }
      }
    });
  };

  // ฟังก์ชันตั้งค่าแก้ไขการจอง
  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setFormData({
      dueDate: dayjs(booking.dueDate).format("YYYY-MM-DD"),
      startTime: dayjs(booking.startTime).format("HH:mm"),
      endTime: dayjs(booking.endTime).format("HH:mm"),
      selectedField: booking.field.id,
      userId: booking.user.id,
    });
    setSelectedFieldPrice(calculateFieldPrice(booking.field.id));
    setCalendarDate(new Date(dayjs(booking.dueDate).format("YYYY-MM-DD")));
    fetchBookingsByDate(dayjs(booking.dueDate).format("YYYY-MM-DD"));
  };

  // ฟังก์ชันสำหรับแสดง popup สลิปการชำระเงิน
  const handleShowSlip = (booking) => {
    if (booking.Payment && booking.Payment.slip) {
      // สมมุติว่า slip ที่ได้เก็บเป็น path ที่สัมพันธ์กับ backend
      const slipUrl = `${import.meta.env.VITE_API_URL}/${booking.Payment.slip}`;
      Swal.fire({
        title: "Payment Slip",
        imageUrl: slipUrl,
        imageAlt: "Payment Slip",
        confirmButtonText: "Close",
        width: "80%",
        padding: "3em",
      });
    } else {
      Swal.fire({
        title: "No Slip",
        text: "This booking does not have a payment slip.",
        icon: "info",
        confirmButtonColor: "#111",
        confirmButtonText: "Close",
      });
    }
  };

  // === ฟังก์ชันใหม่สำหรับอัปเดตสถานะการจองและการชำระเงิน ===

  const handleCancelBooking = async (booking) => {
    try {
      const result = await Swal.fire({
        title: "ยกเลิกการจอง",
        text: `คุณแน่ใจหรือว่าต้องการยกเลิกการจองสำหรับสนาม ${booking.field.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ใช่, ยกเลิก",
        cancelButtonText: "ไม่ใช่",
      });
      if (result.isConfirmed) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/booking/bookings/${
            booking.id
          }/cancel`
        );
        if (response.status === 200) {
          setBookings((prev) =>
            prev.map((b) => (b.id === booking.id ? response.data : b))
          );
          Swal.fire("ยกเลิกการจองสำเร็จ", "", "success");
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      Swal.fire("Error", "There was an error cancelling the booking", "error");
    }
  };

  const handleConfirmBooking = async (booking) => {
    try {
      const result = await Swal.fire({
        title: "ยืนยันการจอง",
        text: `คุณแน่ใจหรือว่าต้องการยืนยันการจองสำหรับสนาม ${booking.field.name}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ใช่, ยืนยัน",
        cancelButtonText: "ไม่ใช่",
      });
      if (result.isConfirmed) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/booking/bookings/${
            booking.id
          }/confirm`
        );
        if (response.status === 200) {
          setBookings((prev) =>
            prev.map((b) => (b.id === booking.id ? response.data : b))
          );
          Swal.fire("ยืนยันการจองสำเร็จ", "", "success");
        }
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      Swal.fire("Error", "There was an error confirming the booking", "error");
    }
  };

  const handleCompleteBooking = async (booking) => {
    try {
      const result = await Swal.fire({
        title: "การจองสำเร็จ",
        text: `คุณแน่ใจหรือว่าต้องการทำเครื่องหมายการจองสำหรับสนาม ${booking.field.name} เป็นสำเร็จ?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ใช่, ทำเครื่องหมายสำเร็จ",
        cancelButtonText: "ไม่ใช่",
      });
      if (result.isConfirmed) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/booking/bookings/${
            booking.id
          }/complete`
        );
        if (response.status === 200) {
          setBookings((prev) =>
            prev.map((b) => (b.id === booking.id ? response.data : b))
          );
          Swal.fire("การจองสำเร็จ", "", "success");
        }
      }
    } catch (error) {
      console.error("Error completing booking:", error);
      Swal.fire(
        "Error",
        "There was an error marking the booking as complete",
        "error"
      );
    }
  };

  // ฟังก์ชันสำหรับแสดงเวลาที่ว่าง
  const renderTimeSlots = () => {
    const slotsPerRow = 4;
    const rows = [];
    for (let i = 0; i < timeSlots.length; i += slotsPerRow) {
      rows.push(timeSlots.slice(i, i + slotsPerRow));
    }
    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-between mb-2">
        {row.map((slot, index) => {
          const isBooked = bookedTimes.some(
            (time) => slot >= time.startTime && slot < time.endTime
          );
          return (
            <div
              key={index}
              className={`w-1/5 text-center p-2 rounded ${
                isBooked
                  ? "bg-red-200 text-red-700 line-through cursor-not-allowed"
                  : "bg-green-200 text-green-700 hover:bg-green-300 cursor-pointer"
              }`}
              title={isBooked ? "เวลานี้ถูกจองแล้ว" : "ว่าง"}
            >
              {slot}
            </div>
          );
        })}
      </div>
    ));
  };

  useEffect(() => {
    const currentDate = new Date();
    setMonth(currentDate.getMonth() + 1); // เดือนเริ่มจาก 0 (มกราคม = 0)
    setYear(currentDate.getFullYear()); // ปีปัจจุบัน
  }, []);

  // ฟังก์ชันสำหรับการดาวน์โหลดรายงานการจอง
  const handleExport = async () => {
    if (!month || !year) {
      alert("กรุณากรอกเดือนและปี");
      return;
    }

    try {
      // ส่งคำขอไปยัง API ที่ backend
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/export`,
        {
          params: { month, year },
          responseType: "blob", // กำหนดให้รับข้อมูลเป็นไฟล์
        }
      );

      // สร้าง URL สำหรับดาวน์โหลด
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `รายงานการจองประจำเดือน-${month}-${year}.csv`
      ); // ตั้งชื่อไฟล์ที่ดาวน์โหลด
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // ลบลิงก์หลังจากดาวน์โหลด
    } catch (error) {
      console.error("Error exporting bookings:", error);
      alert("ไม่สามารถส่งข้อมูลได้");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900">การจอง</h1>
          <p className="text-gray-600 mt-2">
            View, edit, and manage all field bookings in your system
          </p>
        </div>

        {/* ปุ่มสำหรับเปิดฟอร์มการเพิ่มการจองใหม่ */}
        <h2 className="text-2xl font-semibold text-gray-900">
            ดาวน์โหลดรายงานการจอง
          </h2>
        <div className="mb-6">
        <input
              type="number"
              placeholder="เดือน"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input input-bordered w-32"
            />
            <input
              type="number"
              placeholder="ปี"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input input-bordered w-32 ml-4"
            />
            <button className="btn btn-primary ml-4" onClick={handleExport}>
              ดาวน์โหลดรายงาน
            </button>
          <button className="btn btn-primary" onClick={handleAddBookingOpen}>
            เพิ่มการจองใหม่
          </button>
        </div>

        {/* ตารางการจอง */}
        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>สนาม</th>
                  <th>ผู้ใช้</th>
                  <th>วันและเวลาเริ่มต้น</th>
                  <th>วันและเวลาสิ้นสุด</th>
                  <th>วันที่จอง</th>
                  <th>ชั่วโมงที่จอง</th>
                  <th>ราคารวม</th>
                  <th>หมายเหตุ</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => {
                  const startTime = new Date(booking.startTime);
                  const endTime = new Date(booking.endTime);
                  const hours = (endTime - startTime) / (1000 * 60 * 60);
                  const totalCost = hours * booking.field.pricePerHour;

                  return (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{booking.field.name}</td>
                      <td>{booking.user.username}</td>
                      <td>
                        {`${startTime.toLocaleDateString(
                          "en-GB"
                        )} ${startTime.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                      </td>
                      <td>
                        {`${endTime.toLocaleDateString(
                          "en-GB"
                        )} ${endTime.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                      </td>
                      <td>
                        {new Date(booking.dueDate).toLocaleDateString("en-GB")}
                      </td>
                      <td>{hours} ชั่วโมง</td>
                      <td>{totalCost.toFixed(2)} บาท</td>
                      <td>{booking.status}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm mr-2"
                          onClick={() => handleEditClick(booking)}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="btn btn-error btn-sm mr-2"
                          onClick={() => handleDeleteClick(booking)}
                        >
                          ลบ
                        </button>
                        {booking.status !== "Cancel" &&
                          booking.status !== "Completed" && (
                            <>
                              {booking.status === "Pending" && (
                                <button
                                  className="btn btn-success btn-sm mr-2"
                                  onClick={() => handleConfirmBooking(booking)}
                                >
                                  ยืนยันการจอง
                                </button>
                              )}
                              {booking.status === "Confirm" && (
                                <button
                                  className="btn btn-success btn-sm mr-2"
                                  onClick={() => handleCompleteBooking(booking)}
                                >
                                  การจองสำเร็จ
                                </button>
                              )}
                              <button
                                className="btn btn-secondary btn-sm mr-2"
                                onClick={() => handleCancelBooking(booking)}
                              >
                                ยกเลิกการจอง
                              </button>
                            </>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* โมดอลสำหรับเพิ่มการจองใหม่ */}
        {isAddBookingOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
              <h2 className="text-xl font-semibold mb-4">เพิ่มการจอง</h2>
              <form onSubmit={handleAddBookingSubmit}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-4">
                    <label className="block text-gray-700">วันที่จอง</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md mb-4"
                      required
                    />
                    <div className="flex space-x-4 mb-4">
                      <div className="w-1/2">
                        <label className="block text-gray-700">
                          เวลาเริ่มต้น
                        </label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-gray-700">
                          เวลาสิ้นสุด
                        </label>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                    </div>
                    <label className="block text-gray-700">เลือกสนาม</label>
                    <select
                      name="selectedField"
                      value={formData.selectedField}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md mb-4"
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
                      <p className="mb-4 text-sm text-gray-600">
                        ราคาต่อชั่วโมง: {selectedFieldPrice} บาท
                      </p>
                    )}
                    <label className="block text-gray-700">เลือกผู้ใช้</label>
                    <select
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md mb-4"
                      required
                    >
                      <option value="">เลือกผู้ใช้</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                    <label className="block text-gray-700">หมายเหตุ</label>
                    <div className="mb-4">
                      <label className="block text-gray-700">ราคารวม</label>
                      <p className="text-lg font-semibold">
                        {calculateTotalCost()} บาท
                      </p>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-4">
                    <h3 className="text-lg font-semibold mb-2">
                      ตรวจสอบการจอง
                    </h3>
                    <Calendar
                      onChange={(date) => {
                        setCalendarDate(date);
                        setFormData((prev) => ({
                          ...prev,
                          dueDate: dayjs(date).format("YYYY-MM-DD"),
                        }));
                        fetchBookingsByDate(dayjs(date).format("YYYY-MM-DD"));
                      }}
                      value={calendarDate}
                      className="mb-6"
                    />
                    <div>
                      <h4 className="text-md font-medium mb-2">
                        การจองในวันที่{" "}
                        {dayjs(calendarDate).format("DD/MM/YYYY")}
                      </h4>
                      <div>
                        <h5 className="text-sm font-medium">เวลาที่ว่าง:</h5>
                        <div className="mt-2">{renderTimeSlots()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button type="submit" className="btn btn-primary mr-2">
                    เพิ่ม
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsAddBookingOpen(false)}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* โมดอลการแก้ไขการจอง */}
        {editingBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-4">แก้ไขการจอง</h2>
                {editingBooking?.Payment?.slip && (
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleShowSlip(editingBooking)}
                  >
                    แสดงสลิป
                  </button>
                )}
              </div>
              <form onSubmit={handleEditBookingSubmit}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-4">
                    <label className="block text-gray-700">วันที่จอง</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md mb-4"
                      required
                    />
                    <div className="flex space-x-4 mb-4">
                      <div className="w-1/2">
                        <label className="block text-gray-700">
                          เวลาเริ่มต้น
                        </label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-gray-700">
                          เวลาสิ้นสุด
                        </label>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                    </div>
                    <label className="block text-gray-700">เลือกสนาม</label>
                    <select
                      name="selectedField"
                      value={formData.selectedField}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md mb-4"
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
                      <p className="mb-4 text-sm text-gray-600">
                        ราคาต่อชั่วโมง: {selectedFieldPrice} บาท
                      </p>
                    )}
                    <label className="block text-gray-700">เลือกผู้ใช้</label>
                    <select
                      name="userId"
                      value={formData.userId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md mb-4"
                      required
                    >
                      <option value="">เลือกผู้ใช้</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                    <label className="block text-gray-700">หมายเหตุ</label>
                    <div className="mb-4">
                      <label className="block text-gray-700">ราคารวม</label>
                      <p className="text-lg font-semibold">
                        {calculateTotalCost()} บาท
                      </p>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-4">
                    <h3 className="text-lg font-semibold mb-2">
                      ตรวจสอบการจอง
                    </h3>
                    <Calendar
                      onChange={(date) => {
                        setCalendarDate(date);
                        setFormData((prev) => ({
                          ...prev,
                          dueDate: dayjs(date).format("YYYY-MM-DD"),
                        }));
                        fetchBookingsByDate(dayjs(date).format("YYYY-MM-DD"));
                      }}
                      value={calendarDate}
                      className="mb-6"
                    />
                    <div>
                      <h4 className="text-md font-medium mb-2">
                        การจองในวันที่{" "}
                        {dayjs(calendarDate).format("DD/MM/YYYY")}
                      </h4>
                      <div>
                        <h5 className="text-sm font-medium">เวลาที่ว่าง:</h5>
                        <div className="mt-2">{renderTimeSlots()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button type="submit" className="btn btn-primary mr-2">
                    บันทึก
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingBooking(null)}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
