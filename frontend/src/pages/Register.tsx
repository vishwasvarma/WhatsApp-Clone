import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function RegisterPage() {
  const { user, register } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/chat" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password || !birthday) {
      setError("Username, password and birthday are required");
      return;
    }
    setLoading(true);
    try {
      await register(username.trim(), password, birthday);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wa-bg">
      <div className="h-[222px] bg-wa-accent" />
      <div className="-mt-40 mx-auto w-full max-w-[860px] rounded-sm bg-wa-panel px-10 py-12 shadow-2xl">
        <div className="flex items-center gap-3">
          <img src="/assets/icons/whatsapp.svg" alt="" className="h-10 w-10" />
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-wa-muted">
            WhatsApp Web
          </p>
        </div>
        <h1 className="mt-8 text-3xl font-light text-wa-text">Create your account</h1>
        <p className="mt-3 text-sm text-wa-muted">
          Your birthday is stored for reminders only. No automatic wishes are sent.
        </p>
        <form onSubmit={(e) => void onSubmit(e)} className="mt-8 max-w-md space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded bg-wa-header px-4 py-3 text-wa-text outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded bg-wa-header px-4 py-3 text-wa-text outline-none"
          />
          <label className="block text-sm text-wa-muted">
            Birthday
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="mt-1 w-full rounded bg-wa-header px-4 py-3 text-wa-text outline-none"
            />
          </label>
          {error ? <p className="text-sm text-wa-danger">{error}</p> : null}
          <button
            disabled={loading}
            className="w-full rounded bg-wa-accent py-3 font-medium text-wa-bg"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-sm text-wa-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-wa-accent">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
