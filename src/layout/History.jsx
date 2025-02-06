//ไม่ได้ใช้ เก็บไว้ก่อน

import React, { useState, useEffect } from "react"; // นำเข้า React, useState และ useEffect จาก React สำหรับจัดการสถานะและการดึงข้อมูล
import axios from "axios"; // นำเข้า Axios สำหรับทำการเรียก API
import dayjs from "dayjs"; // นำเข้า dayjs สำหรับจัดการวันที่และเวลา
import Swal from "sweetalert2"; // นำเข้า SweetAlert2 สำหรับการแสดงข้อความแจ้งเตือน
import useAuth from "../hooks/useAuth"; // นำเข้า custom hook useAuth เพื่อจัดการข้อมูลผู้ใช้

function History() {
  const [fields, setFields] = useState([]); // สถานะสำหรับเก็บข้อมูลสนาม
  const [bookings, setBookings] = useState([]); // สถานะสำหรับเก็บข้อมูลการจอง
  const [editingBookingId, setEditingBookingId] = useState(null); // สถานะสำหรับจัดการการแก้ไขการจอง
  const [editedBooking, setEditedBooking] = useState({
    // สถานะสำหรับเก็บข้อมูลการจองที่แก้ไข
    startTime: "",
    endTime: "",
    status: "",
  });
  const { user } = useAuth(); // ใช้ useAuth hook เพื่อดึงข้อมูลผู้ใช้

  // ดึงข้อมูลการจองของผู้ใช้จาก API เมื่อ Component ถูกโหลด
  useEffect(() => {
    async function fetchUserBookings() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/booking/bookings/${user.id}/id`
        );
        console.log("Response data:", response.data); // แสดงข้อมูลการจองใน console
        setBookings(response.data); // เก็บข้อมูลการจองที่ได้จาก API
      } catch (error) {
        console.error("Error fetching user bookings:", error); // แสดงข้อผิดพลาดถ้าดึงข้อมูลไม่สำเร็จ
      }
    }
    fetchUserBookings();
  }, []); // ดึงข้อมูลการจองเมื่อ Component โหลดครั้งแรก

  // ดึงข้อมูลสนามทั้งหมดจาก API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/field`
        );
        setFields(response.data); // เก็บข้อมูลสนามที่ได้จาก API
      } catch (error) {
        console.error("Error fetching fields:", error); // แสดงข้อผิดพลาดถ้าดึงข้อมูลสนามไม่สำเร็จ
      }
    }
    fetchData();
  }, []); // ดึงข้อมูลสนามเมื่อ Component โหลดครั้งแรก

  // ฟังก์ชันสำหรับฟอร์แมตวันที่และเวลาให้เป็นรูปแบบ "YYYY-MM-DD HH:mm"
  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format("DD/MM/YYYY HH:mm");
  };

  // ฟังก์ชันคำนวณราคาทั้งหมดของการจอง โดยใช้ราคาเป็นรายชั่วโมงของสนาม
  const calculateTotalPrice = (bookingId) => {
    const booking = bookings.find((booking) => booking.id === bookingId); // ค้นหาการจองที่ตรงกับ ID
    if (!booking) return 0; // ถ้าไม่พบการจอง return 0

    const field = fields.find((field) => field.id === booking.fieldId); // ค้นหาสนามที่ตรงกับ fieldId
    if (!field) return 0; // ถ้าไม่พบสนาม return 0

    const fieldPricePerHour = field.pricePerHour || 0; // ราคาเป็นรายชั่วโมงของสนาม
    const startTime = dayjs(booking.startTime); // เวลาเริ่มต้นของการจอง
    const endTime = dayjs(booking.endTime); // เวลาสิ้นสุดของการจอง
    const durationInHours = endTime.diff(startTime, "hour"); // คำนวณระยะเวลาเป็นชั่วโมง

    return fieldPricePerHour * durationInHours; // คำนวณราคารวมโดยการคูณราคาเป็นชั่วโมงกับระยะเวลา
  };

  // ฟังก์ชันสำหรับยกเลิกการแก้ไขการจอง
  const handleCancelEdit = () => {
    setEditingBookingId(null); // ตั้งค่า editingBookingId เป็น null เพื่อยกเลิกการแก้ไข
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงข้อมูลในฟอร์มแก้ไขการจอง
  const handleInputChange = (e) => {
    const { name, value } = e.target; // ดึงชื่อและค่าจาก input field
    setEditedBooking((prevEditedBooking) => ({
      ...prevEditedBooking,
      [name]: value, // อัปเดตข้อมูลที่แก้ไข
    }));
  };

  // ฟังก์ชันสำหรับลบการจอง
  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/booking/bookings/${id}`
      ); // เรียก API เพื่อลบการจอง
      setBookings(
        (prevBookings) => prevBookings.filter((booking) => booking.id !== id) // ลบการจองออกจาก state
      );

      console.log("Booking deleted successfully"); // แสดงข้อความใน console

      // แสดงข้อความแจ้งเตือนเมื่อการลบสำเร็จ
      Swal.fire({
        title: "Success",
        text: "ยกเลิกรายการจองเรียบร้อย",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    } catch (error) {
      console.error("Error deleting booking:", error); // แสดงข้อผิดพลาดใน console
      // แสดงข้อความแจ้งเตือนเมื่อการลบล้มเหลว
      Swal.fire({
        title: "Error",
        text: "เกิดข้อผิดพลาดในการยกเลิกรายการจอง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* header ของตาราง */}
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>วัน/เวลาเริ่มต้น</th>
              <th>วัน/เวลาสิ้นสุด</th>
              <th>สนาม</th>
              <th>ราคารวม</th> {/* เพิ่มคอลัมน์สำหรับราคารวม */}
              <th>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {/* การวนลูปการจองและแสดงผลในตาราง */}
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatDateTime(booking.startTime)}</td>
                <td>{formatDateTime(booking.endTime)}</td>
                <td>
                  {/* แสดงชื่อสนามที่ตรงกับ fieldId ของการจอง */}
                  {fields.find((field) => field.id === booking.fieldId)?.name}
                </td>
                <td>{calculateTotalPrice(booking.id)} บาท</td>{" "}
                {/* แสดงราคารวม */}
                <td>{booking.status}</td>
                <td>
                  {editingBookingId === booking.id ? (
                    <>{/* ฟอร์มสำหรับการแก้ไขจะถูกแสดงที่นี่ */}</>
                  ) : (
                    <button
                      className="btn btn-error m-2"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      ยกเลิก
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
