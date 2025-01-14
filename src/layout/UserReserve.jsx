import axios from "axios";  // ใช้ axios ในการเรียกข้อมูลจาก API
import { useState, useEffect } from "react";  // ใช้ useState และ useEffect สำหรับการจัดการสถานะใน React
import dayjs from "dayjs";  // ใช้ dayjs ในการจัดการกับวันที่
import Swal from "sweetalert2";  // ใช้ SweetAlert2 สำหรับแสดงข้อความแจ้งเตือน
import 'react-calendar/dist/Calendar.css';  // นำเข้าสตายล์ของ react-calendar
import Calendar from 'react-calendar';  // ใช้ Calendar component จาก react-calendar
import useAuth from "../hooks/useAuth";  // ใช้ hook สำหรับการจัดการการตรวจสอบผู้ใช้งาน
import { useNavigate } from 'react-router-dom'  // ใช้ useNavigate สำหรับการนำทางระหว่างหน้าใน React Router

export default function UserReserve() {
  const { user } = useAuth();  // ดึงข้อมูลผู้ใช้งานจาก useAuth
  const [input, setInput] = useState({
    dueDate: dayjs().format('YYYY-MM-DD'),  // กำหนดวันที่ปัจจุบันเป็นค่าเริ่มต้น
    startTime: "",
    endTime: "",
    selectedField: "",
    status: "",
  });
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับนำทาง

  const [selectedFieldPrice, setSelectedFieldPrice] = useState(0);  // ใช้เก็บราคาสนามที่เลือก
  const [fields, setFields] = useState([]);  // ใช้เก็บรายการสนามที่มี
  const [existingBookings, setExistingBookings] = useState([]);  // ใช้เก็บรายการการจองที่มีอยู่แล้ว
  const [calendarDate, setCalendarDate] = useState(new Date());  // ใช้เก็บวันที่ที่เลือกจากปฏิทิน
  const [bookedTimes, setBookedTimes] = useState([]);  // ใช้เก็บเวลาในการจองที่มีอยู่

  const timeSlots = [  // กำหนดช่วงเวลาในการจอง
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const hdlChange = (e) => {  // ฟังก์ชันจัดการการเปลี่ยนแปลงของฟอร์ม
    const { name, value } = e.target;  // ดึงชื่อและค่าจากฟอร์ม
    setInput((prevState) => ({ ...prevState, [name]: value }));  // อัพเดทสถานะของ input

    if (name === "selectedField") {  // หากเปลี่ยนสนาม
      const price = calculateFieldPrice(value);  // คำนวณราคาของสนามที่เลือก
      setSelectedFieldPrice(price);  // อัพเดทราคาของสนาม
    }

    if (name === "dueDate") {  // หากเปลี่ยนวันที่
      fetchBookings(value);  // ดึงข้อมูลการจองในวันที่ใหม่
    }
  };

  const calculateFieldPrice = (selectedField) => {  // คำนวณราคาต่อชั่วโมงของสนาม
    const field = fields.find((field) => field.id == selectedField);  // ค้นหาสนามที่เลือก
    return field ? field.pricePerHour : 0;  // คืนค่าราคาของสนาม หรือ 0 ถ้าไม่พบ
  };

  const calculateTotalCost = () => {  // คำนวณราคาทั้งหมดจากเวลาที่เลือก
    const start = new Date(`2000-01-01T${input.startTime}`);
    const end = new Date(`2000-01-01T${input.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);  // คำนวณจำนวนชั่วโมงที่จอง
    return hours * selectedFieldPrice;  // คำนวณราคาทั้งหมด
  };

  const fetchBookings = async (date) => {  // ฟังก์ชันดึงข้อมูลการจองจาก API ตามวันที่
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/bookings/all?dueDate=${date}`
      );
      const filteredBookings = response.data.filter(
        booking => dayjs(booking.dueDate).format('YYYY-MM-DD') === date  // กรองการจองตามวันที่
      );
      setExistingBookings(filteredBookings);  // อัพเดทสถานะการจองที่มีอยู่แล้ว
      const times = filteredBookings.map(booking => ({
        startTime: dayjs(booking.startTime).format('HH:mm'),
        endTime: dayjs(booking.endTime).format('HH:mm'),
      }));
      setBookedTimes(times);  // อัพเดทเวลาในการจองที่มีอยู่แล้ว
    } catch (error) {
      console.error("Error fetching existing bookings:", error);  // ถ้ามีข้อผิดพลาดในการดึงข้อมูล
    }
  };

  const checkDuplicateBooking = async (output) => {  // ฟังก์ชันตรวจสอบการจองซ้ำ
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/booking/bookings/${user.id}/id?dueDate=${output.dueDate}&fieldId=${output.fieldId}`
      );
      const bookings = response.data;

      return bookings.some((booking) => {  // ตรวจสอบว่าเวลาที่เลือกซ้ำกับการจองที่มีอยู่หรือไม่
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
      console.error("Error checking duplicate booking:", error);  // ถ้ามีข้อผิดพลาดในการตรวจสอบ
      return false;
    }
  };

  const hdlSubmit = async (e) => {  // ฟังก์ชันจัดการการส่งข้อมูลการจอง
    try {
      e.preventDefault();  // หยุดการกระทำค่าเริ่มต้นของฟอร์ม
      const output = {  // เตรียมข้อมูลการจองที่จะแสดง
        startTime: dayjs(`${input.dueDate}T${input.startTime}`),
        endTime: dayjs(`${input.dueDate}T${input.endTime}`),
        dueDate: dayjs(`${input.dueDate}T${input.startTime}`),
        totalCost: calculateTotalCost(),
        status: input.status,
        fieldId: parseInt(input.selectedField),
      };

      const isDuplicate = await checkDuplicateBooking(output);  // ตรวจสอบว่ามีการจองซ้ำหรือไม่

      if (isDuplicate) {  // หากมีการจองซ้ำ
        Swal.fire({
          title: "Error",
          text: "มีการจองในช่วงเวลาดังกล่าวอยู่แล้ว",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      const rs = await axios.post(  // ส่งข้อมูลการจองใหม่ไปยัง API
        `${import.meta.env.VITE_API_URL}/booking/bookings/create/${user.id}`,
        output,
      );

      if (rs.status === 200) {  // ถ้าการจองสำเร็จ
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

  useEffect(() => {  // ดึงข้อมูลสนามทั้งหมดเมื่อเริ่มโหลด
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/field`
        );
        setFields(response.data);
      } catch (error) {
        console.error("Error fetching fields:", error);  // ถ้ามีข้อผิดพลาดในการดึงข้อมูลสนาม
      }
    }
    fetchData();
  }, []);

  useEffect(() => {  // ดึงข้อมูลการจองที่มีอยู่แล้วเมื่อวันที่ในปฏิทินเปลี่ยนแปลง
    fetchBookings(dayjs(calendarDate).format('YYYY-MM-DD'));
  }, [calendarDate]);

  const renderTimeSlots = () => {  // ฟังก์ชันสำหรับการแสดงช่วงเวลาที่สามารถจองได้
    const rows = [];
    for (let i = 0; i < timeSlots.length; i += 5) {  // แบ่งเวลาเป็นแถวๆ
      rows.push(timeSlots.slice(i, i + 5));
    }

    return rows.map((row, rowIndex) => (  // แสดงแถวเวลาในฟอร์ม
      <div key={rowIndex} className="flex justify-between mb-2">
        {row.map((slot, index) => {  // แสดงแต่ละช่วงเวลา
          const isBooked = bookedTimes.some(
            time => slot >= time.startTime && slot < time.endTime  // ตรวจสอบว่าเวลานั้นถูกจองหรือไม่
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
              setCalendarDate(date);  // เมื่อเลือกวันที่จากปฏิทิน
              fetchBookings(dayjs(date).format('YYYY-MM-DD'));  // ดึงข้อมูลการจองของวันที่นั้น
            }}
            value={calendarDate}  // วันที่ในปฏิทิน
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
