import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import useAuth from "../hooks/useAuth";

function HistoryBookings() {
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // ตรวจสอบว่ามี user หรือไม่ก่อนเรียก API

    const fetchData = async () => {
      try {
        const [bookingsRes, fieldsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/booking/bookings/historys/${user.id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/field`)
        ]);

        setBookings(bookingsRes.data);
        setFields(fieldsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const calculateTotalPrice = (booking) => {
    const field = fields.find(f => f.id === booking.fieldId);
    if (!field) return 0;

    const duration = dayjs(booking.endTime).diff(booking.startTime, 'hour');
    return (field.pricePerHour * duration).toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">ประวัติการจอง</h1>
      <div className="overflow-x-auto">
        {bookings.length > 0 ? (
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
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>{fields.find(f => f.id === booking.fieldId)?.name || "ไม่พบข้อมูลสนาม"}</td>
                  <td>{dayjs(booking.startTime).format('DD/MM/YYYY')}</td>
                  <td>{dayjs(booking.startTime).format('HH:mm')}</td>
                  <td>{dayjs(booking.endTime).format('HH:mm')}</td>
                  <td>
                    <span className={`badge ${
                      booking.status === 'Completed' ? 'badge-info' :
                      booking.status === 'Cancel' ? 'badge-error' : 'badge-warning'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{calculateTotalPrice(booking)} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center p-8 text-gray-500">
            ไม่พบประวัติการจอง
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryBookings;
