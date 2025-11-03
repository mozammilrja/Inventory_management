// lib/export-utils.ts
export const exportToCSV = (data: any[], filename: string = "assets.csv") => {
  try {
    const headers = [
      "ID",
      "Asset Name",
      "Type",
      "Serial Number",
      "Brand",
      "Model",
      "SKU",
      "Status",
      "Condition",
      "Employee Name",
      "Employee ID",
      "Employee Email",
      "Department",
      "Assignment Date",
      "Return Date",
      "Purchase Date",
      "Warranty Expiry",
      "Location",
      "Price",
      "Description",
      "Notes",
      "Created Date",
    ];

    const processRow = (product: any) => [
      product.id || "",
      product.name || "",
      product.assetType || "",
      product.serialNumber || "",
      product.brand || "",
      product.productModel || "",
      product.sku || "",
      product.status || "",
      product.condition || "",
      product.employeeName || "",
      product.employeeId || "",
      product.employeeEmail || "",
      product.department || "",
      product.assignmentDate
        ? new Date(product.assignmentDate).toLocaleDateString()
        : "",
      product.returnDate
        ? new Date(product.returnDate).toLocaleDateString()
        : "",
      product.purchaseDate
        ? new Date(product.purchaseDate).toLocaleDateString()
        : "",
      product.warrantyExpiry
        ? new Date(product.warrantyExpiry).toLocaleDateString()
        : "",
      product.location || "",
      product.price?.toString() || "0",
      `"${(product.description || "").replace(/"/g, '""')}"`,
      `"${(product.notes || "").replace(/"/g, '""')}"`,
      product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "",
    ];

    const csvContent = [
      headers.join(","),
      ...data.map((product) => processRow(product).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV export error:", error);
    throw new Error("Failed to export CSV");
  }
};

export const exportToExcel = (
  data: any[],
  filename: string = "assets.xlsx"
) => {
  try {
    const headers = [
      "ID",
      "Asset Name",
      "Type",
      "Serial Number",
      "Brand",
      "Model",
      "SKU",
      "Status",
      "Condition",
      "Employee Name",
      "Employee ID",
      "Employee Email",
      "Department",
      "Assignment Date",
      "Return Date",
      "Purchase Date",
      "Warranty Expiry",
      "Location",
      "Price",
      "Description",
      "Notes",
      "Created Date",
    ];

    const rows = data.map((product) => [
      product.id || "",
      product.name || "",
      product.assetType || "",
      product.serialNumber || "",
      product.brand || "",
      product.productModel || "",
      product.sku || "",
      product.status || "",
      product.condition || "",
      product.employeeName || "",
      product.employeeId || "",
      product.employeeEmail || "",
      product.department || "",
      product.assignmentDate
        ? new Date(product.assignmentDate).toLocaleDateString()
        : "",
      product.returnDate
        ? new Date(product.returnDate).toLocaleDateString()
        : "",
      product.purchaseDate
        ? new Date(product.purchaseDate).toLocaleDateString()
        : "",
      product.warrantyExpiry
        ? new Date(product.warrantyExpiry).toLocaleDateString()
        : "",
      product.location || "",
      product.price?.toString() || "0",
      product.description || "",
      product.notes || "",
      product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "",
    ]);

    const excelContent = [
      headers.join("\t"),
      ...rows.map((row) => row.join("\t")),
    ].join("\n");

    const blob = new Blob([excelContent], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Excel export error:", error);
    throw new Error("Failed to export Excel");
  }
};

export const exportToPDF = (data: any[]) => {
  return new Promise((resolve, reject) => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>IT Assets Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            h1 { color: #333; text-align: center; margin-bottom: 20px; }
            .summary { 
              background-color: #f8f9fa; 
              padding: 15px; 
              border-radius: 5px; 
              margin-bottom: 20px;
              border-left: 4px solid #007bff;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px;
              font-size: 11px;
            }
            th { 
              background-color: #e9ecef; 
              padding: 8px; 
              text-align: left; 
              border: 1px solid #dee2e6;
              font-weight: bold;
            }
            td { 
              padding: 6px; 
              border: 1px solid #dee2e6; 
              text-align: left;
            }
            tr:nth-child(even) { background-color: #f8f9fa; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <h1>IT Assets Report</h1>
          <div class="summary">
            <p><strong>Total Assets:</strong> ${data.length.toLocaleString()}</p>
            <p><strong>Total Value:</strong> $${data
              .reduce((sum, item) => sum + (item.price || 0), 0)
              .toLocaleString()}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Asset Name</th>
                <th>Type</th>
                <th>Serial Number</th>
                <th>Brand</th>
                <th>Status</th>
                <th>Condition</th>
                <th>Employee</th>
                <th>Department</th>
                <th class="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (product, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${product.name || ""}</td>
                  <td>${product.assetType || ""}</td>
                  <td>${product.serialNumber || ""}</td>
                  <td>${product.brand || ""}</td>
                  <td>${product.status || ""}</td>
                  <td>${product.condition || ""}</td>
                  <td>${product.employeeName || "Unassigned"}</td>
                  <td>${product.department || ""}</td>
                  <td class="text-right">$${(
                    product.price || 0
                  ).toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        reject(
          new Error("Popup blocked. Please allow popups for PDF generation.")
        );
        return;
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
            resolve(true);
          }, 1000);
        }, 500);
      };

      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.print();
          setTimeout(() => {
            if (!printWindow.closed) {
              printWindow.close();
            }
            resolve(true);
          }, 1000);
        }
      }, 2000);
    } catch (error) {
      console.error("PDF export error:", error);
      reject(new Error("Failed to generate PDF"));
    }
  });
};
