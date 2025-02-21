import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/request-reset-password`,
        { email } // ส่งอีเมลที่กรอกจากฟอร์มไปที่เซิร์ฟเวอร์
      );
      // แสดงข้อความว่าได้ส่งรหัสลับไปที่อีเมลแล้ว
      Swal.fire({
        title: "Success!",
        text: `เราส่งรหัสลับไปที่อีเมลของคุณแล้ว`,
        icon: "success",
        confirmButtonText: "ตกลง",
        customClass: {
          title: "text-green-600", // สีของหัวข้อ (เขียว)
          content: "text-gray-800", // สีของข้อความ (เทาเข้ม)
          confirmButton: "bg-green-500 text-white hover:bg-green-600", // ปุ่มสีเขียว
        },
      });
      navigate("/verify-token"); // นำทางไปหน้า verify-token
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "ไม่มีอีเมลนี้",
        icon: "error",
        confirmButtonText: "ตกลง",
        customClass: {
          title: "text-red-600", // สีของหัวข้อ (แดง)
          content: "text-gray-800", // สีของข้อความ (เทาเข้ม)
          confirmButton: "bg-red-500 text-white hover:bg-red-600", // ปุ่มสีแดง
        },
      }); console.log(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center p-6 max-w-sm w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">รีเซ็ตรหัสผ่าน</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            อีเมล:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ส่งรหัสลับ
          </button>
        </form>
      </div>
    </div>
  );
}
