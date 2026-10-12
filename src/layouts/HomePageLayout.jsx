import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

const HomePageLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default HomePageLayout;