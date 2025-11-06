import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import AuthProvider from "./AuthProvider.jsx";
import Home from "./Home.jsx";
import ForgetPassword from "./ForgotPassword.jsx";
import MyProfile from "./MyProfile.jsx";
import ManageAnnouncement from "./ManageAnnouncement.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>, 
    children: [
      { path: "/", element: <Home/>}, // default content
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "myprofile", element: <MyProfile /> },
      { path: "manage-announcement", element: <ManageAnnouncement /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);