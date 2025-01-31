import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./Layout.jsx";
// import Register from "./screens/register/Register.jsx";
// import Dashboard from "./screens/dashboard/Dashboard.jsx";
// import Login from "./screens/login/Login.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
         path:'',
         element: <App/>
      },
      {
        path: "/login",
        element:<h1>login</h1>
      },
      {
        path: '/register',
        element:<h1>register</h1>
        // element: <Register/>

      },
      {
        path: '/dashboard',
        element:<h1>dashbord</h1>
        // element: <Dashboard/>
      }
  ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <App /> 
  </RouterProvider>
);

