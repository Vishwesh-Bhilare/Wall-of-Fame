export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Login to your student account
        </p>

        <input
          type="email"
          placeholder="College Email"
          className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Login
        </button>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Sign up
          </span>
        </p>

      </div>

    </div>
  );
}