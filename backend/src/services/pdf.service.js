import PDFDocument from "pdfkit";
import fs from "fs";

export const generateReport = (data, filePath) => {

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("FinSight Business Health Report");
  doc.moveDown();

  doc.fontSize(14).text(`Score: ${data.score}`);
  doc.text(`Risk Level: ${data.label}`);
  doc.moveDown();

  doc.text("Explanation:");
  doc.text(data.explanation);
  doc.moveDown();

  doc.text("Top Impact Areas:");
  data.impacts.forEach(item =>
    doc.text(`- ${item.feature} (${item.impact})`)
  );

  doc.end();
};