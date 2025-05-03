import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Important to register the plugin

export const generatePromotionReportPdf = (data) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Promotion Report", 14, 20);

  const date = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 14, 30);

  // ✅ Only Current Promotions
  doc.setFontSize(14);
  doc.text("Current Promotions", 14, 40);
  autoTable(doc, {
    startY: 45,
    head: [["Name", "Category", "Discount", "Start Date", "End Date"]],
    body: data.currentPromotions.map(item => [
      item.name,
      item.category,
      item.promotion.discountRate + "%",
      item.promotion.startDate?.substring(0, 10),
      item.promotion.endDate?.substring(0, 10),
    ]),
  });

  doc.save(`promotion-report-${date}.pdf`);
};
