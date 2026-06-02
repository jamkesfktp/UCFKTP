// Lookup tables extracted from Kalkulasi (hide)
const RATES: any = {
  "Puskesmas Non Rawat Inap<= 5.000 peserta": { "sdm": 0.4907215, "obat": 0.130861, "alkes": 0.1330751, "nonmedis": 0.0744423 },
  "Puskesmas Non Rawat Inap5.001 - 25.000 peserta": { "sdm": 0.4907215, "obat": 0.130861, "alkes": 0.1330751, "nonmedis": 0.0744423 },
  "Puskesmas Non Rawat Inap> 25.000 peserta": { "sdm": 0.5104881, "obat": 0.1210266, "alkes": 0.1241078, "nonmedis": 0.0734776 },
  "Puskesmas Rawat Inap<= 5.000 peserta": { "sdm": 0.5354425, "obat": 0.1107279, "alkes": 0.1251553, "nonmedis": 0.0596743 },
  "Puskesmas Rawat Inap5.001 - 25.000 peserta": { "sdm": 0.5323811, "obat": 0.1130736, "alkes": 0.1118784, "nonmedis": 0.0736668 },
  "Puskesmas Rawat Inap> 25.000 peserta": { "sdm": 0.5157368, "obat": 0.1347329, "alkes": 0.1190711, "nonmedis": 0.0614592 },
  "Klinik Pratama Non Rawat Inap<= 5.000 peserta": { "sdm": 0.4304134, "obat": 0.1357955, "alkes": 0.1362111, "nonmedis": 0.07798 },
  "Klinik Pratama Non Rawat Inap5.001 - 25.000 peserta": { "sdm": 0.44034, "obat": 0.1346876, "alkes": 0.1284958, "nonmedis": 0.0768766 },
  "Klinik Pratama Non Rawat Inap> 25.000 peserta": { "sdm": 0.4496526, "obat": 0.1189255, "alkes": 0.1227188, "nonmedis": 0.0891031 },
  "Klinik Pratama Rawat Inap<= 5.000 peserta": { "sdm": 0.3969939, "obat": 0.1726183, "alkes": 0.1523801, "nonmedis": 0.0899077 },
  "Klinik Pratama Rawat Inap5.001 - 25.000 peserta": { "sdm": 0.4562939, "obat": 0.1271229, "alkes": 0.120745, "nonmedis": 0.1077383 },
  "Klinik Pratama Rawat Inap> 25.000 peserta": { "sdm": 0.4562939, "obat": 0.1271229, "alkes": 0.120745, "nonmedis": 0.1077383 },
  "Dokter Praktek Perorangan Non Rawat Inap<= 5.000 peserta": { "sdm": 0.4304134, "obat": 0.1357955, "alkes": 0.1362111, "nonmedis": 0.07798 },
  "Dokter Praktek Perorangan Non Rawat Inap5.001 - 25.000 peserta": { "sdm": 0.44034, "obat": 0.1346876, "alkes": 0.1284958, "nonmedis": 0.0768766 },
  "Dokter Praktek Perorangan Non Rawat Inap> 25.000 peserta": { "sdm": 0.4496526, "obat": 0.1189255, "alkes": 0.1227188, "nonmedis": 0.0891031 },
  "Dokter Praktek Perorangan Rawat Inap<= 5.000 peserta": { "sdm": 0.3969939, "obat": 0.1726183, "alkes": 0.1523801, "nonmedis": 0.0899077 },
  "Dokter Praktek Perorangan Rawat Inap5.001 - 25.000 peserta": { "sdm": 0.4562939, "obat": 0.1271229, "alkes": 0.120745, "nonmedis": 0.1077383 },
  "Dokter Praktek Perorangan Rawat Inap> 25.000 peserta": { "sdm": 0.4562939, "obat": 0.1271229, "alkes": 0.120745, "nonmedis": 0.1077383 }
};

const OVERHEAD_RATES: any = {
  "Dokter Praktek Perorangan Non Rawat Inap": 0.09799293946919053,
  "Dokter Praktek Perorangan Rawat Inap": 0.09799293946919053,
  "Dokter Gigi Praktik Mandiri": 0.2775479194250365,
  "Klinik Pratama Non Rawat Inap": 0.21959029824699036,
  "Klinik Pratama Rawat Inap": 0.18810105555049933,
  "Puskesmas Non Rawat Inap": 0.17091448927575267,
  "Puskesmas Rawat Inap": 0.16897155447002474
};

