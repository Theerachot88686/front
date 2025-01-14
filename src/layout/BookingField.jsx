import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useAuth from "../hooks/useAuth";

export default function BookingField() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // สถานะสำหรับการแก้ไข
  const [editingBooking, setEditingBooking] = useState(null);

  // สถานะสำหรับการเพิ่ม
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);

  // ฟอร์มข้อมูลการจอง
  const [formData, setFormData] = useState({
    dueDate: dayjs().format('YYYY-MM-DD'),
    startTime: "",
    endTime: "",
    selectedField: "",
    status: "",
    userId: "",
  });

  // สถานะเพิ่มเติมจาก UserReserve
  const [fields, setFields] = useState([]);
  const [users, setUsers] = useState([]); // เก็บรายชื่อผู้ใช้
  const [existingBookings, setExistingBookings] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState([]);
  const [selectedFieldPrice, setSelectedFieldPrice] = useState(0);
  
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // ดึงข้อมูล bookings ทั้งหมด
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/booking`);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Swal.fire("Error!", "There was an error fetching the bookings.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ดึงข้อมูล fields
  useEffect(() => {
    async function fetchFields() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/field`);
        setFields(response.data);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    }
    fetchFields();
  }, []);

  // ดึงข้อมูล users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchBookingsByDate(dayjs(calendarDate).format('YYYY-MM-DD'));
  }, [calendarDate]);

  const fetchBookingsByDate = async (date) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/bookings/all?dueDate=${date}`
      );
      const filteredBookings = response.data.filter(
        booking => dayjs(booking.dueDate).format('YYYY-MM-DD') === date
      );
      setExistingBookings(filteredBookings);
      const times = filteredBookings.map(booking => ({
        startTime: dayjs(booking.startTime).format('HH:mm'),
        endTime: dayjs(booking.endTime).format('HH:mm'),
      }));
      setBookedTimes(times);
    } catch (error) {
      console.error("Error fetching existing bookings:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "selectedField") {
      const price = calculateFieldPrice(value);
      setSelectedFieldPrice(price);
    }

    if (name === "dueDate") {
      setCalendarDate(new Date(value));
      fetchBookingsByDate(value);
    }
  };

  const calculateFieldPrice = (selectedField) => {
    const field = fields.find((f) => f.id == selectedField);
    return field ? field.pricePerHour : 0;
  };

  const calculateTotalCost = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours * selectedFieldPrice;
  };

  const checkDuplicateBooking = async (output) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/bookings/${user.id}/id?dueDate=${output.dueDate}&fieldId=${output.fieldId}`
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

  const handleAddBookingOpen = () => {
    setIsAddBookingOpen(true);
    resetForm();
    setEditingBooking(null);
    // Optionally fetch bookings again if necessary
    fetchBookingsByDate(dayjs().format('YYYY-MM-DD'));
  };

  const handleAddBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const output = {
        startTime: dayjs(`${formData.dueDate}T${formData.startTime}`),
        endTime: dayjs(`${formData.dueDate}T${formData.endTime}`),
        dueDate: dayjs(`${formData.dueDate}T${formData.startTime}`),
        totalCost: calculateTotalCost(),
        status: formData.status,
        fieldId: parseInt(formData.selectedField),
        userId: formData.userId ? parseInt(formData.userId) : null,
      };

      const isDuplicate = await checkDuplicateBooking(output);

      if (isDuplicate) {
        Swal.fire({
          title: "Error",
          text: "มีการจองในช่วงเวลาดังกล่าวอยู่แล้ว",
          icon: "error",
          confirmButtonText: "ตกลง",
        }).then(() => {
          window.location.reload();
        });
        return;
      }

      const rs = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking/bookings/create/${output.userId}`,
        output
      );

      if (rs.status === 200) {
        // อัปเดตตาราง
        setBookings(prev => [...prev, rs.data]);
        Swal.fire({
          title: "Success",
          text: `กรุณาบันทึกหน้าจอ \nวันที่จอง: ${formData.dueDate}\nเวลาเริ่มต้น: ${formData.startTime}\nเวลาสิ้นสุด: ${formData.endTime}\nราคาต่อชั่วโมง: ${selectedFieldPrice} บาท\nราคารวม: ${calculateTotalCost()} บาท`,
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
        window.location.reload();
      });
    }
};


const handleEditBookingSubmit = async (e) => {
  e.preventDefault();

  try {
    const output = {
      startTime: dayjs(`${formData.dueDate}T${formData.startTime}`),
      endTime: dayjs(`${formData.dueDate}T${formData.endTime}`),
      dueDate: dayjs(`${formData.dueDate}T${formData.startTime}`),
      totalCost: calculateTotalCost(),
      status: formData.status,
      fieldId: parseInt(formData.selectedField, 10),
      userId: formData.userId ? parseInt(formData.userId, 10) : null,
    };

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/booking/bookings/${editingBooking.id}`,
      output // ส่งข้อมูลการจองใหม่
    );

    // อัปเดตข้อมูลในตาราง
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === editingBooking.id ? response.data : booking
      )
    );

    setEditingBooking(null); // ปิดฟอร์มการแก้ไข
    resetForm(); // รีเซ็ตฟอร์ม

    Swal.fire("Updated!", "Booking details have been updated.", "success");
  } catch (error) {
    console.error("Error updating booking:", error);

    const errorMessage =
      error.response?.data?.message || "There was an error while updating the booking.";

    Swal.fire("Error!", errorMessage, "error");
  }
};



  const resetForm = () => {
    setFormData({
      dueDate: dayjs().format('YYYY-MM-DD'),
      startTime: "",
      endTime: "",
      selectedField: "",
      status: "",
      userId: "",
    });
    setSelectedFieldPrice(0);
    // Remove the following line
    // setBookedTimes([]);
  };
  
  const handleDeleteClick = async (booking) => {
    Swal.fire({
      title: `Are you sure you want to delete booking for ${booking.field.name}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ลบ booking โดยไม่มี token
          await axios.delete(`${import.meta.env.VITE_API_URL}/booking/bookings/${booking.id}`);
          
          // อัปเดตข้อมูลในตาราง
          setBookings((prevBookings) => prevBookings.filter((b) => b.id !== booking.id));
  
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
  
  

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setFormData({
      dueDate: dayjs(booking.dueDate).format('YYYY-MM-DD'),
      startTime: dayjs(booking.startTime).format('HH:mm'),
      endTime: dayjs(booking.endTime).format('HH:mm'),
      selectedField: booking.field.id,
      status: booking.status,
      userId: booking.user.id,
    });
    setSelectedFieldPrice(calculateFieldPrice(booking.field.id));
    setCalendarDate(new Date(dayjs(booking.dueDate).format('YYYY-MM-DD')));
    fetchBookingsByDate(dayjs(booking.dueDate).format('YYYY-MM-DD'));
  };

  const renderTimeSlots = () => {
    const rows = [];
    for (let i = 0; i < timeSlots.length; i += 5) {
      rows.push(timeSlots.slice(i, i + 5));
    }

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-between mb-2">
        {row.map((slot, index) => {
          const isBooked = bookedTimes.some(
            time => slot >= time.startTime && slot < time.endTime
          );

          return (
            <div
              key={index}
              className={`w-1/5 text-center p-2 rounded ${
                isBooked ? 'bg-red-200 text-red-700 line-through cursor-not-allowed' : 'bg-green-200 text-green-700 hover:bg-green-300 cursor-pointer'
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-600 mt-2">View, edit, and manage all field bookings in your system</p>
        </div>

        {/* Button to Open Add New Booking Form */}
        <div className="mb-6">
        <button
            className="btn btn-primary"
            onClick={handleAddBookingOpen} // Use the updated handler
          >
            Add New Booking
          </button>
        </div>

        {/* Search Section */}
        <div className="form-control w-full max-w-xs mb-6">
          <label className="label">
            <span className="label-text">Search Bookings</span>
          </label>
          <input
            type="text"
            placeholder="Search by field name or user"
            className="input input-bordered w-full"
          />
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Field Name</th>
                  <th>User</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Due Date</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td>{index + 1}</td>
                    <td>{booking.field.name}</td>
                    <td>{booking.user.username}</td>
                    <td>{new Date(booking.startTime).toLocaleString()}</td>
                    <td>{new Date(booking.endTime).toLocaleString()}</td>
                    <td>{new Date(booking.dueDate).toLocaleDateString()}</td>
                    <td>{booking.totalCost}</td>
                    <td>{booking.status}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEditClick(booking)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeleteClick(booking)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add New Booking Modal */}
        {isAddBookingOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
              <h2 className="text-xl font-semibold mb-4">Add New Booking</h2>
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
                        <label className="block text-gray-700">เวลาเริ่มต้น</label>
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
                        <label className="block text-gray-700">เวลาสิ้นสุด</label>
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
                      <p className="mb-4 text-sm text-gray-600">ราคาต่อชั่วโมง: {selectedFieldPrice} บาท</p>
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
                      <p className="text-lg font-semibold">{calculateTotalCost()} บาท</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-4">
                    <h3 className="text-lg font-semibold mb-2">ตรวจสอบการจอง</h3>
                    <Calendar
                      onChange={(date) => {
                        setCalendarDate(date);
                        setFormData(prev => ({ ...prev, dueDate: dayjs(date).format('YYYY-MM-DD')}));
                        fetchBookingsByDate(dayjs(date).format('YYYY-MM-DD'));
                      }}
                      value={calendarDate}
                      className="mb-6"
                    />
                    <div>
                      <h4 className="text-md font-medium mb-2">
                        การจองในวันที่ {dayjs(calendarDate).format('DD-MM-YYYY')}
                      </h4>
                      <div>
                        <h5 className="text-sm font-medium">เวลาที่ว่าง:</h5>
                        <div className="mt-2">
                          {renderTimeSlots()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button type="submit" className="btn btn-primary mr-2">
                    Add Booking
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsAddBookingOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {editingBooking && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
              <h2 className="text-xl font-semibold mb-4">Edit Booking</h2>
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
                        <label className="block text-gray-700">เวลาเริ่มต้น</label>
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
                        <label className="block text-gray-700">เวลาสิ้นสุด</label>
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
                      <p className="mb-4 text-sm text-gray-600">ราคาต่อชั่วโมง: {selectedFieldPrice} บาท</p>
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
                      <p className="text-lg font-semibold">{calculateTotalCost()} บาท</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 md:pl-4">
                    <h3 className="text-lg font-semibold mb-2">ตรวจสอบการจอง</h3>
                    <Calendar
                      onChange={(date) => {
                        setCalendarDate(date);
                        setFormData(prev => ({ ...prev, dueDate: dayjs(date).format('YYYY-MM-DD')}));
                        fetchBookingsByDate(dayjs(date).format('YYYY-MM-DD'));
                      }}
                      value={calendarDate}
                      className="mb-6"
                    />
                    <div>
                      <h4 className="text-md font-medium mb-2">
                        การจองในวันที่ {dayjs(calendarDate).format('DD-MM-YYYY')}
                      </h4>
                      <div>
                        <h5 className="text-sm font-medium">เวลาที่ว่าง:</h5>
                        <div className="mt-2">
                          {renderTimeSlots()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button type="submit" className="btn btn-primary mr-2">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingBooking(null)}
                  >
                    Cancel
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
