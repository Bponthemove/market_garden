export function nextDayDelivery() {
  const now = new Date();
  const after = now.getHours() > 15;
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleString('en-GB');
  const dayAfterTomorrow = new Date(
    now.getTime() + 48 * 60 * 60 * 1000
  ).toLocaleDateString('en-GB');
  if (after) {
    return dayAfterTomorrow;
  } else {
    return tomorrow;
  }
}
