import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function VerifyToken() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        { token, newPassword }
      );
      Swal.fire({
        title: "Success!",
        text: "รีเซ็ตรหัสผ่านสำเร็จ",
        icon: "success",
        confirmButtonText: "เข้าสู่ระบบ",
        customClass: {
          title: "text-green-600", // สีของหัวข้อ (เขียว)
          content: "text-gray-800", // สีของข้อความ (เทาเข้ม)
          confirmButton: "bg-green-500 text-white hover:bg-green-600", // ปุ่มสีเขียว
        },
      });
      navigate("/login");
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "เกิดข้อผิดพลาด",
        icon: "error",
        confirmButtonText: "ตกลง",
        customClass: {
          title: "text-red-600", // สีของหัวข้อ (แดง)
          content: "text-gray-800", // สีของข้อความ (เทาเข้ม)
          confirmButton: "bg-red-500 text-white hover:bg-red-600", // ปุ่มสีแดง
        },
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center p-8 max-w-md w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          ยืนยันรหัสลับและตั้งรหัสผ่านใหม่
        </h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label
              htmlFor="token"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              รหัสลับ:
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={handleTokenChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              รหัสผ่านใหม่:
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ยืนยัน
          </button>
        </form>
      </div>
    </div>
  );
}
