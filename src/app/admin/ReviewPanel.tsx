import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusBadge from "./StatusBadge";

type Props = {
  title: string;
  student: string;
  type: string;
  status: string;
  onApprove?: () => void;
  onReject?: () => void;
  certificateUrl?: string;
};

export default function ReviewPanel({
  title,
  student,
  type,
  status,
  onApprove,
  onReject,
  certificateUrl,
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

        {certificateUrl ? (
          <a
            href={certificateUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-fit rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            View proof
          </a>
        ) : null}

        <div className="mt-auto flex gap-2 pt-5">
          <Button variant="success" className="flex-1" onClick={onApprove}>
            Approve
          </Button>
          <Button variant="danger" className="flex-1" onClick={onReject}>
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
}import Button from "../ui/Button";
import StatusBadge from "./StatusBadge";

type Props = {
  title: string;
  student: string;
  status: string;
};

export default function ReviewPanel({ title, student, status }: Props) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-gray-500">Submitted by {student}</p>

      <div className="mt-3">
        <StatusBadge status={status} />
      </div>

      <div className="flex gap-2 mt-4">
        <Button className="bg-green-600 hover:bg-green-700">
          Approve
        </Button>

        <Button className="bg-red-600 hover:bg-red-700">
          Reject
        </Button>
      </div>
    </div>
  );
}
