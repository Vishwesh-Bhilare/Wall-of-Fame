import type { ReactNode } from "react";
import Card from "../ui/Card";

type Props = {
  title: string;
  value: number;
  color?: string;
  icon?: ReactNode;
};

export default function StatsCard({ title, value, color = "text-red-700", icon }: Props) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</h3>
          <p className={`mt-2 text-3xl font-black ${color}`}>{value}</p>
        </div>
        {icon ? <div className="rounded-xl bg-red-50 p-2 text-red-700">{icon}</div> : null}
      </div>
    </Card>
  );
}
