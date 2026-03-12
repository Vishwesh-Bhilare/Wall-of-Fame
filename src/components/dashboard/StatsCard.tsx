import Card from "../ui/Card";

type Props = {
  title: string;
  value: number;
  color?: string;
};

export default function StatsCard({ title, value, color = "text-blue-600" }: Props) {
  return (
    <Card className="p-6 text-center hover:shadow-lg transition">

      <h3 className="text-gray-500 text-sm uppercase tracking-wide">
        {title}
      </h3>

      <p className={`text-4xl font-bold mt-2 ${color}`}>
        {value}
      </p>

    </Card>
  );
}