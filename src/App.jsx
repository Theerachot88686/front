import AppRouter from "./routes/AppRouter";  // นำเข้า AppRouter สำหรับการจัดการเส้นทาง
import useAuth from "./routes/AppRouter";  // นำเข้า useAuth เพื่อจัดการสถานะการตรวจสอบผู้ใช้งาน

function App() {
  const {loading} = useAuth();  // ใช้ useAuth hook เพื่อดึงสถานะการโหลด

  // หากยังคงโหลดข้อมูล จะทำการแสดงข้อความ "loading..."
  if(loading){
    return(
      <p className="text-4xl text-primary">loading...</p>  // แสดงข้อความขณะโหลด
    );
  }

  return (
    <div className="min-h-screen">  
      <AppRouter/>  
    </div>
  );
}

export default App;  // ส่งออกคอมโพเนนต์ App เพื่อใช้งานในที่อื่น
