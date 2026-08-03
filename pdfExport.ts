import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RecapData, RecapDataM2 } from '../types/recap';
import { formatMontant } from '../hooks/useRecapDQE';

export function generatePDF(data: RecapData | RecapDataM2, mode: 'dqe' | 'm2'): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Top header banner
  doc.setFillColor(108, 94, 207);
  doc.rect(0, 0, 210, 28, 'F');

  // Cabinet Name & Details
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(data.cabinet.nom || 'Cabinet Architecture', 14, 11);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const contactText = [data.cabinet.email, data.cabinet.telephone, data.cabinet.adresse].filter(Boolean).join(' • ');
  doc.text(contactText, 14, 18);

  // Document Title
  const docTitle = mode === 'dqe' ? 'DEVIS QUANTITATIF ESTIMATIF' : 'DEVIS AU M² PAR PIÈCE';
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(docTitle, 196, 12, { align: 'right' });

  const dateStr = `Généré le ${new Date().toLocaleDateString('fr-FR')}`;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(dateStr, 196, 18, { align: 'right' });

  // Add Logo if present
  if (data.cabinet.logoUrl) {
    try {
      doc.addImage(data.cabinet.logoUrl, 'PNG', 14, 20, 12, 12);
    } catch {
      // Ignore if image format not parseable
    }
  }

  // Project Info Box
  let startY = 34;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(14, startY, 182, 22, 2, 2, 'FD');

  doc.setTextColor(113, 113, 122);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJET :', 18, startY + 6);
  doc.text('CLIENT :', 110, startY + 6);
  doc.text('LOCALISATION :', 18, startY + 16);
  doc.text('ÉTABLI PAR :', 110, startY + 16);

  doc.setTextColor(24, 24, 27);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(data.project.nom || 'Projet', 42, startY + 6);
  doc.text(data.project.client || 'Client', 132, startY + 6);
  doc.text(data.project.localisation || 'Abidjan', 42, startY + 16);
  doc.text(data.project.etabliPar || 'Architecte', 132, startY + 16);

  startY += 28;

  // Table preparation
  let tableHeaders: string[] = [];
  let tableBody: any[] = [];

  if (mode === 'dqe') {
    const recapDQE = data as RecapData;
    tableHeaders = ['N°', 'Désignation', 'Unité', 'Qté', 'PU (FCFA)', 'Montant (FCFA)'];

    for (const lot of recapDQE.lots) {
      // Lot header
      tableBody.push([
        {
          content: `LOT ${lot.numero} — ${lot.name.toUpperCase()}`,
          colSpan: 6,
          styles: { fillColor: [108, 94, 207], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' }
        },
      ]);

      for (const item of lot.items) {
        if (item.isSubLot) {
          tableBody.push([
            item.numero || '',
            { content: item.designation, styles: { fontStyle: 'bold' } },
            '',
            '',
            '',
            item.montant ? `${formatMontant(item.montant)}` : '',
          ]);

          if (item.children) {
            for (const child of item.children) {
              tableBody.push([
                child.numero || '',
                `   ${child.designation}`,
                child.unite || '',
                child.quantite !== null && child.quantite !== undefined ? String(child.quantite) : '',
                child.prixUnitaire ? formatMontant(child.prixUnitaire) : '—',
                child.montant ? formatMontant(child.montant) : '—',
              ]);
            }
          }
        } else {
          tableBody.push([
            item.numero || '',
            item.designation,
            item.unite || '',
            item.quantite !== null && item.quantite !== undefined ? String(item.quantite) : '',
            item.prixUnitaire ? formatMontant(item.prixUnitaire) : '—',
            item.montant ? formatMontant(item.montant) : '—',
          ]);
        }
      }

      // Lot subtotal
      tableBody.push([
        {
          content: `Sous-total LOT ${lot.numero}`,
          colSpan: 5,
          styles: { halign: 'right', fontStyle: 'bold', fillColor: [244, 244, 245] }
        },
        {
          content: `${formatMontant(lot.sousTotal)} FCFA`,
          styles: { halign: 'right', fontStyle: 'bold', textColor: [108, 94, 207], fillColor: [244, 244, 245] }
        }
      ]);
    }
  } else {
    const recapM2 = data as RecapDataM2;
    tableHeaders = ['N°', 'Pièce', 'Niveau', 'Surface (m²)', 'Prix / m² (FCFA)', 'Montant (FCFA)'];

    recapM2.pieces.forEach((piece, idx) => {
      tableBody.push([
        idx + 1,
        piece.nom,
        piece.niveau,
        `${piece.surface_m2} m²`,
        piece.prixAuM2 ? `${formatMontant(piece.prixAuM2)} FCFA` : 'Non chiffré',
        piece.montant ? `${formatMontant(piece.montant)} FCFA` : '—',
      ]);
    });
  }

  // Totals rows
  tableBody.push([
    {
      content: 'TOTAL HT',
      colSpan: 5,
      styles: { halign: 'right', fontStyle: 'bold', fillColor: [108, 94, 207], textColor: [255, 255, 255] }
    },
    {
      content: `${formatMontant(data.totalHT)} FCFA`,
      styles: { halign: 'right', fontStyle: 'bold', fillColor: [108, 94, 207], textColor: [255, 255, 255] }
    }
  ]);

  tableBody.push([
    {
      content: `TVA (${data.tvaRate}%)`,
      colSpan: 5,
      styles: { halign: 'right', fontStyle: 'bold', fillColor: [244, 244, 245], textColor: [24, 24, 27] }
    },
    {
      content: `${formatMontant(data.tva)} FCFA`,
      styles: { halign: 'right', fontStyle: 'bold', fillColor: [244, 244, 245], textColor: [24, 24, 27] }
    }
  ]);

  tableBody.push([
    {
      content: 'TOTAL TTC',
      colSpan: 5,
      styles: { halign: 'right', fontStyle: 'bold', fillColor: [24, 24, 27], textColor: [255, 255, 255] }
    },
    {
      content: `${formatMontant(data.totalTTC)} FCFA`,
      styles: { halign: 'right', fontStyle: 'bold', fillColor: [24, 24, 27], textColor: [108, 94, 207] }
    }
  ]);

  autoTable(doc, {
    startY,
    head: [tableHeaders],
    body: tableBody,
    margin: { left: 14, right: 14, bottom: 20 },
    theme: 'grid',
    headStyles: {
      fillColor: [250, 250, 250],
      textColor: [113, 113, 122],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 8,
      textColor: [24, 24, 27],
      cellPadding: 2.5,
    },
    columnStyles: mode === 'dqe' ? {
      0: { cellWidth: 12, halign: 'left' },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 16, halign: 'right' },
      4: { cellWidth: 28, halign: 'right' },
      5: { cellWidth: 32, halign: 'right' },
    } : {
      0: { cellWidth: 12, halign: 'left' },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 25, halign: 'left' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 32, halign: 'right' },
      5: { cellWidth: 35, halign: 'right' },
    },
    didDrawPage: (dataArg) => {
      const totalPages = (doc as any).internal.getNumberOfPages();
      const currentPage = dataArg.pageNumber;
      doc.setFontSize(7);
      doc.setTextColor(113, 113, 122);
      doc.text(
        `Document généré par Métrio — metrio.app  |  Page ${currentPage} sur ${totalPages}`,
        105,
        287,
        { align: 'center' }
      );
    },
  });

  const safeProjectName = (data.project.nom || 'Projet').replace(/[\s/\\?%*:|"<>]+/g, '_');
  doc.save(`Devis_${safeProjectName}.pdf`);
}
