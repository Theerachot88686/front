import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "../layout/LoginForm";  // นำเข้าแบบฟอร์มการเข้าสู่ระบบ
import RegisterForm from "../layout/RegisterForm";  // นำเข้าแบบฟอร์มการลงทะเบียน
import useAuth from "../hooks/useAuth";  // ใช้ hook สำหรับการจัดการการตรวจสอบผู้ใช้งาน
import Header from "../layout/Header";  // นำเข้า Header ของแอปพลิเคชัน
import UserHome from "../layout/UserHome";  // นำเข้าหน้าหลักสำหรับผู้ใช้
import UserReserve from "../layout/UserReserve";  // นำเข้าหน้าจองสนามสำหรับผู้ใช้
import History from "../layout/History";  // นำเข้าหน้าประวัติการจอง
import Manage from "../layout/Manage";  // นำเข้าหน้าจัดการทั่วไป
import ManageUser from "../layout/ManageUser";  // นำเข้าหน้าจัดการผู้ใช้
import Field from "../layout/Field";  // นำเข้าหน้าจัดการสนาม
import BookingField from "../layout/BookingField";  // นำเข้าหน้าจัดการการจองสนาม

// Routes สำหรับผู้ใช้ที่ยังไม่ได้เข้าสู่ระบบ
const guestRoutes = (
  <>
    <Route path="/login" element={<LoginForm />} />  
    <Route path="/register" element={<RegisterForm />} />  
  </>
);

// Routes สำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว
const userRoutes = (
  <>
    <Route path="/" element={<UserHome />} />  
    <Route path="/history" element={<History />} />  
  </>
);

// Routes สำหรับผู้ใช้ที่มีสิทธิ์เป็น admin
const adminRoutes = (
  <>
    <Route path="/admin/manage" element={<Manage />} /> 
    <Route path="/admin/manageuser" element={<ManageUser />} />  
    <Route path="/admin/manage/bookingfield" element={<BookingField />} /> 
    <Route path="/admin/manage/field" element={<Field />} />  
  </>
);

const AppRouter = () => {
  const { user } = useAuth();  // ดึงข้อมูลผู้ใช้จาก useAuth

  return (
    <BrowserRouter>
      <Header />  
      <Routes>
        {/* เส้นทางสำหรับการจองสนาม */}
        <Route path="/user-reserve" element={<UserReserve />} />  
        <Route path="/" element={<UserHome />} /> (default)
        
        {/* ตรวจสอบสิทธิ์ของผู้ใช้และแสดงเส้นทางที่เหมาะสม */}
        {user?.role === "admin" ? adminRoutes : user?.id ? userRoutes : guestRoutes}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
