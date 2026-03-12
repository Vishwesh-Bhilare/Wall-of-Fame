import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusBadge from "./StatusBadge";
import { formatDate } from "@/lib/helpers";
import MediaPreview from "@/components/achievements/MediaPreview";

type Props = {
  title: string;
  student: string;
  type: string;
  status: string;
  description?: string;
  rank?: string;
  submittedAt?: string;
  onApprove?: () => void;
  onReject?: () => void;
  certificateUrl?: string;
  busy?: boolean;
};

export default function ReviewPanel({
  title,
  student,
  type,
  status,
  description,
  rank,
  submittedAt,
  onApprove,
  onReject,
  certificateUrl,
  busy,
}: Props) {
  return (
    <Card className="h-full">
      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <StatusBadge status={status} />
        </div>

        <p className="text-sm text-gray-600">Submitted by: {student}</p>
        <p className="mt-1 text-sm font-semibold text-red-700">{type}</p>

        {rank ? <p className="mt-2 text-sm text-gray-600">Rank/ID: {rank}</p> : null}

        {description ? <p className="mt-2 line-clamp-3 text-sm text-gray-600">{description}</p> : null}

        {submittedAt ? <p className="mt-2 text-xs text-gray-500">Submitted on {formatDate(submittedAt)}</p> : null}

        <MediaPreview url={certificateUrl} compact />

        {(onApprove || onReject) && (
          <div className="mt-auto flex gap-2 pt-5">
            <Button variant="success" className="flex-1" onClick={onApprove} disabled={busy || !onApprove}>
              Approve
            </Button>

            <Button variant="danger" className="flex-1" onClick={onReject} disabled={busy || !onReject}>
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
