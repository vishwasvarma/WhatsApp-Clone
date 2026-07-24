import { FiCamera, FiGift, FiUser } from "react-icons/fi";

function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600">Profile</p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Your personal profile
            </h1>
          </div>
          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
            <FiUser size={20} />
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-3xl font-semibold text-white">
              R
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Rahul</h2>
              <p className="text-sm text-slate-500">
                Local profile • Available
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600">
                <FiCamera />
                <span className="font-semibold">Photo</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Profile photo support is ready for future uploads.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600">
                <FiGift />
                <span className="font-semibold">Birthday</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">10 May 1998</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
