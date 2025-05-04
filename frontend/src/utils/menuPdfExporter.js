import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Convert image URL to base64
const toDataURL = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = function () {
      resolve(""); // fallback if image fails
    };
    img.src = url;
  });

export const generateMenuPdf = async (menus, categoryTitle = "All Categories") => {
  const doc = new jsPDF("p", "mm", "a4");

  const imageWidth = 30;
  const imageHeight = 22;
  const pageMargin = 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(`${categoryTitle} Menu Report`, pageMargin, 20);

  // Prepare menu data with images and actual prices
  const menusWithImages = await Promise.all(
    menus.map(async (menu) => {
      const imgData = menu.image
        ? await toDataURL(`http://localhost:5000/${menu.image.replace(/\\/g, "/")}`)
        : "";

      const actualPrice =
        menu.promotion?.discountRate > 0 &&
        new Date() >= new Date(menu.promotion.startDate) &&
        new Date() <= new Date(menu.promotion.endDate)
          ? menu.price - (menu.price * menu.promotion.discountRate) / 100
          : menu.price;

      return { ...menu, imgData, actualPrice };
    })
  );

  autoTable(doc, {
    startY: 30,
    head: [["Image", "Name", "Category", "Price", "Actual Price", "Description"]],
    body: menusWithImages.map((menu) => [
      {
        content: "",
        styles: { minCellHeight: imageHeight + 6 },
        imgData: menu.imgData,
      },
      menu.name,
      menu.category,
      `Rs. ${menu.price.toFixed(2)}`,
      `Rs. ${menu.actualPrice.toFixed(2)}`,
      menu.description || "-",
    ]),
    didDrawCell: (data) => {
      if (data.column.index === 0 && data.cell.raw?.imgData) {
        const x = data.cell.x + 2;
        const y = data.cell.y + 2;
        doc.addImage(data.cell.raw.imgData, "JPEG", x, y, imageWidth, imageHeight);
      }
    },
    styles: {
      fontSize: 9,
      valign: "top",
      halign: "left",
      lineColor: [200, 200, 200],
      lineWidth: 0.3,
      cellPadding: 3,
      textColor: 20,
    },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: imageWidth + 4 },
      1: { cellWidth: 35 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
      5: {
        cellWidth: 60,
        overflow: "linebreak",
        cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
        valign: "top",
      },
    },
    theme: "grid",
    margin: { top: 20, left: pageMargin, right: pageMargin },
    rowPageBreak: "avoid",
  });

  doc.save(`${categoryTitle}-Menu.pdf`);
};
