export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "green";
    case "pending":
      return "yellow";
    case "rejected":
      return "red";
    default:
      return "gray";
  }
}