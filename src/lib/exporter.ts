import * as XLSX from 'xlsx';
import type { SavedSurvey } from './db';

export const exportToExcel = (surveys: SavedSurvey[]) => {
  if (!surveys || surveys.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  const flatData = surveys.map(s => {
    const id = s.formData?.identitas || {};
    const res = s.results || {};
    const qual = s.formData?.kualitatif || [];

    const jknTotal = 
      (Number(id.jkn_ri)||0) + (Number(id.jkn_umum)||0) + (Number(id.jkn_lansia)||0) + 
      (Number(id.jkn_kia)||0) + (Number(id.jkn_gigi)||0) + (Number(id.jkn_psiko)||0) + 
      (Number(id.jkn_gizi)||0) + (Number(id.jkn_igd)||0) + (Number(id.jkn_kb)||0) + 
      (Number(id.jkn_persalin)||0) + (Number(id.jkn_lab)||0) + (Number(id.jkn_anc_usg)||0) + 
      (Number(id.jkn_ukm)||0) + (Number(id.jkn_lain)||0);

    const nonjknTotal = 
      (Number(id.nonjkn_ri)||0) + (Number(id.nonjkn_umum)||0) + (Number(id.nonjkn_lansia)||0) + 
      (Number(id.nonjkn_kia)||0) + (Number(id.nonjkn_gigi)||0) + (Number(id.nonjkn_psiko)||0) + 
      (Number(id.nonjkn_gizi)||0) + (Number(id.nonjkn_igd)||0) + (Number(id.nonjkn_kb)||0) + 
      (Number(id.nonjkn_persalin)||0) + (Number(id.nonjkn_lab)||0) + (Number(id.nonjkn_anc_usg)||0) + 
      (Number(id.nonjkn_ukm)||0) + (Number(id.nonjkn_lain)||0);

    const totalKunjungan = jknTotal + nonjknTotal;

    const getSdmCount = (jenis: string) => {
        return (s.formData?.sdm || []).filter((p: any) => p.jenisTenaga === jenis).length;
    };

    return {
      "tahun": new Date(s.updatedAt).getFullYear(),
      "provinsi": id.provinsi || '',
      "kabkota": id.kabkota || '',
      "kd_faskes": id.kdFaskes || '',
      "nama_fktp": id.namaFktp || '',
      "jenis_faskes": id.jenisFaskes || '',
      "karakter_wil": id.karakterWil || '',
      "status_akre": id.statusAkre || '',
      "thn_akre": id.thnAkre || '',
      "cp_nama": id.cpNama || '',
      "cp_telp": id.cpTelp || '',
      "cp_jabatan": id.cpJabatan || '',
      "jam_layanan": id.jamLayanan || 0,
      "menit_layanan": id.menitLayanan || 0,
      "hari_buka": id.hariBuka || 0,
      "lab_sendiri": id.labSendiri || '',
      "jml_tt": id.jmlTt || 0,
      "peserta_jkn": id.pesertaJkn || 0,
      "pend_kap_jkn": id.pendKapJkn || 0,
      "pend_nonkap_jkn": id.pendNonkapJkn || 0,
      "pend_total_jkn": (Number(id.pendKapJkn)||0) + (Number(id.pendNonkapJkn)||0),
      
      "jkn_ri": id.jkn_ri || 0,
      "jkn_umum": id.jkn_umum || 0,
      "jkn_lansia": id.jkn_lansia || 0,
      "jkn_kia": id.jkn_kia || 0,
      "jkn_gigi": id.jkn_gigi || 0,
      "jkn_psiko": id.jkn_psiko || 0,
      "jkn_gizi": id.jkn_gizi || 0,
      "jkn_igd": id.jkn_igd || 0,
      "jkn_kb": id.jkn_kb || 0,
      "jkn_persalin": id.jkn_persalin || 0,
      "jkn_lab": id.jkn_lab || 0,
      "jkn_anc_usg": id.jkn_anc_usg || 0,
      "jkn_ukm": id.jkn_ukm || 0,
      "jkn_lain": id.jkn_lain || 0,
      "jkn_total": jknTotal,

      "nonjkn_ri": id.nonjkn_ri || 0,
      "nonjkn_umum": id.nonjkn_umum || 0,
      "nonjkn_lansia": id.nonjkn_lansia || 0,
      "nonjkn_kia": id.nonjkn_kia || 0,
      "nonjkn_gigi": id.nonjkn_gigi || 0,
      "nonjkn_psiko": id.nonjkn_psiko || 0,
      "nonjkn_gizi": id.nonjkn_gizi || 0,
      "nonjkn_igd": id.nonjkn_igd || 0,
      "nonjkn_kb": id.nonjkn_kb || 0,
      "nonjkn_persalin": id.nonjkn_persalin || 0,
      "nonjkn_lab": id.nonjkn_lab || 0,
      "nonjkn_anc_usg": id.nonjkn_anc_usg || 0,
      "nonjkn_ukm": id.nonjkn_ukm || 0,
      "nonjkn_lain": id.nonjkn_lain || 0,
      "nonjkn_total": nonjknTotal,

      "total_ri": (Number(id.jkn_ri)||0) + (Number(id.nonjkn_ri)||0),
      "total_umum": (Number(id.jkn_umum)||0) + (Number(id.nonjkn_umum)||0),
      "total_lansia": (Number(id.jkn_lansia)||0) + (Number(id.nonjkn_lansia)||0),
      "total_kia": (Number(id.jkn_kia)||0) + (Number(id.nonjkn_kia)||0),
      "total_gigi": (Number(id.jkn_gigi)||0) + (Number(id.nonjkn_gigi)||0),
      "total_psiko": (Number(id.jkn_psiko)||0) + (Number(id.nonjkn_psiko)||0),
      "total_gizi": (Number(id.jkn_gizi)||0) + (Number(id.nonjkn_gizi)||0),
      "total_igd": (Number(id.jkn_igd)||0) + (Number(id.nonjkn_igd)||0),
      "total_kb": (Number(id.jkn_kb)||0) + (Number(id.nonjkn_kb)||0),
      "total_persalin": (Number(id.jkn_persalin)||0) + (Number(id.nonjkn_persalin)||0),
      "total_lab": (Number(id.jkn_lab)||0) + (Number(id.nonjkn_lab)||0),
      "total_anc_usg": (Number(id.jkn_anc_usg)||0) + (Number(id.nonjkn_anc_usg)||0),
      "total_ukm": (Number(id.jkn_ukm)||0) + (Number(id.nonjkn_ukm)||0),
      "total_lain": (Number(id.jkn_lain)||0) + (Number(id.nonjkn_lain)||0),
      "total_kunj": totalKunjungan,

      "sdm_dokter": getSdmCount("Dokter Umum"),
      "sdm_drg": getSdmCount("Dokter Gigi"),
      "sdm_bidan": getSdmCount("Bidan"),
      "sdm_perawat": getSdmCount("Perawat"),
      "sdm_perawatg": getSdmCount("Perawat Gigi"),
      "sdm_psikolog": getSdmCount("Psikolog Klinis"),
      "sdm_atlm": getSdmCount("Ahli Teknologi Lab Medik (ATLM)"),
      "sdm_farmasi": getSdmCount("Tenaga Kefarmasian"),
      "sdm_gizi": getSdmCount("Nutrisionis"),
      "sdm_fisio": getSdmCount("Tenaga Keterapian Fisik"),
      "sdm_lain": getSdmCount("SDM Kesehatan Lainnya"),
      "nonsdm": getSdmCount("Non SDM Kesehatan"),
      "sdm_spkklp": getSdmCount("Spesialis KKLP"),
      "sdm_total": s.formData?.sdm?.length || 0,

      "gaji_dokter": id.gaji_dokter || 0,
      "gaji_drg": id.gaji_dokter_gigi || 0,
      "gaji_bidan": id.gaji_bidan || 0,
      "gaji_perawat": id.gaji_perawat || 0,
      "gaji_perawatg": id.gaji_perawat_gigi || 0,
      "gaji_psikolog": id.gaji_psikolog || 0,
      "gaji_atlm": id.gaji_atlm || 0,
      "gaji_farmasi": id.gaji_farmasi || 0,
      "gaji_gizi": id.gaji_nutrisionis || 0,
      "gaji_fisio": id.gaji_keterapian || 0,
      "gaji_lain": id.gaji_sdm_lain || 0,
      "gaji_nonsdm": id.gaji_non_sdm || 0,
      "gaji_spkklp": id.gaji_sp_kklp || 0,
      
      "biaya_sdm_kap": res.biayaSdm || 0,
      "biaya_sdm_nonkap": res.biayaSdmNonJkn || 0,
      "biaya_sdm_admin": 0, // Placeholder, usually merged in above

      "quali1": qual[0]?.answer || '',
      "quali2": qual[1]?.answer || '',
      "quali3": qual[2]?.answer || '',
      
      "biaya_sdm": res.biayaSdm || 0,
      "biaya_obat": res.biayaObat || 0,
      "biaya_alkes": res.biayaAlkes || 0,
      "biaya_nonmed": res.biayaNonMedis || 0,
      "biaya_oh": res.biayaOverhead || 0,
      "biaya_total": res.totalBiaya || 0,
      "biaya_perkap": res.biayaPerkapita || 0,
      "kunj_kap": jknTotal,
      "uc_total_kunj": res.ucTotal || 0,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Rekapitulasi FKTP");

  const headerKeys = Object.keys(flatData[0] || {});
  headerKeys.forEach((_key, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = { font: { bold: true } };
    }
  });

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Rekapitulasi_Costing_FKTP_${dateStr}.xlsx`);
};
