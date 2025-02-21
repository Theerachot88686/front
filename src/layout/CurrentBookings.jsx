import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

function CurrentBookings() {
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, fieldsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/booking/bookings/current/${user.id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/field`)
        ]);
        
        setBookings(bookingsRes.data);
        console.log(bookingsRes.data);
        setFields(fieldsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [user.id]);

  const calculateTotalPrice = (booking) => {
    const field = fields.find(f => f.id === booking.fieldId);
    if (!field) return 0;
    
    const duration = dayjs(booking.endTime).diff(booking.startTime, 'hour');
    console.log(field);
    return (field.pricePerHour * duration).toFixed(2);
  }; 

  const handleCancel = async (bookingId) => {
    try {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "การยกเลิกการจองไม่สามารถย้อนกลับได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ยกเลิก!',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        await axios.put(`${import.meta.env.VITE_API_URL}/booking/bookings/${bookingId}/cancel`);
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        
        Swal.fire({
          title: "ยกเลิกแล้ว!",
          text: "การจองของคุณถูกยกเลิกเรียบร้อย",
          icon: "success",
          iconColor: "#28a745", // ไอคอนสีเขียว
          background: "#d4edda", // พื้นหลังสีเขียวอ่อน
          color: "#155724", // ข้อความสีเขียวเข้ม
          confirmButtonColor: "#28a745", // ปุ่มสีเขียว
          confirmButtonText: "ตกลง",
        });
        
      }
    } catch (error) {
      console.error("Cancel error:", error);
      Swal.fire('ผิดพลาด!', 'เกิดข้อผิดพลาดในการยกเลิก', 'error');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-green-600">การจองปัจจุบัน</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>สนาม</th>
              <th>วันที่จอง</th>
              <th>เวลาเริ่ม</th>
              <th>เวลาสิ้นสุด</th>
              <th>สถานะ</th>
              <th>ราคา</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking.id}>
                <td>{index + 1}</td>
                <td>{fields.find(f => f.id === booking.fieldId)?.name}</td>
                <td>{dayjs(booking.startTime).format('DD/MM/YYYY')}</td>
                <td>{dayjs(booking.startTime).format('HH:mm')}</td>
                <td>{dayjs(booking.endTime).format('HH:mm')}</td>
                <td>
                  <span className={`badge ${booking.status === 'Confirm' ? 'badge-success' : 'badge-warning'}`}>
                    {booking.status}
                  </span>
                </td>
                <td>{calculateTotalPrice(booking)} บาท</td>
                <td>
                  {booking.status === 'Pending' && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="btn btn-error btn-sm"
                    >
                      ยกเลิกการจอง
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            ไม่มีการจองในปัจจุบัน
          </div>
        )}
      </div>
    </div>
  );
}

export default CurrentBookings;