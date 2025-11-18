import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, UserPlus, Loader2 } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      setMsg("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/register", form);

      if (res.data.success) {
        setMsg("Registration successful!");

        // Optional auto-login
        localStorage.setItem("token", res.data.token || "");
        localStorage.setItem("userEmail", form.email);

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setMsg("Email already exists or server error");
      }
    } catch (error) {
      setMsg("Email already exists or server error");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 drop-shadow">
          Create Account ✨
        </h2>

        {/* Message */}
        {msg && (
          <p className="text-center mb-4 text-blue-700 font-medium">
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email Input */}
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="w-full p-3 pl-10 rounded-xl border border-gray-300 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              className="w-full p-3 pl-10 rounded-xl border border-gray-300 
                         focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* Register Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                       font-semibold p-3 rounded-xl shadow-md flex items-center 
                       justify-center gap-2 disabled:bg-blue-300 transition"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Register
              </>
            )}
          </button>
        </form>

        {/* Already have an account */}
        <p className="text-center text-sm mt-5 text-gray-700">
          Already have an account?{" "}
          <a href="/" className="text-green-600 font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
