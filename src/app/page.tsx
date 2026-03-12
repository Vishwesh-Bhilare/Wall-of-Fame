import Link from "next/link";

const highlights = [
  {
    title: "Verified Achievements",
    description:
      "Every record goes through an institutional review flow before appearing on the Wall of Fame.",
  },
  {
    title: "Department Visibility",
    description:
      "Discover excellence across technical, cultural, social, and entrepreneurial domains.",
  },
  {
    title: "Career-Ready Profiles",
    description:
      "Build a rich, shareable portfolio of accomplishments beyond traditional marksheets.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <img
            src="https://image3.mouthshut.com/images/imagesp/925718624s.png"
            alt="MMCOE Logo"
            className="h-12 w-12 rounded-full border border-red-100 bg-white object-contain p-1"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-700">
              MMCOE
            </p>
            <p className="text-sm font-bold text-gray-800">Wall of Fame</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/student/login" className="brand-button-secondary">
            Student Login
          </Link>
          <Link href="/admin/login" className="brand-button">
            Admin Login
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 pb-10 pt-2 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <div className="brand-card overflow-hidden border-red-100">
          <div className="relative h-full min-h-[430px]">
            <img
              src="https://i.ytimg.com/vi/96KWizV6gu4/maxresdefault.jpg"
              alt="MMCOE Campus"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#5e0712]/75 via-[#7c0b1b]/70 to-[#b11226]/70" />

            <div className="absolute inset-0 flex flex-col justify-between p-8 text-white md:p-10">
              <div className="brand-badge w-fit border border-white/20 bg-white/15 text-white">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Proudly Inspired by MMCOE
              </div>

              <div className="max-w-xl">
                <h1 className="text-3xl font-black leading-tight md:text-5xl">
                  Celebrate Student Excellence with a Premium Digital Wall of Fame
                </h1>
                <p className="mt-4 text-sm text-red-50 md:text-base">
                  A modern platform to submit, verify, and showcase achievements that reflect the true spirit of innovation and leadership.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/student/signup" className="brand-button">
                    Join as Student
                  </Link>
                  <Link
                    href="/achievements"
                    className="brand-button-secondary border-white/35 bg-white/10 text-white hover:bg-white/20"
                  >
                    Explore Achievements
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {highlights.map((item) => (
            <article key={item.title} className="brand-card p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M3 13.5l6.75 6.75L21 9" />
                  </svg>
                </span>
                <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </article>
          ))}

          <article className="brand-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-red-700">
              Quick Access
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link href="/student/login" className="brand-button">
                Student Portal
              </Link>
              <Link href="/student/signup" className="brand-button-secondary text-center">
                New Registration
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
