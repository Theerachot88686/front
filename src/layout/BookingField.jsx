import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useAuth from "../hooks/useAuth";

export default function BookingField() {
  // สถานะต่างๆ สำหรับการจัดการข้อมูลการจอง
  const [bookings, setBookings] = useState([]); // เก็บข้อมูลการจองทั้งหมด
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
  const { user } = useAuth(); // ดึงข้อมูลผู้ใช้จาก context (AuthContext)

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
    status: "", // สถานะการจอง
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
        console.error("Error fetching bookings:", error); // ถ้ามีข้อผิดพลาดให้แสดงใน console
        Swal.fire(
          "Error!",
          "There was an error fetching the bookings.",
          "error"
        ); // แสดงข้อความผิดพลาด
      } finally {
        setLoading(false); // ตั้งค่า loading เป็น false เมื่อเสร็จสิ้นการดึงข้อมูล
      }
    };
    fetchBookings();
  }, []); // ใช้ empty array เพื่อให้ใช้แค่ครั้งเดียวตอน component ติดตั้ง

  // ดึงข้อมูลสนามฟุตบอล
  useEffect(() => {
    async function fetchFields() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/field`
        );
        setFields(response.data); // อัพเดทข้อมูลสนาม
      } catch (error) {
        console.error("Error fetching fields:", error); // แสดงข้อผิดพลาดหากดึงข้อมูลไม่สำเร็จ
      }
    }
    fetchFields();
  }, []); // ดึงข้อมูลสนามแค่ครั้งเดียวตอน component ติดตั้ง

  // ดึงข้อมูลผู้ใช้
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/users`
        );
        setUsers(response.data); // อัพเดทรายชื่อผู้ใช้
      } catch (error) {
        console.error("Error fetching users:", error); // แสดงข้อผิดพลาดหากดึงข้อมูลไม่สำเร็จ
      }
    }
    fetchUsers();
  }, []); // ดึงข้อมูลผู้ใช้แค่ครั้งเดียวตอน component ติดตั้ง

  // ดึงข้อมูลการจองที่มีอยู่ตามวันที่ที่เลือก
  useEffect(() => {
    fetchBookingsByDate(dayjs(calendarDate).format("YYYY-MM-DD"));
  }, [calendarDate]); // เมื่อมีการเปลี่ยนวันที่จะเรียกใช้งานฟังก์ชันนี้ใหม่

  // ฟังก์ชันดึงข้อมูลการจองตามวันที่
  const fetchBookingsByDate = async (date) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/bookings/all?dueDate=${date}`
      );
      const filteredBookings = response.data.filter(
        (booking) => dayjs(booking.dueDate).format("YYYY-MM-DD") === date
      );
      setExistingBookings(filteredBookings); // เก็บข้อมูลการจองที่ตรงกับวันที่เลือก
      const times = filteredBookings.map((booking) => ({
        startTime: dayjs(booking.startTime).format("HH:mm"),
        endTime: dayjs(booking.endTime).format("HH:mm"),
      }));
      setBookedTimes(times); // เก็บเวลาที่จองแล้ว
    } catch (error) {
      console.error("Error fetching existing bookings:", error); // แสดงข้อผิดพลาดหากไม่สามารถดึงข้อมูลได้
    }
  };

  // ฟังก์ชันที่ใช้จัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target; // ดึงชื่อและค่าของฟิลด์ที่ถูกเปลี่ยนแปลง
    setFormData((prev) => ({ ...prev, [name]: value })); // อัพเดทฟอร์มด้วยค่าใหม่

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
    const field = fields.find((f) => f.id == selectedField); // หาสนามจากรายการที่เลือก
    return field ? field.pricePerHour : 0; // คืนราคาต่อชั่วโมงหากพบสนาม, ถ้าไม่พบคืน 0
  };

  // ฟังก์ชันคำนวณราคาทั้งหมด
  const calculateTotalCost = () => {
    if (!formData.startTime || !formData.endTime) return 0; // ถ้าไม่มีเวลาเริ่มต้นหรือสิ้นสุด, คืน 0
    const start = new Date(`2000-01-01T${formData.startTime}`); // แปลงเวลาเริ่มต้นเป็น Date object
    const end = new Date(`2000-01-01T${formData.endTime}`); // แปลงเวลาสิ้นสุดเป็น Date object
    const hours = (end - start) / (1000 * 60 * 60); // คำนวณชั่วโมงที่ใช้
    return hours * selectedFieldPrice; // คำนวณราคาทั้งหมด (ชั่วโมง x ราคาต่อชั่วโมง)
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

        // เช็คว่าเวลาที่จองใหม่ชนกับเวลาที่มีอยู่หรือไม่
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
    setIsAddBookingOpen(true); // เปิดฟอร์มการเพิ่มการจอง
    resetForm(); // รีเซ็ตข้อมูลฟอร์ม
    setEditingBooking(null); // ยกเลิกการแก้ไขการจอง
    fetchBookingsByDate(dayjs().format("YYYY-MM-DD")); // ดึงการจองสำหรับวันที่ปัจจุบัน
  };

  // ฟังก์ชันส่งข้อมูลการจองเมื่อเพิ่มการจอง
  const handleAddBookingSubmit = async (e) => {
    e.preventDefault(); // หยุดการรีเฟรชหน้าเมื่อส่งฟอร์ม
    try {
      const output = {
        startTime: dayjs(`${formData.dueDate}T${formData.startTime}`),
        endTime: dayjs(`${formData.dueDate}T${formData.endTime}`),
        dueDate: dayjs(`${formData.dueDate}T${formData.startTime}`),
        totalCost: calculateTotalCost(), // คำนวณราคาทั้งหมด
        status: formData.status,
        fieldId: parseInt(formData.selectedField), // แปลง ID ของสนามเป็นตัวเลข
        userId: formData.userId ? parseInt(formData.userId) : null, // แปลง ID ของผู้ใช้เป็นตัวเลข
      };

      // ตรวจสอบการจองซ้ำ
      const isDuplicate = await checkDuplicateBooking(output);

      if (isDuplicate) {
        // ถ้ามีการจองซ้ำ, แสดงข้อความเตือน
        Swal.fire({
          title: "Error",
          text: "มีการจองในช่วงเวลาดังกล่าวอยู่แล้ว",
          icon: "error",
          confirmButtonText: "ตกลง",
        }).then(() => {
          // รอ 2 วินาทีแล้วไปที่หน้า /admin/manage/bookingfield
          setTimeout(() => {
            navigate("/admin/manage/bookingfield");
          }, 2000);
        });
        return;
      }

      // ถ้าไม่พบการจองซ้ำ, ส่งข้อมูลการจองไปยัง API
      const rs = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking/bookings/create/${
          output.userId
        }`,
        output
      );

      if (rs.status === 200) {
        // อัพเดตข้อมูลการจองในสถานะ
        setBookings((prev) => [...prev, rs.data]);
        // แสดงข้อความสำเร็จ
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
          window.location.reload(); // รีเฟรชหน้า
        });
        setIsAddBookingOpen(false); // ปิดฟอร์มการจอง
        resetForm(); // รีเซ็ตฟอร์ม
      } else {
        throw new Error("Failed to create new.");
      }
    } catch (err) {
      // หากเกิดข้อผิดพลาดในการสร้างการจอง, แสดงข้อความผิดพลาด
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      }).then(() => {
        // รอ 2 วินาทีแล้วไปที่หน้า /admin/manage/bookingfield
        setTimeout(() => {
          navigate("/admin/manage/bookingfield");
        }, 2000);
      });
    }
  };

  // ฟังก์ชันแก้ไข
  const handleEditBookingSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บเมื่อฟอร์มถูกส่ง

    try {
      // เตรียมข้อมูลที่ต้องการส่งไปยัง API เพื่อแก้ไขการจอง
      const output = {
        startTime: dayjs(`${formData.dueDate}T${formData.startTime}`), // แปลง startTime เป็นวันที่และเวลา
        endTime: dayjs(`${formData.dueDate}T${formData.endTime}`), // แปลง endTime เป็นวันที่และเวลา
        dueDate: dayjs(`${formData.dueDate}T${formData.startTime}`), // ใช้ dueDate และ startTime ในการตั้งวันและเวลา
        totalCost: calculateTotalCost(), // คำนวณค่าใช้จ่ายทั้งหมดจากฟังก์ชัน calculateTotalCost
        status: formData.status, // สถานะของการจอง
        fieldId: parseInt(formData.selectedField, 10), // แปลง selectedField ให้เป็นหมายเลข (ID ของสนาม)
        userId: formData.userId ? parseInt(formData.userId, 10) : null, // แปลง userId เป็นหมายเลขหากมี
      };

      // ส่งคำขอ PUT ไปยัง API เพื่ออัปเดตข้อมูลการจอง
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/booking/bookings/${editingBooking.id}`,
        output // ส่งข้อมูลการจองใหม่
      );

      // อัปเดตข้อมูลการจองในสเตตาของแอป โดยการแทนที่ข้อมูลของการจองที่ถูกแก้ไข
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === editingBooking.id ? response.data : booking
        )
      );

      // ปิดฟอร์มการแก้ไขและรีเซ็ตฟอร์ม
      setEditingBooking(null); // ปิดฟอร์มการแก้ไข
      resetForm(); // รีเซ็ตฟอร์ม

      // แสดงข้อความสำเร็จ
      Swal.fire(
        "Updated!",
        "Booking details have been updated.",
        "success"
      ).then(() => {
        // รอ 2 วินาทีหลังจากแสดงข้อความสำเร็จแล้วไปที่หน้า /admin/manage/bookingfield
        setTimeout(() => {
          navigate("/admin/manage/bookingfield");
        }, 1000);
      });
    } catch (error) {
      // หากเกิดข้อผิดพลาดในกระบวนการแก้ไขการจอง
      console.error("Error updating booking:", error);

      // แสดงข้อความข้อผิดพลาด
      const errorMessage =
        error.response?.data?.message ||
        "There was an error while updating the booking."; // ข้อความจาก API หรือข้อความผิดพลาดทั่วไป

      Swal.fire("Error!", errorMessage, "error");
    }
  };

  const resetForm = () => {
    // รีเซ็ตข้อมูลฟอร์มกลับไปที่ค่าพื้นฐาน
    setFormData({
      dueDate: dayjs().format("YYYY-MM-DD"), // ตั้งค่าหมายเลขวันเป็นวันที่ปัจจุบัน
      startTime: "", // ตั้งค่า startTime เป็นค่าว่าง
      endTime: "", // ตั้งค่า endTime เป็นค่าว่าง
      selectedField: "", // ตั้งค่า selectedField เป็นค่าว่าง
      status: "", // ตั้งค่า status เป็นค่าว่าง
      userId: "", // ตั้งค่า userId เป็นค่าว่าง
    });

    setSelectedFieldPrice(0); // รีเซ็ตค่า selectedFieldPrice เป็น 0
    // การตั้งค่า setBookedTimes ถูกลบออกไปแล้ว
  };

  const handleDeleteClick = async (booking) => {
    // แสดงข้อความยืนยันการลบการจองด้วย SweetAlert
    Swal.fire({
      title: `แน่ใจว่าต้องการลบ ${booking.field.name}?`, // ถามยืนยันว่าจะลบการจองของสนามนี้หรือไม่
      text: "This action cannot be undone.", // แจ้งเตือนว่าไม่สามารถย้อนกลับได้
      icon: "warning", // ใช้ไอคอนเตือน
      showCancelButton: true, // แสดงปุ่มยกเลิก
      confirmButtonColor: "#d33", // กำหนดสีของปุ่มยืนยันเป็นสีแดง
      cancelButtonColor: "#3085d6", // กำหนดสีของปุ่มยกเลิกเป็นสีน้ำเงิน
      confirmButtonText: "Yes, delete it!", // ข้อความในปุ่มยืนยัน
    }).then(async (result) => {
      // เมื่อผู้ใช้ตอบคำถามยืนยัน
      if (result.isConfirmed) {
        try {
          // ลบ booking โดยใช้คำขอ DELETE
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/booking/bookings/${booking.id}`
          );

          // อัปเดตข้อมูลในตารางโดยการลบการจองที่ถูกลบออก
          setBookings((prevBookings) =>
            prevBookings.filter((b) => b.id !== booking.id)
          );

          // แสดงข้อความยืนยันว่าได้ลบการจองเรียบร้อยแล้ว
          Swal.fire(
            "Deleted!", // ข้อความหัวเรื่อง
            `Booking for ${booking.field.name} has been deleted.`, // ข้อความรายละเอียด
            "success" // ประเภทของไอคอน (สำเร็จ)
          );
        } catch (error) {
          console.error("Error deleting booking:", error); // แสดงข้อผิดพลาดในคอนโซล
          // หากเกิดข้อผิดพลาดในการลบ ให้แสดงข้อความข้อผิดพลาด
          Swal.fire(
            "Error!", // ข้อความหัวเรื่อง
            "There was an error while deleting the booking.", // ข้อความรายละเอียด
            "error" // ประเภทของไอคอน (ข้อผิดพลาด)
          );
        }
      }
    });
  };

  const handleEditClick = (booking) => {
    // ตั้งค่าการจองที่กำลังแก้ไข
    setEditingBooking(booking);

    // รีเซ็ตข้อมูลฟอร์มด้วยข้อมูลจากการจองที่เลือก
    setFormData({
      dueDate: dayjs(booking.dueDate).format("YYYY-MM-DD"), // ตั้งค่า dueDate ด้วยการแปลงวันที่
      startTime: dayjs(booking.startTime).format("HH:mm"), // ตั้งค่า startTime ด้วยการแปลงเวลา
      endTime: dayjs(booking.endTime).format("HH:mm"), // ตั้งค่า endTime ด้วยการแปลงเวลา
      selectedField: booking.field.id, // ตั้งค่า selectedField ด้วย ID ของสนามที่จอง
      status: booking.status, // ตั้งค่าสถานะการจอง
      userId: booking.user.id, // ตั้งค่า userId ด้วย ID ของผู้ใช้
    });

    // คำนวณราคาของสนามที่เลือก
    setSelectedFieldPrice(calculateFieldPrice(booking.field.id));

    // ตั้งค่า calendarDate ด้วยวันที่ของการจองที่เลือก
    setCalendarDate(new Date(dayjs(booking.dueDate).format("YYYY-MM-DD")));

    // ดึงข้อมูลการจองตามวันที่ที่เลือก
    fetchBookingsByDate(dayjs(booking.dueDate).format("YYYY-MM-DD"));
  };

  const renderTimeSlots = () => {
    const slotsPerRow = 4; // ปรับเป็น 4 ช่องในแต่ละแถว
    const rows = [];

    // แบ่ง timeSlots ออกเป็นแถวละ slotsPerRow ช่องเวลา
    for (let i = 0; i < timeSlots.length; i += slotsPerRow) {
      rows.push(timeSlots.slice(i, i + slotsPerRow));
    }

    // แสดงช่องเวลาแต่ละแถว
    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-between mb-2">
        {row.map((slot, index) => {
          // ตรวจสอบว่าเวลานี้ถูกจองแล้วหรือไม่
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
              title={isBooked ? "เวลานี้ถูกจองแล้ว" : "ว่าง"} // แสดงข้อความ tooltip
            >
              {slot} {/* แสดงช่องเวลานั้น */}
            </div>
          );
        })}
      </div>
    ));
  };

  const handleExport = async () => {
    if (!month || !year) {
      setError("Please select both month and year.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ส่งคำขอไปยัง API เพื่อดึงข้อมูลการจองตามเดือนและปี
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/export?month=${month}&year=${year}`,
        {
          responseType: "blob", // บอกให้ axios รับข้อมูลเป็นไฟล์
        }
      );

      // สร้าง URL สำหรับดาวน์โหลดไฟล์
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bookings-${month}-${year}.csv`); // กำหนดชื่อไฟล์ที่ดาวน์โหลด
      document.body.appendChild(link);
      link.click(); // คลิกเพื่อดาวน์โหลดไฟล์

      setLoading(false);
    } catch (err) {
      setError("Error exporting data.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header ส่วนหัว */}
        {/* แสดงชื่อหน้าจอและคำอธิบายการจัดการการจอง */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900">การจอง</h1>
          <p className="text-gray-600 mt-2">
            View, edit, and manage all field bookings in your system
          </p>
        </div>

        {/* ปุ่มสำหรับเปิดฟอร์มการเพิ่มการจองใหม่ */}
        <div className="mb-6">
          <button
            className="btn btn-primary"
            onClick={handleAddBookingOpen} // ใช้ฟังก์ชันเปิดฟอร์มการเพิ่มการจอง
          >
            เพิ่มการจองใหม่
          </button>
        </div>

        {/* ฟอร์มการค้นหาการจอง */}
        {/* ช่องค้นหาที่สามารถกรอกเพื่อค้นหาการจองจากชื่อสนามหรือผู้ใช้ */}
        <div className="form-control w-full max-w-xs mb-6">
          <label className="label">
            <span className="label-text">ค้นหาการจอง</span>
          </label>
          <input
            type="text"
            placeholder="ค้นหา"
            className="input input-bordered w-full"
          />
        </div>

        {/* การแสดงตารางการจอง */}
        {/* ถ้ากำลังโหลดจะแสดง loader */}
        {/* ถ้าข้อมูลโหลดเสร็จจะแสดงตารางข้อมูลการจอง */}
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
                  // คำนวณเวลาเริ่มต้นและสิ้นสุด
                  const startTime = new Date(booking.startTime);
                  const endTime = new Date(booking.endTime);

                  // คำนวณจำนวนชั่วโมงของการจอง
                  const hours = (endTime - startTime) / (1000 * 60 * 60); // เปลี่ยนเวลาเป็นชั่วโมง

                  // คำนวณราคารวม
                  const totalCost = hours * booking.field.pricePerHour;
                  const sortedBookings = bookings.sort(
                    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
                  ); // เรียงลำดับจากเก่าสุดไปใหม่สุด


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
                      <td>{hours} ชั่วโมง</td> {/* แสดงจำนวนชั่วโมง */}
                      <td>{totalCost.toFixed(2)} บาท</td> {/* แสดงราคารวม */}
                      <td>{booking.status}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm mr-2"
                          onClick={() => handleEditClick(booking)} // คลิกเพื่อแก้ไขการจอง
                        >
                          แก้ไข
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDeleteClick(booking)} // คลิกเพื่อทำการลบการจอง
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* โมดอลสำหรับเพิ่มการจองใหม่ */}
        {/* ฟอร์มการกรอกข้อมูลการจองใหม่ */}
        {isAddBookingOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
              <h2 className="text-xl font-semibold mb-4">เพิ่มการจอง</h2>
              <form onSubmit={handleAddBookingSubmit}>
                {/* ฟอร์มการกรอกข้อมูลวันและเวลา */}
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

                    {/* ฟอร์มการเลือกสนาม */}
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

                    {/* แสดงราคาต่อชั่วโมง */}
                    {selectedFieldPrice > 0 && (
                      <p className="mb-4 text-sm text-gray-600">
                        ราคาต่อชั่วโมง: {selectedFieldPrice} บาท
                      </p>
                    )}

                    {/* ฟอร์มการเลือกผู้ใช้ */}
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

                    {/* ฟอร์มหมายเหตุ */}
                    <label className="block text-gray-700">หมายเหตุ</label>
                    <input
                      type="text"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md mb-4"
                      placeholder="กรอกหมายเหตุ (ถ้ามี)"
                    />

                    {/* แสดงราคารวม */}
                    <div className="mb-4">
                      <label className="block text-gray-700">ราคารวม</label>
                      <p className="text-lg font-semibold">
                        {calculateTotalCost()} บาท
                      </p>
                    </div>
                  </div>

                  {/* ส่วนที่แสดงการตรวจสอบการจอง */}
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
                        <div className="mt-2">
                          {renderTimeSlots()} {/* แสดงเวลาที่ว่าง */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ปุ่มการยืนยันการเพิ่มการจอง */}
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
        {/* แสดงฟอร์มการแก้ไขการจอง */}
        {editingBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
              <h2 className="text-xl font-semibold mb-4">แก้ไขการจอง</h2>
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
                    <input
                      type="text"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md mb-4"
                      placeholder="กรอกหมายเหตุ (ถ้ามี)"
                    />

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
