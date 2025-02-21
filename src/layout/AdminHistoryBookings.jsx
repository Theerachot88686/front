import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AdminHistoryBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/booking/bookings/history`
        );
        setBookings(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleShowSlip = (booking) => {
    if (booking.Payment?.slip) {
      const slipUrl = booking.Payment.slip; // ใช้ URL ของ ImgBB โดยตรง
  
      Swal.fire({
        title: "สลิปการชำระเงิน",
        imageUrl: slipUrl,
        imageAlt: "Payment Slip",
        confirmButtonText: "ปิด",
        confirmButtonColor: "#333", // ปรับสีปุ่มให้ดูสวยขึ้น
        width: "60%", // เพิ่มขนาดให้เหมาะสม
        padding: "2em", // ปรับระยะห่างภายในให้สมดุล
        background: "#f8f9fa", // ใช้พื้นหลังสีเทาอ่อน เพื่อให้ดูสะอาดตา
        imageWidth: 400, // ปรับขนาดของรูปภาพให้ใหญ่ขึ้น
        imageHeight: "auto", // ให้ภาพปรับขนาดอัตโนมัติ
        showClass: {
          popup: "animate__animated animate__fadeInDown", // เพิ่มแอนิเมชันตอนแสดง
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp", // เพิ่มแอนิเมชันตอนปิด
        },
      });
      
    } else {
      Swal.fire("No Slip", "ไม่พบสลิปการชำระเงิน", "info");
    }
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
          `รายงานการจองประจำเดือน-${month}-${year}.csv` // ตั้งชื่อไฟล์ที่ดาวน์โหลด
        ); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // ลบลิงก์หลังจากดาวน์โหลด
      } catch (error) {
        console.error("Error exporting bookings:", error);
        alert("ไม่สามารถส่งข้อมูลได้");
      }
    };

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
            Swal.fire({
              title: "Deleted!", // หัวข้อแจ้งเตือน
              text: `Booking for ${booking.field.name} has been deleted.`, // ข้อความแจ้งเตือน
              icon: "success", // ชนิดของแจ้งเตือน (สำเร็จ)
              customClass: {
                title: "text-green-600", // สีของหัวข้อ (สีเขียว)
                content: "text-gray-800", // สีของข้อความ (สีเทาเข้ม)
                confirmButton: "bg-green-500 text-white hover:bg-green-600", // สีของปุ่มยืนยัน (สีเขียว)
              },
            });
          } catch (error) {
            console.error("Error deleting booking:", error);
            Swal.fire({
              title: "Error!", // หัวข้อแจ้งเตือน
              text: "There was an error while deleting the booking.", // ข้อความแจ้งเตือน
              icon: "error", // ชนิดของแจ้งเตือน (ข้อผิดพลาด)
              customClass: {
                title: "text-red-600", // สีของหัวข้อ (สีแดง)
                content: "text-gray-800", // สีของข้อความ (สีเทาเข้ม)
                confirmButton: "bg-red-500 text-white hover:bg-red-600", // สีของปุ่มยืนยัน (สีแดง)
              },
            });
          }
        }
      });
    };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900">ประวัติการจอง</h1>
          <p className="text-gray-600 mt-2">ประวัติการจองทั้งหมด</p>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
            ดาวน์โหลดรายงานการจอง
          </h2>
          <div className="mt-4">
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
          </div>
        

        {loading ? (
          <div className="flex justify-center mt-6">Loading...</div>
          
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>สนาม</th>
                  <th>ผู้ใช้</th>
                  <th>วันที่จอง</th>
                  <th>เวลาที่ใช้</th>
                  <th>ราคารวม</th>
                  <th>สถานะ</th>
                  <th>สลิป</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => {
                  const start = dayjs(booking.startTime);
                  const end = dayjs(booking.endTime);
                  const hours = end.diff(start, 'hour');
                  const totalCost = hours * booking.field.pricePerHour;

                  return (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{booking.field.name}</td>
                      <td>{booking.user.username}</td>
                      <td>{start.format('DD/MM/YYYY')}</td>
                      <td>
                        {start.format('HH:mm')} - {end.format('HH:mm')}
                      </td>
                      <td>{totalCost.toFixed(2)} บาท</td>
                      <td>
                        <span className={`badge ${
                          booking.status === 'Completed' ? 'badge-success' : 
                          booking.status === 'Cancel' ? 'badge-error' : 'badge-warning'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-info btn-sm mr-2"
                          onClick={() => handleShowSlip(booking)}
                        >
                          ดูสลิป
                        </button>
                        <button
                          className="btn btn-error btn-sm mr-2"
                          onClick={() => handleDeleteClick(booking)}
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
      </div>
    </div>
  );
}