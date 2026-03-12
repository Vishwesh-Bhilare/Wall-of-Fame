import Card from "../ui/Card";
import Link from "next/link";
import type { AchievementStatus } from "@/types/achievement";
import { formatDate } from "@/lib/helpers";
import MediaPreview from "./MediaPreview";

type Props = {
  id: string;
  title: string;
  type: string;
  status: AchievementStatus;
  description?: string | null;
  rank?: string | null;
  createdAt?: string;
  ctaLabel?: string;
  certificateUrl?: string;
};

const statusStyleMap: Record<AchievementStatus, string> = {
  approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  rejected: "bg-rose-100 text-rose-700 border border-rose-200",
};

export default function AchievementCard({
  id,
  title,
  type,
  status,
  description,
  rank,
  createdAt,
  ctaLabel = "View details",
  certificateUrl,
}: Props) {
  return (
    <Card className="h-full p-5">
      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-lg font-bold text-gray-900">{title}</h3>

          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyleMap[status]}`}>
            {status}
          </span>
        </div>

        <p className="text-sm font-semibold text-red-700">{type}</p>

        {rank ? <p className="mt-1 text-sm text-gray-600">Rank/ID: {rank}</p> : null}

        {description ? <p className="mt-2 line-clamp-3 text-sm text-gray-600">{description}</p> : null}

        <MediaPreview url={certificateUrl} compact />

        <div className="mt-auto flex items-center justify-between border-t border-red-50 pt-4 text-xs text-gray-500">
          <span>{createdAt ? formatDate(createdAt) : "-"}</span>

          <Link href={`/achievements/${id}`} className="text-sm font-semibold text-red-700 hover:underline">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </Card>
  );
}
