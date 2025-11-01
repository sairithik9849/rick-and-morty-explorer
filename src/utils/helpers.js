export const pageValidate = (page) => {
  if (!page) throw new Error(`Page must be a positive ineteger.`);
  if (typeof page !== "number" || isNaN(page))
    throw new Error(`Page must be a Number greater than 0.`);
};

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "alive":
      return "status-alive";
    case "dead":
      return "status-dead";
    default:
      return "status-unknown";
  }
};

export const extractIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export const extractIdsFromUrls = (urls) => {
  if (!urls || urls.length === 0) return [];
  return urls.map((url) => extractIdFromUrl(url)).filter((id) => id !== null);
};

export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};
