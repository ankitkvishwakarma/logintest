import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // optional, if you want to call backend

export default function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check login status from localStorage
    const ok = localStorage.getItem("isLoggedIn");
    const e = localStorage.getItem("userEmail");

    if (!ok) {
      // Not logged in -> redirect to login
      navigate("/");
      return;
    }

    setEmail(e || "");
  }, [navigate]);

  // Optional: fetch extra user data from backend (if you add /me endpoint)
  async function fetchProfile() {
    setLoading(true);
    try {
      // If you implement authenticated /me endpoint, use this
      // const res = await api.get("/me");
      // setEmail(res.data.email);

      // For now we read from localStorage (already done)
      setMsg("Profile loaded.");
    } catch (err) {
      setMsg("Failed to load profile.");
    }
    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    // any other stored tokens -> remove
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-md w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchProfile}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-medium">Welcome</h2>
          <p className="mt-2 text-gray-700">
            You are logged in as{" "}
            <span className="font-semibold text-gray-900">{email || "User"}</span>
          </p>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Tips:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
              <li>Use the "Refresh" button to fetch profile from backend (if implemented).</li>
              <li>Implement a secure token (JWT) later for protected routes.</li>
            </ul>
          </div>
        </div>

        {/* Example actions section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Users</h3>
            <p className="text-sm text-gray-600">View or manage users (implement API).</p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold">Settings</h3>
            <p className="text-sm text-gray-600">Change password, notifications, etc.</p>
          </div>

          <div className="p-4 border rounded">
            <h3 className="font-semibold">WhatsApp</h3>
            <p className="text-sm text-gray-600">Login notifications will be sent to WhatsApp group.</p>
          </div>
        </div>

        {msg && <p className="mt-4 text-sm text-blue-700">{msg}</p>}
      </div>
    </div>
  );
}
