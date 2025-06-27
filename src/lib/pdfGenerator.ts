import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateSalesReportPDF = (salesData: any, orders: any[], payments: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(230, 57, 70); // Brand red
  doc.text('MealTimes - Sales Report', 20, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Summary Section
  doc.setFontSize(16);
  doc.text('Summary', 20, 50);
  
  const summaryData = [
    ['Total Orders', salesData.totalOrders.toString()],
    ['Total Revenue', `$${salesData.totalRevenue.toLocaleString()}`],
    ['Orders This Month', salesData.ordersThisMonth.toString()],
    ['Orders This Week', salesData.ordersThisWeek.toString()],
    ['Monthly Revenue', `$${salesData.revenueThisMonth.toLocaleString()}`],
    ['Weekly Revenue', `$${salesData.revenueThisWeek.toLocaleString()}`],
    ['Average Order Value', `$${salesData.averageOrderValue.toFixed(2)}`],
  ];
  
  doc.autoTable({
    startY: 60,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [230, 57, 70] },
    margin: { left: 20, right: 20 },
  });
  
  // Top Performing Days
  let currentY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(16);
  doc.text('Top Performing Days', 20, currentY);
  
  const topDaysData = salesData.topDays.map(([date, data]: any, index: number) => [
    `#${index + 1}`,
    date,
    data.count.toString(),
    `$${data.revenue.toLocaleString()}`
  ]);
  
  doc.autoTable({
    startY: currentY + 10,
    head: [['Rank', 'Date', 'Orders', 'Revenue']],
    body: topDaysData,
    theme: 'grid',
    headStyles: { fillColor: [230, 57, 70] },
    margin: { left: 20, right: 20 },
  });
  
  // Recent Orders
  currentY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(16);
  doc.text('Recent Orders', 20, currentY);
  
  const recentOrdersData = orders.slice(0, 10).map((order: any) => [
    `#${order.orderID}`,
    `Employee #${order.employeeID}`,
    new Date(order.orderDate).toLocaleDateString(),
    order.deliveryStatus,
    `$${order.meals.reduce((sum: number, meal: any) => sum + meal.price, 0)}`
  ]);
  
  doc.autoTable({
    startY: currentY + 10,
    head: [['Order ID', 'Employee', 'Date', 'Status', 'Total']],
    body: recentOrdersData,
    theme: 'grid',
    headStyles: { fillColor: [230, 57, 70] },
    margin: { left: 20, right: 20 },
  });
  
  // Payment Summary
  if (payments.length > 0) {
    currentY = doc.lastAutoTable.finalY + 20;
    
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Payment Summary', 20, currentY);
    
    const totalPayments = payments.reduce((sum: number, p: any) => sum + p.paymentAmount, 0);
    const paymentSummaryData = [
      ['Total Payments', payments.length.toString()],
      ['Total Payment Amount', `$${totalPayments.toLocaleString()}`],
      ['Average Payment', `$${(totalPayments / payments.length).toFixed(2)}`],
    ];
    
    doc.autoTable({
      startY: currentY + 10,
      head: [['Payment Metric', 'Value']],
      body: paymentSummaryData,
      theme: 'grid',
      headStyles: { fillColor: [230, 57, 70] },
      margin: { left: 20, right: 20 },
    });
    
    // Recent Payments
    currentY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text('Recent Payments', 20, currentY);
    
    const recentPaymentsData = payments.slice(0, 5).map((payment: any) => [
      payment.companyName,
      new Date(payment.paymentDate).toLocaleDateString(),
      `$${payment.paymentAmount.toLocaleString()}`,
      payment.paymentMethod,
      payment.planName || 'N/A'
    ]);
    
    doc.autoTable({
      startY: currentY + 10,
      head: [['Company', 'Date', 'Amount', 'Method', 'Plan']],
      body: recentPaymentsData,
      theme: 'grid',
      headStyles: { fillColor: [230, 57, 70] },
      margin: { left: 20, right: 20 },
    });
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | MealTimes Sales Report | Generated ${new Date().toLocaleString()}`,
      20,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Save the PDF
  const fileName = `sales-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};