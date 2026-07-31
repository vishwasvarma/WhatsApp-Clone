import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiLock, FiUser, FiUserPlus } from "react-icons/fi";
import { setCurrentUser } from "../auth";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleRegister = () => {
    if (!username.trim()) return;
    setCurrentUser(username.trim());
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#22c55e_0%,_#14532d_100%)] p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl lg:grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FiUserPlus size={20} />
            Create your profile
          </div>
          <h1 className="mt-6 text-3xl font-semibold">
            Join the local WhatsApp-inspired experience.
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            Set up your identity, birthday, and chat preferences instantly.
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <div className="space-y-4">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <FiUser className="text-slate-400" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Display name"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <FiLock className="text-slate-400" />
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Password"
                type="password"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <FiCalendar className="text-slate-400" />
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Birthday"
                type="date"
              />
            </label>
            <button
              onClick={handleRegister}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Register now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
