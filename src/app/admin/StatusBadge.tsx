type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  let color = "bg-gray-300";

  if (status === "approved") color = "bg-green-500 text-white";
  if (status === "pending") color = "bg-yellow-400";
  if (status === "rejected") color = "bg-red-500 text-white";

  return (
    <span className={`px-3 py-1 rounded text-sm ${color}`}>
      {status}
    </span>
  );
}
