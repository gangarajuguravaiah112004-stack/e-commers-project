/* eslint-disable react-refresh/only-export-components */
// import { Home } from "lucide-react";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
// import HomePageLayout from "../layouts/HomePageLayout";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Home from "../pages/Home";
// import NewArrival from "../pages/NewArrival";
// import Dashboard from "../dashboard/Dashboard";
import PrivateRouting from "./privaterouting/PrivateRouting";

const HomePageLayout=lazy(()=>import("../layouts/HomePageLayout"))
const Login=lazy(()=>import("../pages/Login"))
const Home=lazy(()=>import("../pages/Home"))
const Register=lazy(()=>import("../pages/Register"))
const NewArrival=lazy(()=>import("../pages/NewArrival"))
const Dashboard=lazy(()=>import("../dashboard/Dashboard"))
const Cart=lazy(()=>import("../pages/Cart"))



export const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePageLayout />,
    children:[
        {
            path:"/",
            element:<Home/>
        },
        {
            path:"/NewArrival",
            element:<NewArrival/>
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path:"/dashboard",
          element:<PrivateRouting>
              <Dashboard/>
          </PrivateRouting>
        }
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
]);