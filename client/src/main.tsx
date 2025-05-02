import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./Layout.jsx";
import Home from "./screens/Home.js";
import Login from "./screens/Login.js";
import Register from "./screens/Register.js";
import Dashboard from "./screens/Dashboard.js";
// import Carts from "./screens/Carts.js"
import Success from "./screens/Success.js";
import Cancel from "./screens/Cancel.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
         path:'',
         element: <Home/>
      },
      {
        path: "/login",
        element:<Login/>,
      },
      {
        path: '/register',
        element:<Register/>

      },
      {
        path: '/dashboard',
        element:<Dashboard/>,
      },
      // {
        // path: '/cart',
        // element:<Carts/>,
      // },
      {
        path: '/success',
        element:<Success/>,
      },
      {
        path: '/cancel',
        element:<Cancel/>,
      },
      {
        path: '*',
        element:<h1>NOT FOUND!!</h1>,
      }
  ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);

