type Props = {
  status: string;
};

const statusStyleMap: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  rejected: "bg-rose-100 text-rose-700 border border-rose-200",
};

export default function StatusBadge({ status }: Props) {
  const normalizedStatus = status?.toLowerCase() || "pending";

  const style =
    statusStyleMap[normalizedStatus] ||
    "bg-gray-100 text-gray-700 border border-gray-200";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${style}`}
    >
      {normalizedStatus}
    </span>
  );
}