import axios from "axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";

export default function UserReserve() {
  const [input, setInput] = useState({
    dueDate: new Date(),
    startTime: "",
    endTime: "",
    selectedField: "",
    status: "",
  });

  const [selectedFieldPrice, setSelectedFieldPrice] = useState(0);
  const [fields, setFields] = useState([]);

  const hdlChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({ ...prevState, [name]: value }));

    if (name === "selectedField") {
      const price = calculateFieldPrice(value);
      setSelectedFieldPrice(price);
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
    const pricePerHour = selectedFieldPrice;

    return hours * pricePerHour;
  };

  const changFormatDate = (date, time) => {
    let startTime = time;
    let dueDate = date;
    let [hours, minutes] = startTime.split(":");

    // Construct a valid time string for parsing
    let validTimeString = `${dueDate}T${hours}:${minutes}:00`;

    // Parse the valid time string into a Day.js object
    let combinedDateTime = dayjs(validTimeString);

    // Format the combined date and time as "YYYY-MM-DD HH:mm:ss"
    let formattedDateTime = combinedDateTime.format("YYYY-MM-DD HH:mm:ss");

    return formattedDateTime;
  };
  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      // สร้าง object ข้อมูลที่จะส่งไปยังเซิร์ฟเวอร์
      const output = {
        startTime: dayjs(`${input.dueDate}T${input.startTime}:00.000Z`),
        endTime: dayjs(`${input.dueDate}T${input.endTime}:00.000Z`),
        dueDate: dayjs(`${input.dueDate}T${input.startTime}:00.000Z`),
        totalCost: calculateTotalCost(), // เพิ่มการคำนวณค่าใช้จ่ายทั้งหมด
        status: input.status,
        fieldId: parseInt(input.selectedField),
      };

      const token = localStorage.getItem("token");

      // ส่งคำขอ POST ไปยังเซิร์ฟเวอร์
      const rs = await axios.post(
        "http://localhost:8889/booking/bookings",
        output,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ตรวจสอบสถานะการสร้างการจอง
      if (rs.status === 200) {
        // alert("Create new OK");
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
      } else {
        throw new Error("Failed to create new.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:8889/field/getfield"
        );
        setFields(response.data);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mx-auto">
      <form className="card-body" onSubmit={hdlSubmit}>
        <label className="form-control w-full max-w-[220px] ">
          <div className="label">
            <span className="label-text">วันที่จอง</span>
          </div>
          <input
            type="date"
            name="dueDate"
            value={input.dueDate}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-[220px] ">
          <div className="label">
            <span className="label-text">เวลาเริ่มต้น</span>
          </div>
          <input
            type="time"
            name="startTime"
            value={input.startTime}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-[220px] ">
          <div className="label">
            <span className="label-text">เวลาสิ้นสุด</span>
          </div>
          <input
            type="time"
            name="endTime"
            value={input.endTime}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-[220px] ">
          <div className="label">
            <span className="label-text">เลือกสนาม</span>
          </div>
          <select
            name="selectedField"
            value={input.selectedField}
            onChange={hdlChange}
          >
            <option value="">เลือกสนาม</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id} name={field.name}>
                {field.name}
              </option>
            ))}
          </select>
          {selectedFieldPrice > 0 && <p>ต่อชม. : {selectedFieldPrice}</p>}
        </label>
        <label className="form-control w-full max-w-[220px] ">
          <div className="label">
            <span className="label-text">Status</span>
          </div>
          <input
            type="text"
            name="status"
            value={input.status}
            onChange={hdlChange}
          />
        </label>
        {calculateTotalCost}
        <label className="form-control w-full max-w-[220px]">
          <div className="label">
            <span className="label-text"> ราคารวม</span>
          </div>
          <p>{calculateTotalCost() || 0} บาท</p>
        </label>

        <button className="btn btn-primary"> ยืนยัน</button>
      </form>
    </div>
  );
}
