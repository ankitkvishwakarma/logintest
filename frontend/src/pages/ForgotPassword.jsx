import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Mail, Send } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) return alert("Enter your email");

    const res = await api.post("/forgot-password", { email });

    if (res.data.success) {
      localStorage.setItem("email", email);
      navigate("/verify-otp");
    } else {
      alert(res.data.msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 drop-shadow">
          Forgot Password 🔐
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Enter your registered email address to receive OTP.
        </p>

        {/* Email Input */}
        <div className="relative mb-5">
          <Mail className="absolute left-3 top-3 text-gray-500" size={22} />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 pl-12 rounded-xl border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Send OTP Button */}
        <button
          onClick={sendOtp}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 
                     text-white font-semibold text-lg shadow-md flex items-center 
                     justify-center gap-2 transition"
        >
          <Send size={20} />
          Send OTP
        </button>

        {/* Back to Login */}
        <p className="text-center text-sm mt-6 text-gray-700">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
