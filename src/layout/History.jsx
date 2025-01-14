import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

function History() {
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editedBooking, setEditedBooking] = useState({
    startTime: "",
    endTime: "",
    status: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserBookings() {
      try {

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/booking/bookings/${user.id}/id`
        );

        console.log("Response data:", response.data); // แสดงข้อมูลที่ได้รับมาจาก API ใน console

        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    }
    fetchUserBookings();
  }, []);

  useEffect(() => {
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

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format("YYYY-MM-DD HH:mm:ss");
  };

  const calculateTotalPrice = (bookingId) => {
    const booking = bookings.find((booking) => booking.id === bookingId);
    if (!booking) return 0;

    const field = fields.find((field) => field.id === booking.fieldId);
    if (!field) return 0;

    const fieldPricePerHour = field.pricePerHour || 0;
    const startTime = dayjs(booking.startTime);
    const endTime = dayjs(booking.endTime);
    const durationInHours = endTime.diff(startTime, "hour");

    return fieldPricePerHour * durationInHours;
  };

  const handleCancelEdit = () => {
    setEditingBookingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking((prevEditedBooking) => ({
      ...prevEditedBooking,
      [name]: value,
    }));
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(
        `https://back-2-hqew.onrender.com/booking/bookings/${id}`
      );
      

      // Remove the deleted booking from the local state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== id)
      );

      console.log("Booking deleted successfully");

      // Show success message using Swal
      Swal.fire({
        title: "Success",
        text: "ยกเลิกรายการจองเรียบร้อย",
        icon: "success",
        confirmButtonText: "ตกลง",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      // Show error message using Swal
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
          {/* head */}
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
            {/* map through bookings */}
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{formatDateTime(booking.startTime)}</td>
                <td>{formatDateTime(booking.endTime)}</td>
                <td>
                  {/* แสดงชื่อสนาม */}
                  {fields.find((field) => field.id === booking.fieldId)?.name}
                </td>
                <td>{calculateTotalPrice(booking.id)}</td> {/* แสดงราคารวม */}
                <td>{booking.status}</td>
                <td>
                  {editingBookingId === booking.id ? (
                    <>{/* Input fields for editing */}</>
                  ) : (
                    <>
                      <button
                        className="btn btn-error m-2"
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        ยกเลิก
                      </button>
                    </>
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