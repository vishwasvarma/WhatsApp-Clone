import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-sm text-slate-500 mb-6">
          Sign in to your local WhatsApp clone.
        </p>
        <div className="space-y-4">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Username"
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Password"
            type="password"
          />
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Login
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          No account yet?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-green-600"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
