import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth';

const guestNav = [
  { to: '/user-reserve', text: 'จองสนาม' },
  { to: '/login', text: 'เข้าสู่ระบบ' },
  { to: '/register', text: 'สมัครสมาชิก' },
  
]

const userNav = [
  { to: '/', text: 'หน้าหลัก' },
  { to: '/history', text: 'ประวัติการจอง' },
  { to: '/user-reserve', text: 'จองสนาม' },
]

const adminNav = [
  { to: '/admin/manage', text: 'การจัดการ' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const finalNav = user?.role === "admin" ? adminNav : user?.id ? userNav : guestNav

  const navigate = useNavigate()

  const hdlLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          ยินดีต้อนรับ {user?.id ? user.username : ""}
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {finalNav.map(el => (
            <li key={el.to}>
              <Link to={el.to}>{el.text}</Link>
            </li>
          ))}
          {user?.id && (
            <li>
              <Link to="/" onClick={hdlLogout}>ออกจากระบบ</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