export const initialData = {
  identitas: {},
  sdm: [
    { id: '1', jenisTenaga: 'Dokter Umum', totalJam: '', umum: '' },
    { id: '2', jenisTenaga: 'Bidan', totalJam: '', kia: '', persalinan: '' },
    { id: '3', jenisTenaga: 'Perawat', totalJam: '', igd: '' },
    { id: '4', jenisTenaga: 'Tenaga Kefarmasian', totalJam: '', farmasi: '' },
    { id: '5', jenisTenaga: 'Non SDM Kesehatan', totalJam: '', umum: '' }
  ],
  kualitatif: [
    { id: 'q1', question: '1. Apakah faskes ini berencana menambah layanan tenaga spesifik (Psikolog Klinis, Fisioterapis, atau Dokter Sp.KKLP) dalam waktu dekat?', answer: '', suggestions: ['Ya, kami sedang menyiapkan ruangan dan sarana.', 'Ya, rencana ada tapi terkendala budget/anggaran untuk SDM tersebut.', 'Tidak ada rencana penambahan layanan tersebut saat ini.'] },
    { id: 'q2', question: '2. Berapa rata-rata nominal pengeluaran bulanan obat dan alkes berdasarkan laporan LPLPO?', answer: '', suggestions: ['Kurang dari Rp 10.000.000 / bulan', 'Sekitar Rp 10.000.000 - Rp 25.000.000 / bulan', 'Data LPLPO tidak tersedia atau tidak diizinkan untuk dibuka'] },
    { id: 'q3', question: '3. Bagaimana status implementasi Rekam Medis Elektronik (RME) di faskes ini?', answer: '', suggestions: ['Sudah 100% menggunakan RME terintegrasi SATUSEHAT.', 'Masih masa transisi (Hybrid kertas dan elektronik).', 'Masih 100% menggunakan pencatatan kertas.'] }
  ]
};

