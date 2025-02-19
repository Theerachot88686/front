import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับปุ่ม
  const navigate = useNavigate();

  // ฟังก์ชันจัดการการเปลี่ยนแปลงของ input
  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ฟังก์ชันส่งข้อมูลสมัครสมาชิก
  const hdlSubmit = async (e) => {
    e.preventDefault();

    // ✅ ตรวจสอบข้อมูลที่ว่าง
    if (!input.username || !input.password || !input.confirmPassword || !input.email) {
      return Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        icon: "warning",
      });
    }

    // ✅ ตรวจสอบรหัสผ่านและยืนยันรหัสผ่าน
    if (input.password !== input.confirmPassword) {
      return Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน",
        icon: "error",
      });
    }

    try {
      setLoading(true); // เปิดสถานะโหลด

      // ✅ ส่งข้อมูลไปยัง API
      const rs = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, input);

      if (rs.status === 201) {
        Swal.fire({
          title: "สมัครสมาชิกสำเร็จ!",
          text: "คุณสามารถเข้าสู่ระบบได้ทันที",
          icon: "success",
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

        if (status === 400) {
          Swal.fire({
            title: "ข้อผิดพลาด!",
            text: data.message || "ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้ไปแล้ว",
            icon: "error",
          });
        } else if (status === 500) {
          Swal.fire({
            title: "เซิร์ฟเวอร์ขัดข้อง!",
            text: "โปรดลองใหม่ภายหลัง",
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "กรุณาลองใหม่ภายหลัง",
            icon: "error",
          });
        }
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
          icon: "error",
        });
      }
    } finally {
      setLoading(false); // ปิดสถานะโหลด
    }
  };

  return (
    <div className="flex justify-center items-center h-screen -mt-20">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100 mx-auto">
        <h1 className="text-3xl font-bold text-center">ลงทะเบียน</h1>
        <form onSubmit={hdlSubmit} className="space-y-5 p-5">
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
              className="input input-bordered"
            />
          </div>
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
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label htmlFor="confirmPassword" className="label">
              <span className="label-text">ยืนยัน รหัสผ่าน</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={hdlChange}
              className="input input-bordered"
            />
          </div>
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
              className="input input-bordered"
            />
          </div>
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
