import {useContext} from 'react'  // นำเข้า useContext hook จาก React
import AuthContext from '../contexts/AuthContext'  // นำเข้า AuthContext ที่ถูกสร้างขึ้นจากไฟล์ AuthContext

// สร้าง custom hook ชื่อ useAuth
export default function useAuth() {
  return useContext(AuthContext)  // ใช้ useContext เพื่อดึงข้อมูลจาก AuthContext
}
