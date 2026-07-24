function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-2 text-slate-500">
          Store your display name, photo, and birthday.
        </p>
        <div className="mt-6 rounded-2xl border p-4">
          <p className="font-medium">Username: Rahul</p>
          <p className="text-sm text-slate-500">Birthday: 1998-05-10</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
