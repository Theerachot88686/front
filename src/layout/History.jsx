import React, { useState, useEffect } from "react";
import axios from "axios";

function History() {
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
        const response = await axios.get(
          "http://localhost:8889/booking/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    }
    fetchUserBookings();
  }, []);

  const handleEditBooking = (id, bookingData) => {
    setEditingBookingId(id);
    setEditedBooking(bookingData);
  };

  const handleSaveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8889/booking/bookings/${id}`,
        editedBooking,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the local state with the edited booking
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === id ? { ...booking, ...editedBooking } : booking
        )
      );

      // Reset the editing state
      setEditingBookingId(null);

      console.log("Booking updated successfully");
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingBookingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking((prevEditedBooking) => ({
      ...prevEditedBooking,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* map through bookings */}
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {editingBookingId === booking.id ? (
                    <input
                      type="text"
                      name="startTime"
                      value={editedBooking.startTime}
                      onChange={handleInputChange}
                    />
                  ) : (
                    booking.startTime
                  )}
                </td>
                <td>
                  {editingBookingId === booking.id ? (
                    <input
                      type="text"
                      name="endTime"
                      value={editedBooking.endTime}
                      onChange={handleInputChange}
                    />
                  ) : (
                    booking.endTime
                  )}
                </td>
                <td>
                  {editingBookingId === booking.id ? (
                    <input
                      type="text"
                      name="status"
                      value={editedBooking.status}
                      onChange={handleInputChange}
                    />
                  ) : (
                    booking.status
                  )}
                </td>
                <td>
                  {editingBookingId === booking.id ? (
                    <>
                      <button
                        className="btn btn-outline btn-success m-2"
                        onClick={() => handleSaveEdit(booking.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-outline btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-outline btn-warning m-2"
                        onClick={() => handleEditBooking(booking.id, booking)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline btn-danger"
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        Delete
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