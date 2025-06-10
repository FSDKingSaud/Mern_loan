export const handlePrint = (printTitle, ref) => {
    const content = ref.current; // Get the printable area

    // Create a new window and print only the specific content
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${printTitle}</title>
          
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };