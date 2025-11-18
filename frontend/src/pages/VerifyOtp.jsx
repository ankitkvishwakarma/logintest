import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, KeyRound, Loader2 } from "lucide-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verify = async () => {
    setLoading(true);
    const email = localStorage.getItem("email");

    const res = await api.post("/verify-otp", { email, otp });

    if (res.data.success) {
      navigate("/reset-password");
    } else {
      alert(res.data.msg);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 animate-fadeIn">

        {/* Top Icon */}
        <div className="flex justify-center mb-4">
          <ShieldCheck className="text-green-600 drop-shadow-lg" size={40} />
        </div>

        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 drop-shadow-sm">
          Verify OTP
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit OTP sent to your email.
        </p>

        {/* OTP Input */}
        <div className="relative mb-5">
          <KeyRound className="absolute left-3 top-3 text-gray-500" size={22} />
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 pl-12 rounded-xl border border-gray-300 
                       focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={verify}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 
                     text-white font-semibold shadow-md flex items-center 
                     justify-center gap-2 transition disabled:bg-green-300"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Back */}
        <p className="text-center mt-6 text-sm text-gray-700">
          Didn't receive OTP?{" "}
          <a
            href="/forgot-password"
            className="text-blue-600 font-semibold hover:underline"
          >
            Resend
          </a>
        </p>
      </div>
    </div>
  );
}
