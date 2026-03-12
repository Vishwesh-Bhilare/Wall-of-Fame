import Button from "../ui/Button";
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
