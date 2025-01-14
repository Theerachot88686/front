/* eslint-disable react/prop-types */
import axios from 'axios'  // นำเข้า axios สำหรับการทำ HTTP request
import {createContext, useState, useEffect} from 'react'  // นำเข้า createContext, useState และ useEffect จาก React

// สร้าง Context สำหรับ Authentication
const AuthContext = createContext()

function AuthContextProvider(props) {
  const [user, setUser] = useState(null)  // สถานะของผู้ใช้ (user) เริ่มต้นเป็น null
  const [loading, setLoading] = useState(true)  // สถานะของการโหลดข้อมูล เริ่มต้นเป็น true
  
  // ฟังก์ชัน run สำหรับดึงข้อมูลผู้ใช้จาก localStorage และอัพเดทสถานะ
  const run = async () => {
    try {
      setLoading(true)  // ตั้งค่า loading เป็น true เมื่อเริ่มการโหลดข้อมูล
      let userData = JSON.parse(localStorage.getItem("userData"));  // ดึงข้อมูลผู้ใช้จาก localStorage
      if(!userData) { return }  // หากไม่มีข้อมูลผู้ใช้ให้หยุดการทำงาน
      setUser(userData);  // อัพเดทสถานะผู้ใช้เป็นข้อมูลที่ดึงมา
    } catch (err) {
      console.log(err.message)  // หากเกิดข้อผิดพลาดให้แสดงข้อความผิดพลาด
    } finally {
      setLoading(false)  // ตั้งค่า loading เป็น false เมื่อการโหลดข้อมูลเสร็จสิ้น
    }   
  }

  // ใช้ useEffect เพื่อเรียกใช้งานฟังก์ชัน run เมื่อ Component ถูกติดตั้งครั้งแรก
  useEffect(() => {
    run()  // เรียกใช้ฟังก์ชัน run เพื่อดึงข้อมูลผู้ใช้จาก localStorage
  }, [])
  // ฟังก์ชัน logout สำหรับออกจากระบบ
  const logout = () => {
    setUser(null);  // ตั้งค่าสถานะผู้ใช้เป็น null
    localStorage.removeItem("userData");  // ลบข้อมูลผู้ใช้จาก localStorage
  };

  // ส่งค่า user, setUser, loading, logout, และ run ผ่าน AuthContext.Provider
  return (
    <AuthContext.Provider value={ {user, setUser, loading, logout, run} }>
      {props.children}  // Render children component ที่ถูกห่อหุ้มด้วย AuthContextProvider
    </AuthContext.Provider>
  )
}

// ส่งออก AuthContextProvider และ AuthContext เพื่อให้ใช้งานในส่วนอื่นของแอป
export { AuthContextProvider }
export default AuthContext
