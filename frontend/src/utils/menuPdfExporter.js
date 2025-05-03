import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const doc = new jsPDF();

  const imageWidth = 35;
  const imageHeight = 25;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`${categoryTitle} Menu Report`, 14, 20);

  const menusWithImages = await Promise.all(
    menus.map(async (menu) => {
      const imgData = menu.image
        ? await toDataURL(`http://localhost:5000/${menu.image.replace(/\\/g, "/")}`)
        : "";
      return { ...menu, imgData };
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
      `Rs. ${menu.price}`,
      `Rs. ${menu.actualPrice}`,
      menu.description || "-",
    ]),
    didDrawCell: (data) => {
      if (data.column.index === 0 && data.cell.raw?.imgData) {
        const x = data.cell.x + 3;
        const y = data.cell.y + 3;
        doc.addImage(data.cell.raw.imgData, "JPEG", x, y, imageWidth, imageHeight);
      }
    },
    styles: {
      fontSize: 10,
      valign: "top",
      halign: "left",
      lineColor: [0, 0, 0], // black border
      lineWidth: 0.2,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
      fontStyle: "bold",
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: imageWidth + 6 },
      1: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
      5: {
        cellWidth: 60,
        overflow: "linebreak",
        cellPadding: { top: 4, right: 4, bottom: 4, left: 4 },
      },
    },
    theme: "grid", // enables full borders
    rowPageBreak: "avoid",
  });

  doc.save(`${categoryTitle}-Menu.pdf`);
};
