import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiLock, FiMessageSquare, FiUser } from "react-icons/fi";
import { setCurrentUser } from "../auth";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (!username.trim()) return;
    setCurrentUser(username.trim());
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#22c55e_0%,_#14532d_100%)] p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl lg:grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between bg-emerald-600 p-8 text-white">
          <div>
            <div className="flex items-center gap-3 text-xl font-semibold">
              <FiMessageSquare size={24} />
              <span>WhatsApp inspired</span>
            </div>
            <h1 className="mt-10 text-4xl font-semibold leading-tight">
              Stay connected with your local community.
            </h1>
            <p className="mt-4 max-w-md text-sm text-emerald-50/90">
              Enjoy a polished chat experience with stories, highlights,
              reminders, and scheduled messages—all running locally.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
            <p className="font-medium">Secure local sign-in</p>
            <p className="mt-1 text-emerald-50/80">
              Simple, private, and fast.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-2 text-emerald-600">
            <FiMessageSquare size={20} />
            <span className="font-semibold">Welcome back</span>
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Log in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Use your local username and password.
          </p>

          <div className="mt-8 space-y-4">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <FiUser className="text-slate-400" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Username"
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
            <button
              onClick={handleLogin}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              Continue
              <FiArrowRight />
            </button>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            New here?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-semibold text-emerald-600"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
