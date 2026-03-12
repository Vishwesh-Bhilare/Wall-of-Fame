type Activity = {
  id: string;
  message: string;
};

type Props = {
  activities: Activity[];
};

export default function ActivityFeed({ activities }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        Recent Activity
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-400">
          No recent activity
        </p>
      ) : (
        <ul className="space-y-3">

          {activities.map((activity) => (
            <li
              key={activity.id}
              className="border-l-4 border-blue-500 pl-3 text-gray-700"
            >
              {activity.message}
            </li>
          ))}

        </ul>
      )}

    </div>
  );
}