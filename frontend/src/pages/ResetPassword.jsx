import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Lock, Shield, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetPassword = async () => {
    setLoading(true);
    const email = localStorage.getItem("email");

    const res = await api.post("/reset-password", {
      email,
      newPassword: password,
    });

    if (res.data.success) {
      alert("Password Reset Successfully");
      localStorage.removeItem("email");
      navigate("/login");
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
          <Shield className="text-purple-600 drop-shadow-lg" size={40} />
        </div>

        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 drop-shadow-sm">
          Reset Password 🔒
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Enter your new password to secure your account.
        </p>

        {/* Password Input */}
        <div className="relative mb-5">
          <Lock className="absolute left-3 top-3 text-gray-500" size={22} />
          <input
            type="password"
            placeholder="Enter New Password"
            className="w-full p-3 pl-12 rounded-xl border border-gray-300 
                       focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={resetPassword}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 
                     text-white font-semibold shadow-md flex items-center 
                     justify-center gap-2 transition disabled:bg-purple-300"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Updating...
            </>
          ) : (
            "Reset Password"
          )}
        </button>

        {/* Back */}
        <p className="text-center mt-6 text-sm text-gray-700">
          Go back to{" "}
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
