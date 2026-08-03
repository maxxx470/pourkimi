import * as XLSX from 'xlsx';
import { RecapData, RecapDataM2 } from '../types/recap';

export function generateExcel(data: RecapData | RecapDataM2, mode: 'dqe' | 'm2'): void {
  const rows: (string | number)[][] = [];

  // Cabinet Header
  rows.push([data.cabinet.nom || 'Cabinet Architecture']);
  rows.push([
    [data.cabinet.email, data.cabinet.telephone, data.cabinet.adresse]
      .filter(Boolean)
      .join(' | '),
  ]);
  rows.push([]);

  // Title
  const docTitle = mode === 'dqe' ? 'DEVIS QUANTITATIF ESTIMATIF' : 'DEVIS AU M² PAR PIÈCE';
  rows.push([docTitle]);
  rows.push(['Date:', new Date().toLocaleDateString('fr-FR')]);
  rows.push([]);

  // Project Info
  rows.push(['Projet:', data.project.nom || '', '', 'Client:', data.project.client || '']);
  rows.push(['Localisation:', data.project.localisation || '', '', 'Établi par:', data.project.etabliPar || '']);
  rows.push([]);

  if (mode === 'dqe') {
    const recapDQE = data as RecapData;
    rows.push(['N°', 'Désignation', 'Unité', 'Quantité', 'Prix Unitaire (FCFA)', 'Montant HT (FCFA)']);

    for (const lot of recapDQE.lots) {
      rows.push(['', `LOT ${lot.numero} — ${lot.name.toUpperCase()}`, '', '', '', '']);

      for (const item of lot.items) {
        if (item.isSubLot) {
          rows.push([item.numero || '', item.designation, '', '', '', item.montant ?? '']);
          if (item.children) {
            for (const child of item.children) {
              rows.push([
                child.numero || '',
                `   ${child.designation}`,
                child.unite || '',
                child.quantite ?? '',
                child.prixUnitaire ?? '',
                child.montant ?? '',
              ]);
            }
          }
        } else {
          rows.push([
            item.numero || '',
            item.designation,
            item.unite || '',
            item.quantite ?? '',
            item.prixUnitaire ?? '',
            item.montant ?? '',
          ]);
        }
      }

      rows.push(['', `Sous-total LOT ${lot.numero}`, '', '', '', lot.sousTotal]);
    }
  } else {
    const recapM2 = data as RecapDataM2;
    rows.push(['N°', 'Pièce', 'Niveau', 'Surface (m²)', 'Prix / m² (FCFA)', 'Montant HT (FCFA)']);

    recapM2.pieces.forEach((piece, idx) => {
      rows.push([
        idx + 1,
        piece.nom,
        piece.niveau,
        piece.surface_m2,
        piece.prixAuM2 ?? 'Non chiffré',
        piece.montant ?? 0,
      ]);
    });
  }

  rows.push([]);
  rows.push(['', '', '', '', 'TOTAL HT (FCFA)', data.totalHT]);
  rows.push(['', '', '', '', `TVA (${data.tvaRate}%)`, data.tva]);
  rows.push(['', '', '', '', 'TOTAL TTC (FCFA)', data.totalTTC]);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 45 },
    { wch: 12 },
    { wch: 14 },
    { wch: 22 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Devis');

  const safeProjectName = (data.project.nom || 'Projet').replace(/[\s/\\?%*:|"<>]+/g, '_');
  XLSX.writeFile(workbook, `Devis_${safeProjectName}.xlsx`);
}
