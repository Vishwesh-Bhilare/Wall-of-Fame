import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-red-100 bg-white shadow-[0_30px_80px_rgba(177,18,38,0.16)] md:grid-cols-[1.05fr_0.95fr]">
        <section className="relative min-h-[320px] md:min-h-[640px]">
          <img
            src="https://i.ytimg.com/vi/96KWizV6gu4/maxresdefault.jpg"
            alt="MMCOE Campus"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#57060f]/80 via-[#7c0b1b]/70 to-[#b11226]/70" />

          <div className="absolute inset-0 flex flex-col justify-between p-8 text-white md:p-10">
            <div className="flex items-center gap-3">
              <img
                src="https://image3.mouthshut.com/images/imagesp/925718624s.png"
                alt="MMCOE Logo"
                className="h-12 w-12 rounded-full bg-white object-contain p-1"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-100">
                  Student Achievement Portal
                </p>
                <p className="text-base font-bold">MMCOE Wall of Fame</p>
              </div>
            </div>

            <div>
              <span className="mb-4 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                Secure Access
              </span>
              <h1 className="text-3xl font-black leading-tight md:text-4xl">
                Welcome Back to Your Achievement Journey
              </h1>
              <p className="mt-3 max-w-md text-sm text-red-50 md:text-base">
                Log in to submit achievements, track verification status, and build your professional student profile.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-gradient-to-b from-white to-red-50/60 p-6 md:p-10">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 shadow-lg md:p-8">
            <h2 className="text-2xl font-extrabold text-gray-900">Sign In</h2>
            <p className="mt-1 text-sm text-gray-600">
              Access your account with your institutional credentials.
            </p>

            <form className="mt-6 space-y-4">
              <div>
                <label className="brand-label" htmlFor="email">
                  College Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@mmcoe.edu.in"
                  className="brand-input"
                />
              </div>

              <div>
                <label className="brand-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="brand-input"
                />
              </div>

              <button type="submit" className="brand-button w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.516 2.17a.75.75 0 00-1.032 0l-8.25 7.5A.75.75 0 003.75 11h1.5v8.25A1.75 1.75 0 007 21h2.25a.75.75 0 00.75-.75V15a.75.75 0 01.75-.75h2.5a.75.75 0 01.75.75v5.25a.75.75 0 00.75.75H17a1.75 1.75 0 001.75-1.75V11h1.5a.75.75 0 00.516-1.33l-8.25-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Login to Portal
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm">
              <Link href="/student/signup" className="font-semibold text-red-700 hover:underline">
                Create account
              </Link>
              <Link href="/" className="text-gray-600 hover:text-red-700 hover:underline">
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
