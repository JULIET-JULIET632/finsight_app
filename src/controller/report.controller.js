import { generateReport } from "../services/pdf.service.js";
import path from "path";

const downloadReport = (req, res) => {

  const filePath =
    path.join(process.cwd(), "report.pdf");

  generateReport(req.body, filePath);

  res.download(filePath);
};

export default downloadReport;