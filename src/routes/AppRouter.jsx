import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LoginForm from "../layout/LoginForm";
import RegisterForm from "../layout/RegisterForm";
import useAuth from "../hooks/useAuth";
import Header from "../layout/Header";
import UserHome from "../layout/UserHome";
import Reserve from "../layout/Reserve";
import UserReserve from "../layout/UserReserve";
import History from "../layout/History";

const guestRoutes = (
  <>
    <Route path="/" element={<LoginForm />} />
    <Route path="/register" element={<RegisterForm />} />
  </>
);

const userRoutes = (
  <>
    <Route path="/" element={<UserHome />} />
    <Route path="/reserve" element={<Reserve />} />
    <Route path="/user-home" element={<UserHome />} />
    <Route path="/user-reserve" element={<UserReserve />} />
    <Route path="/history" element={<History />} />
  </>
);

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Header />
      <Outlet />
      <Routes>{user?.id ? userRoutes : guestRoutes}</Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
