import PDFDocument from "pdfkit";
import path from "path";

export const downloadReport = async (req, res, next) => {
  try {
    const { sector, final_score, action_steps, growth_tips, currency } = req.body;

    // Name the file based on the sector instead of the business name
    const safeSectorName = (sector || "Strategy").replace(/\s+/g, '_'); 
    const filename = `FinSight_${safeSectorName}_Report.pdf`;
    
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    // --- 1. BACKGROUND WATERMARK (MASSIVE & CENTERED) ---
    const logoPath = path.join(process.cwd(), "assets", "logo.png"); 
    try {
      const logoSize = 800; 
      const xPos = (doc.page.width - logoSize) / 2;
      const yPos = (doc.page.height - logoSize) / 2;

      doc.save().opacity(0.03) 
         .image(logoPath, xPos, yPos, { 
           fit: [logoSize, logoSize], 
           align: 'center',           
           valign: 'center'           
         })
         .restore();
    } catch (err) { console.warn("Logo skipped"); }

    // --- 2. HEADER BAR (HEIGHT: 120) ---
    doc.rect(0, 0, doc.page.width, 120).fill("#1e293b"); 
    
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(20)
       .text("FINSIGHT STRATEGY REPORT", 0, 52, { 
         width: doc.page.width, 
         align: "center", 
         characterSpacing: 1 
       });
    
    // --- 3. SCORE & SECTOR SUMMARY ---
    const boxY = 150; 
    doc.rect(50, boxY, 495, 60).lineWidth(0.5).stroke("#e2e8f0");
    
    // Left column (Health Score)
    const leftColX = 60;
    const leftColWidth = 150;
    
    doc.fillColor("#64748b").font("Helvetica").fontSize(9)
       .text("PROJECTED HEALTH SCORE", leftColX, boxY + 15, { width: leftColWidth, align: "center" });
       
    doc.fillColor(final_score >= 70 ? "#10b981" : "#f59e0b").font("Helvetica-Bold").fontSize(16)
       .text(`${final_score}/100`, leftColX, boxY + 30, { width: leftColWidth, align: "center" });
    
    // Right column (Sector) - Stacked perfectly with "center" alignment
    const rightColX = 360; // Adjusted slightly to sit cleanly on the right side
    const rightColWidth = 150;

    doc.fillColor("#64748b").font("Helvetica").fontSize(9)
       .text("INDUSTRY SECTOR", rightColX, boxY + 15, { width: rightColWidth, align: "center" });
       
    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(14)
       .text((sector || "Business").toUpperCase(), rightColX, boxY + 30, { width: rightColWidth, align: "center" });

    // --- RESET MARGINS ---
    doc.x = 50;
    doc.y = boxY + 100;

    // --- 4. IMMEDIATE ACTION PLAN ---
    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(16).text("Immediate Action Plan", 50, doc.y);
    doc.rect(50, doc.y + 4, 40, 2).fill("#3b82f6"); 
    doc.y += 20;

    if (action_steps && Array.isArray(action_steps)) {
      action_steps.forEach((step) => {
        doc.fillColor("#334155").font("Helvetica").fontSize(11)
           .text(`• ${step}`, 50, doc.y, { width: 495, lineGap: 4 });
        doc.y += 10; 
      });
    }

    doc.y += 20;

    // --- 5. STRATEGIC GROWTH TIPS ---
    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(16).text("Strategic Growth Tips", 50, doc.y);
    doc.rect(50, doc.y + 4, 40, 2).fill("#10b981");
    doc.y += 20;

    if (growth_tips && Array.isArray(growth_tips)) {
      growth_tips.forEach((tip) => {
        doc.fillColor("#334155").font("Helvetica").fontSize(11)
           .text(`• ${tip}`, 50, doc.y, { width: 495, lineGap: 4 });
        doc.y += 10;
      });
    }

    // --- 6. FOOTER ---
    doc.y = doc.page.height - 80; 
    doc.fontSize(8).fillColor("#94a3b8").text(
      "This report provides AI-generated suggestions based on your simulation. Consult with a financial advisor for major decisions.",
      50, doc.y, { align: "center", width: 495 }
    );

    doc.end();
  } catch (error) {
    console.error("PDF Error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: "Failed to generate PDF" });
    }
  }
};