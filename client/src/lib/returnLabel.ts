import { jsPDF } from "jspdf";

interface ReturnLabelData {
  customerName: string;
  customerAddress: string;
  boxId: number;
  subscriptionId: number;
  returnByDate: string;
}

export function generateReturnLabel(data: ReturnLabelData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("RETURN LABEL", pageWidth / 2, y, { align: "center" });
  y += 15;

  // Seasons Logo/Text
  doc.setFontSize(18);
  doc.setFont("helvetica", "normal");
  doc.text("SEASONS", pageWidth / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Luxury Baby Clothing Rental", pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0);
  y += 20;

  // Divider line
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // FROM Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("FROM:", margin, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(data.customerName, margin, y);
  y += 6;

  // Split address into lines if needed
  const addressLines = data.customerAddress.split("\n");
  addressLines.forEach((line) => {
    doc.text(line.trim(), margin, y);
    y += 6;
  });
  y += 10;

  // Divider line
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // TO Section (Seasons Return Address)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TO:", margin, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Seasons Returns", margin, y);
  y += 6;
  doc.text("123 Fashion Street", margin, y);
  y += 6;
  doc.text("Dublin D02 ABC1", margin, y);
  y += 6;
  doc.text("Ireland", margin, y);
  y += 20;

  // Divider line
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Box Information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("RETURN DETAILS", margin, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  // Box ID
  doc.text(`Box ID: ${data.boxId}`, margin, y);
  y += 7;

  // Subscription ID
  doc.text(`Subscription: ${data.subscriptionId}`, margin, y);
  y += 7;

  // Return By Date
  doc.text(`Return By: ${data.returnByDate}`, margin, y);
  y += 20;

  // Instructions Box
  doc.setDrawColor(0);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 45, 3, 3, "F");
  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("RETURN INSTRUCTIONS:", margin + 5, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const instructions = [
    "1. Place all items in the original packaging if possible",
    "2. Attach this label to the outside of the box",
    "3. Drop off at any An Post location or schedule a pickup",
    "4. Keep your tracking number for reference",
  ];
  instructions.forEach((instruction) => {
    doc.text(instruction, margin + 5, y);
    y += 6;
  });
  y += 15;

  // QR Code placeholder (simple text reference for now)
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Reference: SEASONS-${data.subscriptionId}-${data.boxId}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 5;
  doc.text(
    "Track your return at: seasons.ie/returns",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  // Footer
  y = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "Thank you for choosing Seasons. Questions? Email returns@seasons.ie",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  // Save the PDF
  doc.save(`seasons-return-label-${data.boxId}.pdf`);
}
