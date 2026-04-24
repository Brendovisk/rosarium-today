export const getCurrentDate = () => {
  return new Intl.DateTimeFormat("default", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
};
