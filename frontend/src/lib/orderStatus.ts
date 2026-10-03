export const orderStatuses = [
  { id: "new", label: "ثبت شده" },
  { id: "confirmed", label: "تایید شده" },
  { id: "shipped", label: "ارسال شده" },
  { id: "delivered", label: "تحویل شده" },
  { id: "cancelled", label: "لغو شده" },
] as const;

export function statusLabel(id: string) {
  return orderStatuses.find((item) => item.id === id)?.label ?? id;
}

export function statusClass(id: string) {
  switch (id) {
    case "new":
      return "border-gold bg-cream text-cocoa";
    case "confirmed":
      return "border-olive bg-white text-olive";
    case "shipped":
      return "border-cocoa bg-cocoa text-white";
    case "delivered":
      return "border-[#245c32] bg-[#e7f0e4] text-[#245c32]";
    case "cancelled":
      return "border-[#8d3b32] bg-[#f8ecec] text-[#8d3b32]";
    default:
      return "border-line bg-white text-ink";
  }
}
