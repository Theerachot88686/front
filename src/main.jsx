import React from 'react';  // นำเข้า React สำหรับใช้งานในคอมโพเนนต์
import ReactDOM from 'react-dom/client';  // นำเข้า ReactDOM เพื่อเรนเดอร์แอปลงใน DOM
import App from './App.jsx';  // นำเข้าแอปหลักของแอปพลิเคชัน
import './index.css';  // นำเข้าไฟล์ CSS สำหรับสไตล์
import { AuthContextProvider } from './contexts/AuthContext.jsx';  // นำเข้า AuthContextProvider สำหรับการจัดการสถานะการเข้าใช้งาน

// ใช้ ReactDOM.createRoot เพื่อเรนเดอร์แอปลงใน element ที่มี id 'root'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <AuthContextProvider> 
      <App />  
    </AuthContextProvider>
  </React.StrictMode>,
)
