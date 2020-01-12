const fs = require("fs");
const PDFDocument=require('pdfkit');
const path=require('path');

module.exports={
    generar: (tienda, cliente, productos,fecha)=>{

    let doc = new PDFDocument({ margin: 50 });

    generateHeader(doc, tienda);
    generateCustomerInformation(doc, cliente, fecha);
    generateTableRow(doc, 270,'Código Barras', 'Descripción', 'Cantidad', 'Precio', 'Subtotal');
    generateInvoiceTable(doc, productos);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path.join(__dirname, '../facturas/'+cliente.numero_factura+'.pdf')));
    }
}

    
function generateHeader(doc, tienda) {
    doc
      .image(path.join(__dirname,"../img/logo.png"), 50, 45, { width: 50 })
      .fillColor("#000000")
      .fontSize(20)
      .text(tienda.nombre, 110, 57)
      .fontSize(10)
      .text(tienda.nombre_fiscal+` [${tienda.cif_dni}]`, 200, 50, { align: "right" })
      .text(tienda.primera_direccion, 200, 65, { align: "right" })
      .text(tienda.segunda_direccion, 200, 80, { align: "right" })
      .moveDown();

  }
  
  function generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        "Payment is due within 15 days. Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
      );
  }

  function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
    doc
      .fontSize(10)
      .fillColor('#000000')
      .text(c1, 50, y)
      .text(c2, 150, y)
      .text(c3, 280, y, { width: 90 })
      .text(c4, 370, y, { width: 90})
      .text(c5, 460, y, { width: 90});
  }
  function generateInvoiceTable(doc, productos) {
    let i,
      invoiceTableTop = 270;
    generateHr(doc,invoiceTableTop+20)
    for (i = 0; i < productos.length; i++) {
      const item = productos[i];
      const position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        item.barcode,
        item.title,
        item.unidades,
        item.precio+'€',
        (item.precio*item.unidades)+'€'
      );
      generateHr(doc, position + 20);

    }
    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        subtotal+"€",
    );
  }
  function generateHr(doc, y) {
    doc
      .strokeColor("#000000")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
  function generateCustomerInformation(doc, cliente, fecha) {
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Factura", 50, 120);
  
    generateHr(doc, 145);
  
    const customerInformationTop = 160;
  
    doc
      .fontSize(10)
      .text("Número Factura:", 50, customerInformationTop)
      .font("Helvetica-Bold")
      .text(cliente.numero_factura, 150, customerInformationTop)
      .font("Helvetica")
      .text("Fecha facturación: ", 50, customerInformationTop + 15)
      .text(fecha, 150, customerInformationTop + 15)
      .text("Saldo pendiente:", 50, customerInformationTop + 30)
      .text(
        cliente.saldo_pendiente+'€',
        150,
        customerInformationTop + 30
      )
  
      .font("Helvetica-Bold")
      .text(`${cliente.nombre} [${cliente.dni_cif}]`, 300, customerInformationTop)
      .font("Helvetica")
      .text(cliente.primera_direccion, 300, customerInformationTop + 15)
      .text(cliente.segunda_direccion,300,customerInformationTop + 30)
      .moveDown();
  
    generateHr(doc, customerInformationTop+52);
  }