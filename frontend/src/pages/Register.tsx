import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Create account</h1>
        <p className="text-sm text-slate-500 mb-6">
          Register locally and start chatting.
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
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Birthday"
            type="date"
          />
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
