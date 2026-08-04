import jsPDF from "jspdf";
import "jspdf-autotable";

export function generateInvoice(payment, student) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(25, 40, 90);
  doc.text("COLLINS CLASSROOM", 20, 20);

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text("Professional English Learning Platform", 20, 28);
  doc.text("https://collinsclassroom.online", 20, 34);

  // Invoice title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("PAYMENT INVOICE", 20, 50);

  // Invoice information
  doc.setFontSize(11);

  doc.text(`Invoice #: INV-${payment.id.slice(0, 8)}`, 20, 65);
  doc.text(
    `Date: ${new Date(payment.created_at).toLocaleDateString()}`,
    20,
    73
  );

  doc.text(`Student: ${student.full_name}`, 20, 88);
  doc.text(`Email: ${student.email}`, 20, 96);

  doc.autoTable({
    startY: 110,
    head: [["Description", "Amount"]],
    body: [
      ["English Course Payment", `$${payment.amount}`],
    ],
  });

  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(12);
  doc.text(`Payment Status: ${payment.status}`, 20, finalY);

  doc.text(
    "Thank you for choosing Collins Classroom.",
    20,
    finalY + 15
  );

  doc.save(`Invoice-${payment.id.slice(0, 8)}.pdf`);
}