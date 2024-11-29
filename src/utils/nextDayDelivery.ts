export function nextDayDelivery() {
  
  const now = new Date();
  
  const after = now.getHours() > 13;

  const plusOneDay = now.getTime() + 24 * 60 * 60 * 1000;
  const plusTwoDays = now.getTime() + 48 * 60 * 60 * 1000;
  const plusThreeDays = now.getTime() + 72 * 60 * 60 * 1000;
  
  const tomorrow = new Date(plusOneDay).getDay() === 0 ? 
    new Date(plusTwoDays).toLocaleDateString("en-GB")
    :
    new Date(plusOneDay).toLocaleDateString("en-GB");
  
  const dayAfterTomorrow = new Date(plusTwoDays).getDay() === 0 ? 
  new Date(plusThreeDays).toLocaleDateString("en-GB")
  :
  new Date(plusTwoDays).toLocaleDateString("en-GB");

  if (after) {
    return dayAfterTomorrow;
  } else {
    return tomorrow;
  }
}
