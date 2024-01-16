export const useDate = (props: string) => {
  const now = new Date();
  const firstDayOfTheWeek = now.getDate() - (now.getDay() - 1);
  const thisWeeksFriday = now.getDate() - (now.getDay() - 1) + 4;
  const cutOff = new Date(
    new Date(new Date().setDate(thisWeeksFriday)).setHours(22, 0, 0)
  );

  if (props === 'checkOut') {
    return {
      saturday: new Date(
        new Date().setDate(firstDayOfTheWeek + (new Date() < cutOff ? 5 : 12))
      ).toLocaleDateString(),
      sunday: new Date(
        new Date().setDate(firstDayOfTheWeek + (new Date() < cutOff ? 6 : 13))
      ).toLocaleDateString(),
      monday: new Date(
        new Date().setDate(firstDayOfTheWeek + (new Date() < cutOff ? 7 : 14))
      ).toLocaleDateString(),
    };
  } else {
    return {
      saturday: new Date(
        new Date().setDate(firstDayOfTheWeek + 5)
      ).toLocaleDateString(),
      sunday: new Date(
        new Date().setDate(firstDayOfTheWeek + 6)
      ).toLocaleDateString(),
      monday: new Date(
        new Date().setDate(firstDayOfTheWeek + 7)
      ).toLocaleDateString(),
    };
  };  
};
