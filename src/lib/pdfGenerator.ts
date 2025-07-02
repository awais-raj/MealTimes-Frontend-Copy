import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF types
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }

  interface jsPDFAPI {
    getNumberOfPages?: () => number;
  }
}

export const generateSalesReportPDF = (salesData: any, orders: any[], payments: any[]) => {
  console.log('Generating PDF...', { salesData, orders, payments });

  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(230, 57, 70);
  doc.text('MealTimes - Sales Report', 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  // Summary
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

  autoTable(doc, {
    startY: 60,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [230, 57, 70] },
    margin: { left: 20, right: 20 },
  });

  // Top Performing Days
  let currentY = doc.lastAutoTable?.finalY ?? 90;
  currentY += 10;
  doc.setFontSize(16);
  doc.text('Top Performing Days', 20, currentY);

  const topDaysData = salesData.topDays.map(([date, data]: any, index: number) => [
    `#${index + 1}`,
    date,
    data.count.toString(),
    `$${data.revenue.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: currentY + 5,
    head: [['Rank', 'Date', 'Orders', 'Revenue']],
    body: topDaysData,
    theme: 'grid',
    headStyles: { fillColor: [230, 57, 70] },
    margin: { left: 20, right: 20 },
  });

  // All Orders
  currentY = doc.lastAutoTable?.finalY ?? 120;
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  currentY += 10;
  doc.setFontSize(16);
  doc.text('All Orders', 20, currentY);

  const allOrdersData = orders.map((order: any) => [
    `#${order.orderID}`,
    `Employee #${order.employeeID}`,
    new Date(order.orderDate).toLocaleDateString(),
    order.deliveryStatus,
    `$${(order.meals?.reduce((sum: number, meal: any) => sum + meal.price, 0) || 0).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: currentY + 5,
    head: [['Order ID', 'Employee', 'Date', 'Status', 'Total']],
    body: allOrdersData,
    theme: 'grid',
    headStyles: { fillColor: [230, 57, 70] },
    margin: { left: 20, right: 20 },
    didDrawPage: () => {
      currentY = doc.lastAutoTable?.finalY ?? 0;
    }
  });

  // Payment Summary
  if (payments.length > 0) {
    currentY = doc.lastAutoTable?.finalY ?? 150;
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    currentY += 10;
    doc.setFontSize(16);
    doc.text('Payment Summary', 20, currentY);

    const totalPayments = payments.reduce((sum: number, p: any) => sum + p.paymentAmount, 0);
    const paymentSummaryData = [
      ['Total Payments', payments.length.toString()],
      ['Total Payment Amount', `$${totalPayments.toLocaleString()}`],
      ['Average Payment', `$${(totalPayments / payments.length).toFixed(2)}`],
    ];

    autoTable(doc, {
      startY: currentY + 5,
      head: [['Payment Metric', 'Value']],
      body: paymentSummaryData,
      theme: 'grid',
      headStyles: { fillColor: [230, 57, 70] },
      margin: { left: 20, right: 20 },
    });

    currentY = doc.lastAutoTable?.finalY ?? 190;
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    currentY += 10;
    doc.setFontSize(16);
    doc.text('All Payments', 20, currentY);

    const allPaymentsData = payments.map((payment: any) => [
      payment.companyName,
      new Date(payment.paymentDate).toLocaleDateString(),
      `$${payment.paymentAmount.toLocaleString()}`,
      payment.paymentMethod,
      payment.planName || 'N/A'
    ]);

    autoTable(doc, {
      startY: currentY + 5,
      head: [['Company', 'Date', 'Amount', 'Method', 'Plan']],
      body: allPaymentsData,
      theme: 'grid',
      headStyles: { fillColor: [230, 57, 70] },
      margin: { left: 20, right: 20 },
    });
  }

  // Footer: Page Numbers
  const pageCount = (doc as any).internal.getNumberOfPages?.() ?? 1;
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

  // Save PDF
  const fileName = `sales-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};