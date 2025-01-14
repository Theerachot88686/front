import axios from "axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import useAuth from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom'

export default function UserReserve() {
  const { user } = useAuth();
  const [input, setInput] = useState({
    dueDate: dayjs().format('YYYY-MM-DD'),
    startTime: "",
    endTime: "",
    selectedField: "",
    status: "",
  });
  const navigate = useNavigate(); // ใช้ useNavigate จาก react-router-dom

  const [selectedFieldPrice, setSelectedFieldPrice] = useState(0);
  const [fields, setFields] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState([]);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const hdlChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({ ...prevState, [name]: value }));

    if (name === "selectedField") {
      const price = calculateFieldPrice(value);
      setSelectedFieldPrice(price);
    }

    if (name === "dueDate") {
      fetchBookings(value);
    }
  };

  const calculateFieldPrice = (selectedField) => {
    const field = fields.find((field) => field.id == selectedField);
    return field ? field.pricePerHour : 0;
  };

  const calculateTotalCost = () => {
    const start = new Date(`2000-01-01T${input.startTime}`);
    const end = new Date(`2000-01-01T${input.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return hours * selectedFieldPrice;
  };

  const fetchBookings = async (date) => {
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

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      const output = {
        startTime: dayjs(`${input.dueDate}T${input.startTime}`),
        endTime: dayjs(`${input.dueDate}T${input.endTime}`),
        dueDate: dayjs(`${input.dueDate}T${input.startTime}`),
        totalCost: calculateTotalCost(),
        status: input.status,
        fieldId: parseInt(input.selectedField),
      };

      const isDuplicate = await checkDuplicateBooking(output);

      if (isDuplicate) {
        Swal.fire({
          title: "Error",
          text: "มีการจองในช่วงเวลาดังกล่าวอยู่แล้ว",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      const rs = await axios.post(
        `${import.meta.env.VITE_API_URL}/booking/bookings/create/${user.id}`,
        output,
      );

      if (rs.status === 200) {
        Swal.fire({
          title: "Success",
          text: `กรุณาบันทึกหน้าจอ เพื่อให้พนักงานตรวจสอบ\n\nวันที่จอง: ${
            input.dueDate
          }\nเวลาเริ่มต้น: ${input.startTime}\nเวลาสิ้นสุด: ${
            input.endTime
          }\nสนามที่เลือก: ${
            fields.find((field) => field.id === parseInt(input.selectedField))
              ?.name
          }\nราคาต่อชั่วโมง: ${selectedFieldPrice} บาท\nราคารวม: ${calculateTotalCost()} บาท`,
          icon: "success",
          confirmButtonText: "เรียบร้อย",
        });
        setTimeout(() => {
        navigate("/history");
      }, 2000);
      } else {
        throw new Error("Failed to create new.");
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

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

  useEffect(() => {
    fetchBookings(dayjs(calendarDate).format('YYYY-MM-DD'));
  }, [calendarDate]);

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
    <div className="flex flex-col md:flex-row justify-center items-start min-h-screen px-4 py-8 bg-gray-100">
      {/* ฟอร์มการจอง */}
      <div className="card w-full max-w-md shadow-lg bg-white p-6 rounded-lg mb-6 md:mb-0 md:mr-6">
        <h1 className="text-3xl font-bold text-center mb-6">จองสนาม</h1>
        <form onSubmit={hdlSubmit}>
          <fieldset className="mb-4">
            <legend className="text-lg font-semibold mb-2">ข้อมูลการจอง</legend>
            <div className="mb-4">
              <label className="block text-gray-700">วันที่จอง</label>
              <input
                type="date"
                name="dueDate"
                value={input.dueDate}
                onChange={hdlChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-gray-700">เวลาเริ่มต้น</label>
                <input
                  type="time"
                  name="startTime"
                  value={input.startTime}
                  onChange={hdlChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700">เวลาสิ้นสุด</label>
                <input
                  type="time"
                  name="endTime"
                  value={input.endTime}
                  onChange={hdlChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">เลือกสนาม</label>
              <select
                name="selectedField"
                value={input.selectedField}
                onChange={hdlChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
                <p className="mt-2 text-sm text-gray-600">ราคาต่อชั่วโมง: {selectedFieldPrice} บาท</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">หมายเหตุ</label>
              <input
                type="text"
                name="status"
                value={input.status}
                onChange={hdlChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="กรอกหมายเหตุ (ถ้ามี)"
              />
            </div>
          </fieldset>
          <div className="mb-4">
            <label className="block text-gray-700">ราคารวม</label>
            <p className="text-lg font-semibold">{calculateTotalCost() || 0} บาท</p>
          </div>
          <button type="submit" className="btn btn-success w-full">
            ยืนยัน
          </button>
        </form>
      </div>

      {/* ปฏิทินและการจองที่มีอยู่แล้ว */}
      <div className="card w-full max-w-md shadow-lg bg-white p-6 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-4">ตรวจสอบการจอง</h2>
          <Calendar
            onChange={(date) => {
              setCalendarDate(date);
              fetchBookings(dayjs(date).format('YYYY-MM-DD'));
            }}
            value={calendarDate}
            className="mb-6"
          />
          <div>
            <h3 className="text-xl font-semibold mb-2">
              การจองในวันที่ {dayjs(calendarDate).format('DD-MM-YYYY')}
            </h3>
            <div>
              <h4 className="text-lg font-medium">เวลาที่ว่าง:</h4>
              <div className="mt-2">
                {renderTimeSlots()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
