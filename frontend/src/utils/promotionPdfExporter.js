import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePromotionReportPdf = (data) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Promotion Report", 14, 20);

  const date = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 14, 30);

  // Current Promotions Table
  doc.setFontSize(14);
  doc.text("Current Promotions", 14, 40);
  doc.autoTable({
    startY: 45,
    head: [["Name", "Category", "Discount", "Start", "End"]],
    body: data.currentPromotions.map(item => [
      item.name,
      item.category,
      item.promotion.discountRate + "%",
      item.promotion.startDate?.substring(0, 10),
      item.promotion.endDate?.substring(0, 10),
    ])
  });

  // Upcoming Promotions Table
  const nextY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text("Upcoming Promotions", 14, nextY);
  doc.autoTable({
    startY: nextY + 5,
    head: [["Name", "Category", "Discount", "Start", "End"]],
    body: data.upcomingPromotions.map(item => [
      item.name,
      item.category,
      item.promotion.discountRate + "%",
      item.promotion.startDate?.substring(0, 10),
      item.promotion.endDate?.substring(0, 10),
    ])
  });

  doc.save(`promotion-report-${date}.pdf`);
};