export function calculateCosting(identitas: any, sdm: any[], _kualitatif: any) {
  let biayaSdm = 0;

  // 1. Group SDM by profession to find counts
  const profesiCounts: any = {};
  sdm.forEach(p => {
    profesiCounts[p.jenisTenaga] = (profesiCounts[p.jenisTenaga] || 0) + 1;
  });

  // 2. Map total salaries
  const totalSalaries: any = {
    'Dokter Umum': Number(identitas.gaji_dokter) || 0,
    'Dokter Gigi': Number(identitas.gaji_dokter_gigi) || 0,
    'Bidan': Number(identitas.gaji_bidan) || 0,
    'Perawat': Number(identitas.gaji_perawat) || 0,
    'Perawat Gigi': Number(identitas.gaji_perawat_gigi) || 0,
    'Psikolog Klinis': Number(identitas.gaji_psikolog) || 0,
    'Ahli Teknologi Lab Medik (ATLM)': Number(identitas.gaji_atlm) || 0,
    'Tenaga Kefarmasian': Number(identitas.gaji_farmasi) || 0,
    'Nutrisionis': Number(identitas.gaji_nutrisionis) || 0,
    'Tenaga Keterapian Fisik': Number(identitas.gaji_keterapian) || 0,
    'SDM Kesehatan Lainnya': Number(identitas.gaji_sdm_lain) || 0,
    'Non SDM Kesehatan': Number(identitas.gaji_non_sdm) || 0,
    'Spesialis KKLP': Number(identitas.gaji_sp_kklp) || 0,
  };

  // 3. Calculate Biaya SDM based on FTE
  
  // First, calculate the pro-rata multiplier for Admin (Total Kunjungan JKN / Total Kunjungan Keseluruhan)
  const kunjunganJkn = 
    (Number(identitas.jkn_ri) || 0) + (Number(identitas.jkn_umum) || 0) + (Number(identitas.jkn_lansia) || 0) + 
    (Number(identitas.jkn_kia) || 0) + (Number(identitas.jkn_gigi) || 0) + (Number(identitas.jkn_psiko) || 0) + 
    (Number(identitas.jkn_gizi) || 0) + (Number(identitas.jkn_igd) || 0) + (Number(identitas.jkn_kb) || 0) + 
    (Number(identitas.jkn_persalin) || 0) + (Number(identitas.jkn_lab) || 0) + (Number(identitas.jkn_anc_usg) || 0) + 
    (Number(identitas.jkn_ukm) || 0) + (Number(identitas.jkn_lain) || 0);
    
  const kunjunganNonJkn = 
    (Number(identitas.nonjkn_ri) || 0) + (Number(identitas.nonjkn_umum) || 0) + (Number(identitas.nonjkn_lansia) || 0) + 
    (Number(identitas.nonjkn_kia) || 0) + (Number(identitas.nonjkn_gigi) || 0) + (Number(identitas.nonjkn_psiko) || 0) + 
    (Number(identitas.nonjkn_gizi) || 0) + (Number(identitas.nonjkn_igd) || 0) + (Number(identitas.nonjkn_kb) || 0) + 
    (Number(identitas.nonjkn_persalin) || 0) + (Number(identitas.nonjkn_lab) || 0) + (Number(identitas.nonjkn_anc_usg) || 0) + 
    (Number(identitas.nonjkn_ukm) || 0) + (Number(identitas.nonjkn_lain) || 0);

  const totalKunjungan = kunjunganJkn + kunjunganNonJkn;
  let proRataAdmin = totalKunjungan > 0 ? (kunjunganJkn / totalKunjungan) : 0;
  let proRataAdminNonJkn = totalKunjungan > 0 ? (kunjunganNonJkn / totalKunjungan) : 0;

  // Kapitasi Adjustment eksklusi non-JKN (Khusus Puskesmas) dikali 62%
  if (String(identitas.jenisFaskes).toLowerCase().includes('puskesmas')) {
    proRataAdmin = 0.62;
    proRataAdminNonJkn = 0.38;
  }

  let biayaSdmNonJkn = 0;

  sdm.forEach(pegawai => {
    // FTE Kapitasi (Layanan JKN murni)
    const jamKapitasi = 
      (Number(pegawai.umum) || 0) + 
      (Number(pegawai.lansia) || 0) + 
      (Number(pegawai.gigi) || 0) + 
      (Number(pegawai.psiko) || 0) + 
      (Number(pegawai.gizi) || 0) + 
      (Number(pegawai.igd) || 0);

    const jamNonKapitasi = 
      (Number(pegawai.kia) || 0) + 
      (Number(pegawai.kb) || 0) + 
      (Number(pegawai.persalin) || 0) + 
      (Number(pegawai.ukm) || 0) + 
      (Number(pegawai.lain) || 0);

    // FTE Admin/UKM (Farmasi/Lab/Admin) - diproratakan
    const jamAdmin = (Number(pegawai.farmasi) || 0);

    const totalJam = Number(pegawai.totalJam) || 40;
    const fteKapitasi = Math.min(jamKapitasi / totalJam, 1);
    const fteNonKapitasi = Math.min(jamNonKapitasi / totalJam, 1);
    const fteAdmin = Math.min(jamAdmin / totalJam, 1);

    const count = profesiCounts[pegawai.jenisTenaga] || 1;
    const avgSalary = (totalSalaries[pegawai.jenisTenaga] || 0) / count;
    
    // Total Biaya JKN Pegawai = (Gaji * FTE Kapitasi) + (Gaji * FTE Admin * ProRata)
    biayaSdm += (avgSalary * fteKapitasi) + (avgSalary * fteAdmin * proRataAdmin);
    
    // Total Biaya Non JKN Pegawai
    biayaSdmNonJkn += (avgSalary * fteNonKapitasi) + (avgSalary * fteAdmin * proRataAdminNonJkn);
  });

  // 4. Calculate Top-Down Costs using Helper ID
  const pesertaJkn = Number(identitas.pesertaJkn) || 0;
  const jenisFaskes = identitas.jenisFaskes || 'Puskesmas Non Rawat Inap'; // Default
  
  let pesertaCategory = '<= 5.000 peserta';
  if (pesertaJkn > 5000 && pesertaJkn <= 25000) pesertaCategory = '5.001 - 25.000 peserta';
  if (pesertaJkn > 25000) pesertaCategory = '> 25.000 peserta';

  const helperId = `${jenisFaskes}${pesertaCategory}`;
  
  // Get coefficients with fallback
  const fallbackRates = { sdm: 0.5, obat: 0.12, alkes: 0.12, nonmedis: 0.07 };
  const rates = RATES[helperId] || RATES[`Puskesmas Non Rawat Inap${pesertaCategory}`] || fallbackRates;
  const overheadRate = OVERHEAD_RATES[jenisFaskes] || 0.15;

  // 5. Apply formulas: Total = Biaya SDM / Rate SDM
  // Handle edge case where rate is 0 or missing
  const rateSdm = rates.sdm > 0 ? rates.sdm : 0.5; 
  
  const totalBiaya = biayaSdm / rateSdm;
  
  // Non JKN Calculation
  const totalBiayaNonJkn = biayaSdmNonJkn / rateSdm;

  // Rawat Inap Calculation (Estimasi kasar berbasis proporsi bed/pasien)
  // In a real scenario, this would use a specific coefficient from the Excel model
  const totalBiayaRawatInap = (jenisFaskes || '').toLowerCase().includes('rawat inap') ? (totalBiaya * 0.15) : 0; // 15% placeholder for RI

  const biayaObat = totalBiaya * (rates.obat || 0);
  const biayaAlkes = totalBiaya * (rates.alkes || 0);
  const biayaNonMedis = totalBiaya * (rates.nonmedis || 0);
  const biayaOverhead = totalBiaya * overheadRate;

  // Unit Cost Calculations (UC = Biaya / Kunjungan)
  const kunjunganRawatInap = (Number(identitas.jkn_ri) || 0) + (Number(identitas.nonjkn_ri) || 0);

  // Kunjungan Kapitasi = ri + umum + lansia + gigi + psiko + gizi + igd
  const kunjunganKapitasiJkn = 
    (Number(identitas.jkn_ri) || 0) + (Number(identitas.jkn_umum) || 0) + (Number(identitas.jkn_lansia) || 0) + 
    (Number(identitas.jkn_gigi) || 0) + (Number(identitas.jkn_psiko) || 0) + (Number(identitas.jkn_gizi) || 0) + 
    (Number(identitas.jkn_igd) || 0);

  const kunjunganKapitasiNonJkn = 
    (Number(identitas.nonjkn_ri) || 0) + (Number(identitas.nonjkn_umum) || 0) + (Number(identitas.nonjkn_lansia) || 0) + 
    (Number(identitas.nonjkn_gigi) || 0) + (Number(identitas.nonjkn_psiko) || 0) + (Number(identitas.nonjkn_gizi) || 0) + 
    (Number(identitas.nonjkn_igd) || 0);

  // Kapitasi Dasar
  let kapitasiDasar = totalBiaya / 12 / (pesertaJkn || 1);
  let totalBiayaJkn = totalBiaya;

  if (String(jenisFaskes).toLowerCase().includes('puskesmas')) {
    kapitasiDasar = (totalBiaya * 0.62) / 12 / (pesertaJkn || 1);
    totalBiayaJkn = totalBiaya * 0.62;
  }

  // UC Kapitasi
  const ucKapitasi = kunjunganKapitasiJkn > 0 ? totalBiayaJkn / kunjunganKapitasiJkn : 0;
  
  // UC Non Kapitasi
  // Non JKN uses the dynamically accumulated biayaSdmNonJkn divided by rateSdm
  const totalBiayaNonJknAccumulated = biayaSdmNonJkn / rateSdm;
  const ucNonKapitasi = kunjunganKapitasiNonJkn > 0 ? totalBiayaNonJknAccumulated / kunjunganKapitasiNonJkn : 0;

  const ucRawatInap = kunjunganRawatInap > 0 ? totalBiayaRawatInap / kunjunganRawatInap : 0;
  const ucTotal = totalKunjungan > 0 ? (totalBiaya + totalBiayaNonJknAccumulated + totalBiayaRawatInap) / totalKunjungan : 0;

  // Real-time calculation result
  return {
    totalBiaya,
    biayaSdm,
    biayaObat,
    biayaAlkes,
    biayaNonMedis,
    biayaOverhead,
    biayaPerkapita: kapitasiDasar, // Renamed functionally to match Kapitasi Dasar
    helperId, // For debugging/display
    totalBiayaNonJkn: totalBiayaNonJknAccumulated,
    totalBiayaRawatInap,
    ucKapitasi,
    ucNonKapitasi,
    ucRawatInap,
    ucTotal
  };
}
