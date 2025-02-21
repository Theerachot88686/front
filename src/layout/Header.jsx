import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// กำหนดเมนูการนำทางสำหรับผู้เยี่ยมชม (guest)
const guestNav = [
  { to: "/user-reserve", text: "จองสนาม" }, // เมนูสำหรับการจองสนาม
  { to: "/login", text: "เข้าสู่ระบบ" }, // เมนูเข้าสู่ระบบ
  { to: "/register", text: "สมัครสมาชิก" }, // เมนูสมัครสมาชิก
];

// กำหนดเมนูการนำทางสำหรับผู้ใช้ที่ล็อกอินแล้ว (user)
const userNav = [
  { to: "/", text: "หน้าหลัก" }, // เมนูสำหรับหน้าหลัก
  // { to: "/history", text: "ประวัติการจอง" }, // เมนูสำหรับประวัติการจอง
  { to: "/current-bookings", text: "จองสนามปัจจุบัน" }, // เมนูสำหรับการจองสนาม
  { to: "/booking-history", text: "ประวัติการจอง" },
  { to: "/user-reserve", text: "จองสนาม" },
];

// กำหนดเมนูการนำทางสำหรับผู้ดูแลระบบ (admin)
const adminNav = [
  { to: "/admin/manage", text: "การจัดการ" }, // เมนูสำหรับการจัดการ
  // { to: "/admin/current-bookings", text: "จองสนาม" },
  // { to: "/admin/history-bookings", text: "ประวัติการจอง" },
];

export default function Header() {
  // ใช้ useAuth hook เพื่อดึงข้อมูลผู้ใช้และฟังก์ชัน logout
  const { user, logout } = useAuth();

  // กำหนดเมนูที่จะใช้แสดงขึ้นอยู่กับบทบาทของผู้ใช้
  const finalNav =
    user?.role === "admin" ? adminNav : user?.id ? userNav : guestNav;

  // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับการออกจากระบบ
  const hdlLogout = () => {
    logout(); // เรียกใช้ฟังก์ชัน logout ที่ดึงมาจาก useAuth
    navigate("/"); // หลังจากออกจากระบบแล้วให้กลับไปยังหน้าหลัก
  };

  return (
    <div className="navbar bg-base-100">
      {" "}
      {/* แสดง Navbar */}
      <div className="flex-1">
        {/* ลิงก์สำหรับไปหน้าหลัก */}
        <Link to="/" className="btn btn-ghost text-xl">
          {/* แสดงข้อความ "ยินดีต้อนรับ" พร้อมชื่อผู้ใช้หากผู้ใช้ล็อกอินแล้ว */}
          ยินดีต้อนรับ {user?.id ? user.username : ""}
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {" "}
          {/* แสดงรายการเมนู */}
          {/* แสดงเมนูตามบทบาทของผู้ใช้ (guest, user, admin) */}
          {finalNav.map((el) => (
            <li key={el.to}>
              <Link to={el.to}>{el.text}</Link>{" "}
              {/* เชื่อมโยงเมนูไปยังเส้นทางที่กำหนด */}
            </li>
          ))}
          {/* ถ้าผู้ใช้ล็อกอินอยู่ ให้แสดงเมนูออกจากระบบ */}
          {user?.id && (
            <li>
              <Link to="/" onClick={hdlLogout}>
                ออกจากระบบ
              </Link>{" "}
              {/* ลิงก์ออกจากระบบ */}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
