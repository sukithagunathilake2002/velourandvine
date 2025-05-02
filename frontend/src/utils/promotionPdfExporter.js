import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ must be present

export const generatePromotionReportPdf = (data) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Promotion Report", 14, 20);

  const date = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 14, 30);

  doc.setFontSize(14);
  doc.text("Current Promotions", 14, 40);

  doc.autoTable({
    startY: 45,
    head: [["Name", "Discount"]],
    body: data.currentPromotions.map(item => [
      item.name,
      item.promotion.discountRate + "%",
    ]),
  });

  const nextY = doc.lastAutoTable.finalY + 10;
  doc.text("Upcoming Promotions", 14, nextY);

  doc.autoTable({
    startY: nextY + 5,
    head: [["Name", "Discount"]],
    body: data.upcomingPromotions.map(item => [
      item.name,
      item.promotion.discountRate + "%",
    ]),
  });

  doc.save(`promotion-report-${date}.pdf`);
};
