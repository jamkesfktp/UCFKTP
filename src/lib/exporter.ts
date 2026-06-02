import * as XLSX from 'xlsx';
import type { SavedSurvey } from './db';

export const exportToExcel = (surveys: SavedSurvey[]) => {
  if (!surveys || surveys.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  const flatData = surveys.map(s => {
    const identitas = s.formData?.identitas || {};
    const res = s.results || {};
    const kualitatif = s.formData?.kualitatif || [];

    // Construct a flat object for a single Excel row
    const row: any = {
      "Nama Faskes": s.name,
      "Jenis Faskes": identitas.jenisFaskes || '-',
      "Peserta JKN": identitas.pesertaJkn || 0,
      "Terakhir Diperbarui": new Date(s.updatedAt).toLocaleString('id-ID'),

      // Hasil Costing JKN
      "Total Beban JKN (Rp)": res.totalBiaya || 0,
      "Biaya SDM (Rp)": res.biayaSdm || 0,
      "Biaya Obat (Rp)": res.biayaObat || 0,
      "Biaya Alkes (Rp)": res.biayaAlkes || 0,
      "Biaya Non-Medis (Rp)": res.biayaNonMedis || 0,
      "Biaya Overhead (Rp)": res.biayaOverhead || 0,
      "Biaya JKN Perkapita": res.biayaPerkapita || 0,
      "UC Kapitasi (Rp)": res.ucKapitasi || 0,
      "UC Total (Rp)": res.ucTotal || 0,

      // Hasil Non-JKN & RI
      "Total Beban Non-JKN (Rp)": res.totalBiayaNonJkn || 0,
      "UC Non-Kapitasi (Rp)": res.ucNonKapitasi || 0,
      "Total Beban Rawat Inap (Rp)": res.totalBiayaRawatInap || 0,
      "UC Rawat Inap (Rp)": res.ucRawatInap || 0,
    };

    // Flatten Qualitative Answers dynamically
    if (Array.isArray(kualitatif)) {
      kualitatif.forEach((q: any, i: number) => {
        const questionKey = `Kualitatif ${i + 1}`;
        row[questionKey] = q.answer || '';
      });
    }

    return row;
  });

  // Create a new workbook and add the worksheet
  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekapitulasi FKTP");

  // Format headers to be bold
  const headerKeys = Object.keys(flatData[0] || {});
  headerKeys.forEach((_key, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = { font: { bold: true } };
    }
  });

  // Export the file
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Rekapitulasi_Costing_FKTP_${dateStr}.xlsx`);
};
