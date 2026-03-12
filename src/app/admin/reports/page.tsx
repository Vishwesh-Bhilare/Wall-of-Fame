"use client"

import { useState } from "react"

export default function AdminReportsPage() {

  const [reportType, setReportType] = useState("monthly")

  const generateReport = () => {
    alert(`Generating ${reportType} report...`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-10">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Admin Reports Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Analytics and export tools for achievements and student activity
            </p>
          </div>

        </div>

        {/* Quick Stats */}

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition hover:-translate-y-1">
            <p className="text-gray-500">Total Achievements</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-1">124</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition hover:-translate-y-1">
            <p className="text-gray-500">Pending Review</p>
            <h2 className="text-3xl font-bold text-yellow-500 mt-1">18</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition hover:-translate-y-1">
            <p className="text-gray-500">Approved</p>
            <h2 className="text-3xl font-bold text-green-600 mt-1">92</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition hover:-translate-y-1">
            <p className="text-gray-500">Rejected</p>
            <h2 className="text-3xl font-bold text-red-500 mt-1">14</h2>
          </div>

        </div>

        {/* Report Type Selector */}

        <div className="bg-white p-8 rounded-2xl shadow-md">

          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Select Report Type
          </h2>

          <div className="grid md:grid-cols-4 gap-4">

            {[
              { id: "monthly", label: "Monthly Report", icon: "📅" },
              { id: "yearly", label: "Yearly Report", icon: "📊" },
              { id: "achievements", label: "Achievements", icon: "🏆" },
              { id: "students", label: "Student Activity", icon: "👨‍🎓" },
            ].map((item) => (

              <button
                key={item.id}
                onClick={() => setReportType(item.id)}
                className={`p-5 rounded-xl border transition text-left
                ${reportType === item.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                  }`}
              >

                <p className="text-2xl">{item.icon}</p>

                <p className="mt-2 font-medium text-gray-700">
                  {item.label}
                </p>

              </button>

            ))}

          </div>

        </div>

        {/* Generate Report */}

        <div className="bg-white p-8 rounded-2xl shadow-md flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Generate Report
            </h2>

            <p className="text-gray-500 text-sm">
              Generate analytics based on selected report type
            </p>
          </div>

          <button
            onClick={generateReport}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg
            hover:bg-blue-700 transition shadow hover:scale-105"
          >
            Generate Report
          </button>

        </div>

        {/* Export Section */}

        <div className="bg-white p-8 rounded-2xl shadow-md">

          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Export Reports
          </h2>

          <div className="flex flex-wrap gap-4">

            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg
              hover:bg-green-700 transition shadow hover:scale-105"
            >
              📄 Export CSV
            </button>

            <button
              className="bg-purple-600 text-white px-6 py-3 rounded-lg
              hover:bg-purple-700 transition shadow hover:scale-105"
            >
              📑 Export PDF
            </button>

            <button
              className="bg-gray-800 text-white px-6 py-3 rounded-lg
              hover:bg-black transition shadow hover:scale-105"
            >
              📊 Export Analytics
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}
