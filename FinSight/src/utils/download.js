import jsPDF from 'jspdf';

// Function to download score as PDF only
const downloadScoreAsPDF = (score, businessType, date, simulationData = {}) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set colors
  const primaryColor = [44, 108, 113]; // #2C6C71 in RGB
  const accentColor = [245, 178, 123]; // #F5B27B in RGB
  const darkColor = [1, 39, 43]; // #01272B in RGB
  
  // Add title
doc.setFontSize(24);
doc.setFont('helvetica', 'bold');
doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
doc.text('FinSight Risk Report', 20, 20);

// Add score section
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
doc.text('Your Risk Score', 20, 55);
  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${date || new Date().toLocaleDateString()}`, 20, 30);
  
  // Add business type
  doc.text(`Business Type: ${businessType}`, 20, 37);
  
  // Add line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 42, 190, 42);
  
  // Add score section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Your Health Score', 20, 55);
  
  // Add score in a circle
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.circle(60, 80, 15, 'F');
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(score.toString(), 55, 85);
  
  // Add status
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(getScoreStatus(score), 90, 85);
  
  // Add potential benefits section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Potential Benefits', 20, 115);
  
  // Add benefits text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  const benefits = [
    '1. Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
    '2. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.'
  ];
  
  doc.text(benefits[0], 20, 125, { maxWidth: 170 });
  doc.text(benefits[1], 20, 145, { maxWidth: 170 });
  
  // Add recommendations section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Recommendations', 20, 175);
  
  // Add recommendations based on score
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  
  const recommendations = getRecommendations(score);
  let yPos = 185;
  recommendations.forEach((rec, index) => {
    doc.text(`${index + 1}. ${rec}`, 25, yPos);
    yPos += 7;
  });
  
  // Add simulation data if available
  if (Object.keys(simulationData).length > 0) {
    yPos += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text('Simulation Adjustments', 20, yPos);
    
    yPos += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    
    const adjustments = [
      `Rent: ${simulationData.rent || 0}%`,
      `Stock Spending: ${simulationData.stockSpending || 0}%`,
      `Loan Repayments: ${simulationData.loanRepayments || 0}%`,
      `Cash Buffer: ${simulationData.cashBuffer || 0}%`
    ];
    
    adjustments.forEach(adj => {
      doc.text(`• ${adj}`, 25, yPos);
      yPos += 5;
    });
  }
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('© 2026 FinSight - Know. Plan. Grow.', 20, 280);
  doc.text('No login required. Your data is private.', 20, 285);
  
  // Save the PDF
  doc.save(`finsight-report-${date || 'report'}.pdf`);
};

// Helper function to get score status
const getScoreStatus = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Improvement';
  return 'At Risk';
};

// Helper function for recommendations
const getRecommendations = (score) => {
  if (score >= 80) {
    return [
      'Maintain your current financial strategy',
      'Consider expansion opportunities',
      'Build emergency fund covering 6 months'
    ];
  }
  if (score >= 60) {
    return [
      'Reduce unnecessary expenses by 10-15%',
      'Improve cash flow management',
      'Review loan terms for better rates'
    ];
  }
  if (score >= 40) {
    return [
      'Cut discretionary spending immediately',
      'Renegotiate with suppliers for better terms',
      'Seek professional financial advice'
    ];
  }
  return [
    'Urgent financial review needed',
    'Consider debt consolidation options',
    'Create emergency action plan'
  ];
};

// Export only the PDF function as default
export default downloadScoreAsPDF;