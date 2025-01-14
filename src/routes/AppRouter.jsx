import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "../layout/LoginForm";
import RegisterForm from "../layout/RegisterForm";
import useAuth from "../hooks/useAuth";
import Header from "../layout/Header";
import UserHome from "../layout/UserHome";
import UserReserve from "../layout/UserReserve";
import History from "../layout/History";
import Manage from "../layout/Manage";
import ManageUser from "../layout/ManageUser";
import Field from "../layout/Field";
import BookingField from "../layout/BookingField";

const guestRoutes = (
  <>
    <Route path="/login" element={<LoginForm />} />
    <Route path="/register" element={<RegisterForm />} />
  </>
);

const userRoutes = (
  <>
    <Route path="/" element={<UserHome />} />
    <Route path="/history" element={<History />} />
  </>
);

const adminRoutes = (
  <>
    <Route path="/admin/manage" element={<Manage />} />
    <Route path="/admin/manageuser" element={<ManageUser />} />
    <Route path="/admin/manage/bookingfield" element={<BookingField />} />
    <Route path="/admin/manage/field" element={<Field />} />
  </>
);

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public route for user-reserve */}
        <Route path="/user-reserve" element={<UserReserve />} />
        <Route path="/" element={<UserHome />} />
        {/* Check user role and render the appropriate routes */}
        {user?.role === "admin" ? adminRoutes : user?.id ? userRoutes : guestRoutes}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
