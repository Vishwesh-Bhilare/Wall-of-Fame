import Card from "../ui/Card";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  type: string;
  status: string;
  description?: string;
};

const statusStyleMap: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  rejected: "bg-rose-100 text-rose-700 border border-rose-200",
};

export default function AchievementCard({ id, title, type, status, description }: Props) {
  const normalizedStatus = status?.toLowerCase() || "pending";

  return (
    <Card className="h-full">
      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-bold text-gray-900">{title}</h3>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyleMap[normalizedStatus] || "bg-gray-100 text-gray-700 border border-gray-200"}`}
          >
            {normalizedStatus}
          </span>
        </div>

        <p className="text-sm font-semibold text-red-700">{type}</p>
        {description ? <p className="mt-2 line-clamp-3 text-sm text-gray-600">{description}</p> : null}

        <Link href={`/achievements/${id}`} className="mt-4 text-sm font-semibold text-red-700 hover:underline">
          View details
        </Link>
      </div>
    </Card>
  );
}import Card from "../ui/Card";

type Props = {
  title: string;
  type: string;
  status: string;
};

export default function AchievementCard({ title, type, status }: Props) {
  return (
    <Card>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{type}</p>

      <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-2 inline-block">
        {status}
      </span>
    </Card>
  );
}
