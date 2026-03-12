import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-100">
      
      <h1 className="text-4xl font-bold flex items-center gap-2">
        🎓 Student Achievement Portal
      </h1>

      <p className="text-gray-600">
        Showcase and verify academic achievements
      </p>

      <div className="flex gap-4">

        {/* Student Login */}
        <Link href="/student/login">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Student Login
          </button>
        </Link>

        {/* Student Signup */}
        <Link href="/student/signup">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Student Sign Up
          </button>
        </Link>

        {/* Admin Login */}
        <Link href="/admin/login">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Admin Login
          </button>
        </Link>

      </div>
    </div>
  );
}