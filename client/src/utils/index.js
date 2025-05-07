
// Utility functions for date formatting
export const dateConverter = (dateString) => {
    if (!dateString) return "";
  
    const date = new Date(dateString);
    const day = date.getDate();
    const monthYear = new Intl.DateTimeFormat("en", {
      month: "short",
      year: "numeric"
    }).format(date);
  
    return `${day} ${monthYear}`;
  };