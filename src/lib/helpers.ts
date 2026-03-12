export function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  const day = `${parsed.getDate()}`.padStart(2, "0");
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const year = parsed.getFullYear();

  return `${day}/${month}/${year}`;
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


export function escapeForIlike(query: string) {
  return query.replace(/[%_,]/g, (char) => `\\${char}`);
}
