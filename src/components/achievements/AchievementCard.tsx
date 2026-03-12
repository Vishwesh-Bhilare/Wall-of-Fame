import Card from "../ui/Card";

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
