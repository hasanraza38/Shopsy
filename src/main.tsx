import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./Layout.jsx";
import Home from "./screens/Home.js";
import Login from "./screens/Login.js";
import Register from "./screens/Register.js";
import Dashboard from "./screens/Dashboard.js";
import Carts from "./screens/carts.js"

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
      {
        path: '/cart',
        element:<Carts/>,
      }
  ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);

