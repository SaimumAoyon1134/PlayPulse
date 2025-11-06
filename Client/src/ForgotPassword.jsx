import React, { useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

const ForgetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailRef = useRef();

 
    const passedEmail = location.state?.email || "";
    console.log(passedEmail)
const {reset}=useContext(AuthContext)
  const handleReset = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;

    if (!email) {
      toast.error("Please enter your email!");
      return;
    }
      reset(email);
      toast.success("Password reset link sent! Redirecting to Gmail...");
      
    setTimeout(() => {
      window.location.href = "https://mail.google.com"; 
    }, 1000);
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            Reset Your Password
          </h2>
          <form onSubmit={handleReset}>
            <div className="form-control flex flex-col space-y-2">
              <label className="label">Email</label>
              <input
                type="email"
                ref={emailRef}
                defaultValue={passedEmail}
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
            </div>

            <button type="submit" className="btn btn-neutral mt-4 w-full">
              Reset Password
            </button>
          </form>

          <p className="mt-4 text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;