export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
    : "—";

// Short label for a visitor's anonymous ID (a UUID); older chats have none
export const visitorLabel = (visitorId) => (visitorId ? `#${visitorId.slice(0, 8)}` : "—");

// Assistant answer outcomes saved by the chatbot (answered needs no label)
export const STATUS_LABELS = {
  refused: "Declined",
  cut_off: "Cut off",
  failed: "Failed",
  stopped: "Visitor closed chat",
};
