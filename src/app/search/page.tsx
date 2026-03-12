export default function SearchPage() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Search Achievements</h1>

      <input
        type="text"
        placeholder="Search..."
        className="border p-2 w-full max-w-lg"
      />

      <div className="mt-6 bg-white p-6 rounded shadow">
        <p>Search results will appear here.</p>
      </div>
    </div>
  );
}