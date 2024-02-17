import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";


function History() {
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editedBooking, setEditedBooking] = useState({
    startTime: "",
    endTime: "",
    status: ""
  });

  useEffect(() => {
    async function fetchUserBookings() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const response = await axios.get(
          `http://localhost:8889/booking/bookings?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
        const response = await axios.get("http://localhost:8889/field/getfield");
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
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8889/booking/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted booking from the local state
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== id)
      );

      console.log("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th>วัน/เวลาเริ่มต้น</th>
              <th>วัน/เวลาสิ้นสุด</th>
              <th>สนาม</th>
              <th>หมายเหตุ</th>
              
            </tr>
          </thead>
          <tbody>
            {/* map through bookings */}
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                {formatDateTime(booking.startTime)}
                </td>
                <td>
                {formatDateTime(booking.endTime)}
                </td>
                <td>
                  {/* แสดงชื่อสนาม */}
                  {fields.find((field) => field.id === booking.fieldId)?.name}
                </td>
                <td>
                  {booking.status}
                </td>
                <td>
                  {editingBookingId === booking.id ? (
                    <>
                    </>
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
