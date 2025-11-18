import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", form);

      if (res.data.success) {
        setMsg("Login Successful! WhatsApp notification sent.");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", res.data.email);

        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      } else {
        setMsg(res.data.msg);
      }
    } catch (err) {
      setMsg("Error in login");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 drop-shadow">
          Welcome Back 👋
        </h2>

        {msg && (
          <p className="text-center mb-4 text-green-700 font-medium">
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 
                         focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 
                         focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                       p-3 rounded-xl shadow-md flex items-center justify-center gap-2
                       disabled:bg-blue-300 transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-center mt-5 text-sm">
          <a href="/forgot-password" className="text-red-500 font-medium hover:underline">
            Forgot Password?
          </a>
        </p>

        {/* Register */}
        <p className="text-center text-sm mt-3">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold hover:underline">
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
}
