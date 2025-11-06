import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import image from "./image.png"
import "animate.css";
const Login = () => {
  const emailRef = useRef("");
  const { signIn, reset, googleSignIn } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleForgetPassword = () => {
    const email = emailRef.current.value;
    if (email) {
      reset(email);
      toast.info("Password reset email sent!");
    } else {
      toast.error("Please enter your email first!");
    }
  };
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      setError("Please give correct email and password!!");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and be 6+ characters long."
      );
      return;
    }

    signIn(email, password)
      .then(() => {
        toast.success("Successfully Logged In!");
        e.target.reset();
        console.log("Location", location);
        navigate(from, { replace: true });
      })
      .catch(() => {
        setError("Invalid Credentials!!");
        toast.error("Invalid Credentials!!");
      });
  };

  const handleSignGoogle = () => {
    googleSignIn();
    navigate("/");
  };

  return (
    <div className=" animate__animated animate__fadeInDown ">
      <h1 className="mt-5 font-bold text-2 text-center flex justify-center">
        <span>Sign in to </span><img className="w-[40px] h-[40px]  " src={image} alt="" /><span>Play Pulse</span>
      </h1>
      <div className="hero ">
        <div className="card w-full max-w-sm shrink-0 shadow-2xl border-1 border-[rgb(12,12,90)]">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input
                  type="email"
                 
                  placeholder="Email"
                  className="input pr-10 h-12"
                  name="email"
                  ref={emailRef}
                />

                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input pr-10 h-12"
                    placeholder="Password"
                    name="password"
                  />
                  <span
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <p className="text-center mt-2 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      const email = emailRef.current?.value || "";
                      navigate("/forget-password", { state: { email } });
                    }}
                    className="text-[rgb(12,12,90)] hover:text-blue-700 font-semibold"
                  >
                    Forgot Password?
                  </button>
                </p>

                <button className="btn btn-neutral mt-4">Login</button>
                <button
                  type="button"
                  className="btn btn-neutral mt-4 flex items-center justify-center gap-2"
                  onClick={handleSignGoogle}
                >
                  <FaGoogle /> Login With Google
                </button>

                {error && <p className="text-red-500 mt-2">{error}</p>}
              </fieldset>
            </form>
            <p className="mt-2">
              Does not have any Account?{" "}
              <NavLink
                to="/register"
                className="text-[rgb(12,12,90)] hover:text-blue-700 font-bold underline"
              >
                Sign Up Now!!!
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;