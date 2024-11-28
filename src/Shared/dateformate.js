export function formatDate(dateString) {
  // Create a Date object from the provided date string
  const date = new Date(dateString);

  // Define options for toLocaleDateString to get the desired format
  const options = {
    weekday: "short", // "Wed"
    year: "numeric", // "2024"
    month: "long", // "May"
    day: "numeric", // "2"
  };

  // Format the date using toLocaleDateString with the options
  return date.toLocaleDateString("en-US", options);
}
