import axios from "axios";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ฟังก์ชันตรวจสอบข้อมูลแบบเรียลไทม์
  useEffect(() => {
    const newErrors = {};

    if (!input.username) newErrors.username = "กรุณากรอกชื่อผู้ใช้";
    if (!input.email) newErrors.email = "กรุณากรอกอีเมล";
    if (!input.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (!input.confirmPassword) newErrors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";

    // ✅ เช็คความยาวรหัสผ่าน
    if (input.password && input.password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    }

    // ✅ เช็ครหัสผ่านและยืนยันรหัสผ่านว่าตรงกันหรือไม่
    if (input.password && input.confirmPassword && input.password !== input.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน";
    }

    setErrors(newErrors);
  }, [input]);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงของ input
  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ฟังก์ชันส่งข้อมูลสมัครสมาชิก
  const hdlSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "กรุณากรอกข้อมูลให้ถูกต้อง",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const rs = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, input);

      if (rs.status === 201) {
        Swal.fire({
          title: "🎉 สมัครสมาชิกสำเร็จ!",
          text: "คุณสามารถเข้าสู่ระบบได้ทันที",
          icon: "success",
          confirmButtonColor: "#16a34a", // ปุ่มสีเขียว (Tailwind: green-600)
          background: "#f0fdf4", // พื้นหลังสีเขียวอ่อน
          color: "#065f46", // สีข้อความเขียวเข้ม
          customClass: {
            title: "text-lg font-bold", // เพิ่มขนาดและความหนาของหัวข้อ
            confirmButton: "text-white font-semibold", // ปรับปุ่มให้ดูเด่นขึ้น
          },
        }).then(() => {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        });
      }
      
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);

      if (err.response) {
        const { status, data } = err.response;

        // ✅ แสดง error จาก backend
        if (status === 400) {
          Swal.fire({
            title: "ข้อผิดพลาด!",
            text: data.message || "มีข้อผิดพลาดในการสมัครสมาชิก",
            icon: "error",
          });

          // ✅ ตรวจสอบว่าเป็น error ของอีเมล หรือชื่อผู้ใช้ซ้ำ
          if (data.message.includes("ชื่อผู้ใช้")) {
            setErrors((prev) => ({ ...prev, username: data.message }));
          } else if (data.message.includes("อีเมล")) {
            setErrors((prev) => ({ ...prev, email: data.message }));
          }
        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "กรุณาลองใหม่ภายหลัง",
            icon: "error",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen -mt-20 bg-gray-100">
      <div className="card w-full max-w-md shadow-xl bg-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-700">ลงทะเบียน</h1>
        <form onSubmit={hdlSubmit} className="space-y-4">
          {/* Username */}
          <div className="form-control">
            <label htmlFor="username" className="label">
              <span className="label-text">ชื่อผู้ใช้</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={input.username}
              onChange={hdlChange}
              className={`input input-bordered ${errors.username ? "border-red-500" : ""}`}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={input.email}
              onChange={hdlChange}
              className={`input input-bordered ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text">รหัสผ่าน</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={input.password}
              onChange={hdlChange}
              className={`input input-bordered ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label htmlFor="confirmPassword" className="label">
              <span className="label-text">ยืนยันรหัสผ่าน</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={hdlChange}
              className={`input input-bordered ${errors.confirmPassword ? "border-red-500" : ""}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button type="submit" className={`btn btn-success w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
              {loading ? "กำลังสมัครสมาชิก..." : "ยืนยัน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
