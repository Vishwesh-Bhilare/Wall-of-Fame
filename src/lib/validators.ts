export function validateEmail(email: string) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

export function validateRequired(value: string) {
  return value.trim().length > 0;
}

export function validateAchievementTitle(title: string) {
  return title.length >= 5;
}