import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function LoginPage() {
  const { user, login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const registered = Boolean(
    (location.state as { registered?: boolean } | null)?.registered,
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/chat" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
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
        <h1 className="mt-8 text-3xl font-light text-wa-text">
          Use WhatsApp on your computer
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-wa-muted">
          Create two accounts in two browser tabs, then message between them on
          this local server. No internet or database required.
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
          {registered ? (
            <p className="text-sm text-wa-accent">
              Account created. Please log in.
            </p>
          ) : null}
          {error ? <p className="text-sm text-wa-danger">{error}</p> : null}
          <button
            disabled={loading}
            className="w-full rounded bg-wa-accent py-3 font-medium text-wa-bg"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-sm text-wa-muted">
          New here?{" "}
          <Link to="/register" className="text-wa-accent">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
