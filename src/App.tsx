import { useState, useEffect } from 'react';
import { Upload, FileDown, CheckCircle, Calculator, ChevronRight, Download, ArrowLeft, Save, Trash2, Edit, ArrowRight, BarChart2 } from 'lucide-react';
import { calculateCosting, initialData } from './lib/calculator';
import ExcelUpload from './components/ExcelUpload';
import { saveSurvey, getSurveys, deleteSurvey, type SavedSurvey } from './lib/db';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import { exportToExcel } from './lib/exporter';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'form' | 'analytics'>('dashboard');
  const [savedSurveys, setSavedSurveys] = useState<SavedSurvey[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState<any>(initialData);

  useEffect(() => {
    if (view === 'dashboard' || view === 'analytics') {
      getSurveys().then(surveys => setSavedSurveys(surveys));
    }
  }, [view]);

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData(initialData);
    setResult(null);
    setStep(0);
    setView('form');
  };

  const handleEdit = (survey: SavedSurvey) => {
    setEditingId(survey.id);
    
    // Backward compatibility migration for kualitatif
    let kualitatif = survey.formData?.kualitatif || [];
    if (!Array.isArray(kualitatif) && typeof kualitatif === 'object') {
      kualitatif = initialData.kualitatif.map(q => ({
        ...q,
        answer: (survey.formData.kualitatif as any)[q.id] || ''
      }));
    }

    setFormData({ ...survey.formData, kualitatif });
    setResult(survey.results);
    setStep(4);
    setView('form');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus data FKTP ini?')) {
      await deleteSurvey(id);
      getSurveys().then(setSavedSurveys);
    }
  };

  const handleSaveDraft = async () => {
    const id = await saveSurvey(formData, result, editingId || undefined);
    setEditingId(id);
    alert('Data berhasil disimpan ke penyimpanan lokal.');
    setView('dashboard');
  };

  const handleExcelData = (data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      identitas: { ...prev.identitas, ...data.identitas },
      sdm: data.sdm.length > 0 ? data.sdm : prev.sdm,
    }));
  };

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const setIdentitas = (field: string, val: any) => {
    setFormData({ ...formData, identitas: { ...formData.identitas, [field]: val } });
  };

  const calculateAndShowResults = () => {
    const res = calculateCosting(formData.identitas, formData.sdm, formData.kualitatif);
    setResult(res);
    setStep(4);
  };

  if (view === 'analytics') {
    return <AnalyticsDashboard surveys={savedSurveys} onBack={() => setView('dashboard')} />;
  }

  if (view === 'dashboard') {
    return (
      <div className="layout">
        <header className="header" style={{ padding: '2rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Dasbor Costing FKTP</h1>
              <p style={{ color: 'var(--text-muted)' }}>Manajemen Data Faskes Tingkat Pertama (Penyimpanan Offline)</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }} onClick={() => exportToExcel(savedSurveys)}>
                <FileDown size={16} /> Unduh Excel
              </button>
              <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#e0e7ff', color: '#4338ca', borderColor: '#c7d2fe' }} onClick={() => setView('analytics')}>
                <BarChart2 size={16} /> Lihat Dasbor Analitik
              </button>
              <button className="btn btn-primary" onClick={handleCreateNew}>+ Tambah FKTP Baru</button>
            </div>
          </div>
        </header>
        <main className="container" style={{ padding: '2rem 1rem' }}>
          {savedSurveys.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Belum ada data FKTP yang tersimpan di perangkat ini.</p>
              <button className="btn btn-primary" onClick={handleCreateNew}>Mulai Hitung Costing</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {savedSurveys.map(s => (
                <div key={s.id} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', color: 'var(--primary)' }}>{s.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Terakhir diedit: {new Date(s.updatedAt).toLocaleString('id-ID')}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleEdit(s)}>
                      <Edit size={16} /> Buka / Edit
                    </button>
                    <button className="btn btn-secondary" style={{ color: 'red', borderColor: '#fca5a5' }} onClick={() => handleDelete(s.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1600px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>FKTP Costing Tool</h1>
          <p className="text-muted">Aplikasi rekapitulasi biaya fasilitas kesehatan tingkat pertama.</p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setView('dashboard')}>
          <ArrowLeft size={16} /> Kembali ke Dasbor
        </button>
      </div>

      {step < 4 && (
        <div className="wizard-tabs">
          <button className={`wizard-tab ${step === 0 ? 'active' : ''}`} onClick={() => setStep(0)}>Upload Excel</button>
          <button className={`wizard-tab ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)}>Identitas</button>
          <button className={`wizard-tab ${step === 2 ? 'active' : ''}`} onClick={() => setStep(2)}>SDM</button>
          <button className={`wizard-tab ${step === 3 ? 'active' : ''}`} onClick={() => setStep(3)}>Kualitatif</button>
        </div>
      )}

      <div className="panel">
        {step === 0 && (
          <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '1rem' }}>
            <ExcelUpload onDataExtracted={handleExcelData} />
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>Lewati, Isi Manual</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>1. Identitas FKTP & Utilisasi</h2>
            
            {(() => {
              const isJamInvalid = Number(formData.identitas.jamLayanan) > 24;
              const isMenitInvalid = Number(formData.identitas.menitLayanan) > 59;
              const isHariInvalid = Number(formData.identitas.hariBuka) > 7;
              const isTtInvalid = String(formData.identitas.jenisFaskes || '').toLowerCase().includes('non rawat') && Number(formData.identitas.jmlTt) > 0;
              
              return (
                <>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>A. Profil Faskes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group"><label className="form-label">Provinsi</label><input type="text" className="form-input" value={formData.identitas.provinsi || ""} onChange={e => setIdentitas('provinsi', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Kab/Kota</label><input type="text" className="form-input" value={formData.identitas.kabkota || ""} onChange={e => setIdentitas('kabkota', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Kode Faskes</label><input type="text" className="form-input" value={formData.identitas.kdFaskes || ""} onChange={e => setIdentitas('kdFaskes', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Nama FKTP</label><input type="text" className="form-input" value={formData.identitas.namaFktp || ""} onChange={e => setIdentitas('namaFktp', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Jenis Faskes</label><input type="text" className="form-input" value={formData.identitas.jenisFaskes || ""} onChange={e => setIdentitas('jenisFaskes', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Karakter Wilayah</label><input type="text" className="form-input" value={formData.identitas.karakterWil || ""} onChange={e => setIdentitas('karakterWil', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Status Akreditasi</label><input type="text" className="form-input" value={formData.identitas.statusAkre || ""} onChange={e => setIdentitas('statusAkre', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tahun Akreditasi</label><input type="number" className="form-input" value={formData.identitas.thnAkre || ""} onChange={e => setIdentitas('thnAkre', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Nama CP</label><input type="text" className="form-input" value={formData.identitas.cpNama || ""} onChange={e => setIdentitas('cpNama', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Telp CP</label><input type="text" className="form-input" value={formData.identitas.cpTelp || ""} onChange={e => setIdentitas('cpTelp', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Jabatan CP</label><input type="text" className="form-input" value={formData.identitas.cpJabatan || ""} onChange={e => setIdentitas('cpJabatan', e.target.value)} /></div>
            </div>

            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>B. Utilisasi & Kepesertaan JKN</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Jam Layanan</label>
                <input type="number" className="form-input" style={{ borderColor: isJamInvalid ? 'red' : '' }} value={formData.identitas.jamLayanan || ""} onChange={e => setIdentitas('jamLayanan', e.target.value)} />
                {isJamInvalid && <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>Maksimal 24 jam</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Menit Layanan</label>
                <input type="number" className="form-input" style={{ borderColor: isMenitInvalid ? 'red' : '' }} value={formData.identitas.menitLayanan || ""} onChange={e => setIdentitas('menitLayanan', e.target.value)} />
                {isMenitInvalid && <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>Maksimal 59 menit</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Hari Buka/Minggu</label>
                <input type="number" className="form-input" style={{ borderColor: isHariInvalid ? 'red' : '' }} value={formData.identitas.hariBuka || ""} onChange={e => setIdentitas('hariBuka', e.target.value)} />
                {isHariInvalid && <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>Maksimal 7 hari</div>}
              </div>
              <div className="form-group"><label className="form-label">Info Lab</label><input type="text" className="form-input" value={formData.identitas.labSendiri || ""} onChange={e => setIdentitas('labSendiri', e.target.value)} /></div>
              <div className="form-group">
                <label className="form-label">Jumlah Tempat Tidur</label>
                <input type="number" className="form-input" style={{ borderColor: isTtInvalid ? 'red' : '' }} value={formData.identitas.jmlTt || ""} onChange={e => setIdentitas('jmlTt', e.target.value)} />
                {isTtInvalid && <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}>Non-Rawat Inap tidak boleh ada TT</div>}
              </div>
              <div className="form-group"><label className="form-label">Total Peserta JKN</label><input type="number" className="form-input" value={formData.identitas.pesertaJkn || ""} onChange={e => setIdentitas('pesertaJkn', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Pendapatan Kapitasi JKN</label><input type="number" className="form-input" value={formData.identitas.pendKapJkn || ""} onChange={e => setIdentitas('pendKapJkn', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Pendapatan Non-Kapitasi JKN</label><input type="number" className="form-input" value={formData.identitas.pendNonkapJkn || ""} onChange={e => setIdentitas('pendNonkapJkn', e.target.value)} /></div>
            </div>

            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>C. Rincian Kunjungan Pasien (Tahunan)</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="sticky-col">Unit Layanan</th>
                    <th>JKN</th>
                    <th>Non-JKN</th>
                  </tr>
                </thead>
                <tbody>
                  {["Rawat Inap", "Poli Umum", "Poli Lansia", "Poli KIA", "Poli Gigi", "Poli Psikologi", "Poli Gizi", "IGD", "Poli KB", "Persalinan", "Laboratorium", "ANC/USG", "UKM", "Lainnya"].map((poli, i) => {
                    const keys = ["ri", "umum", "lansia", "kia", "gigi", "psiko", "gizi", "igd", "kb", "persalin", "lab", "anc_usg", "ukm", "lain"];
                    const key = keys[i];
                    return (
                      <tr key={key}>
                        <td className="sticky-col" style={{ fontWeight: 500 }}>{poli}</td>
                        <td><input type="number" className="form-input" style={{ padding: '0.5rem' }} value={formData.identitas[`jkn_${key}`] || ""} onChange={e => setIdentitas(`jkn_${key}`, e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={{ padding: '0.5rem' }} value={formData.identitas[`nonjkn_${key}`] || ""} onChange={e => setIdentitas(`nonjkn_${key}`, e.target.value)} /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginTop: '2rem' }}>D. Data Kepegawaian (Total Gaji Tahunan)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group"><label className="form-label">Dokter Umum</label><input type="number" className="form-input" value={formData.identitas.gaji_dokter || ""} onChange={e => setIdentitas('gaji_dokter', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Dokter Gigi</label><input type="number" className="form-input" value={formData.identitas.gaji_dokter_gigi || ""} onChange={e => setIdentitas('gaji_dokter_gigi', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Bidan</label><input type="number" className="form-input" value={formData.identitas.gaji_bidan || ""} onChange={e => setIdentitas('gaji_bidan', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Perawat</label><input type="number" className="form-input" value={formData.identitas.gaji_perawat || ""} onChange={e => setIdentitas('gaji_perawat', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Perawat Gigi</label><input type="number" className="form-input" value={formData.identitas.gaji_perawat_gigi || ""} onChange={e => setIdentitas('gaji_perawat_gigi', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Psikolog Klinis</label><input type="number" className="form-input" value={formData.identitas.gaji_psikolog || ""} onChange={e => setIdentitas('gaji_psikolog', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">ATLM</label><input type="number" className="form-input" value={formData.identitas.gaji_atlm || ""} onChange={e => setIdentitas('gaji_atlm', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tenaga Kefarmasian</label><input type="number" className="form-input" value={formData.identitas.gaji_farmasi || ""} onChange={e => setIdentitas('gaji_farmasi', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Nutrisionis</label><input type="number" className="form-input" value={formData.identitas.gaji_nutrisionis || ""} onChange={e => setIdentitas('gaji_nutrisionis', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Keterapian Fisik</label><input type="number" className="form-input" value={formData.identitas.gaji_keterapian || ""} onChange={e => setIdentitas('gaji_keterapian', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">SDM Kes Lainnya</label><input type="number" className="form-input" value={formData.identitas.gaji_sdm_lain || ""} onChange={e => setIdentitas('gaji_sdm_lain', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Non SDM Kesehatan</label><input type="number" className="form-input" value={formData.identitas.gaji_non_sdm || ""} onChange={e => setIdentitas('gaji_non_sdm', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Spesialis KKLP</label><input type="number" className="form-input" value={formData.identitas.gaji_sp_kklp || ""} onChange={e => setIdentitas('gaji_sp_kklp', e.target.value)} /></div>
            </div>

                </>
              );
            })()}

          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>2. Data Sumber Daya Manusia (SDM)</h2>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>Tabel dengan Horizontal Scroll & Sticky Column untuk mencegah teks menumpuk.</p>
            
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setFormData({ ...formData, sdm: [...formData.sdm, { id: `ADM${formData.sdm.length + 1}`, jenisTenaga: '', totalJam: '' }] })}>+ Tambah Pegawai</button>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="sticky-col" style={{ minWidth: '300px' }}>ID & Info SDM</th>
                    <th style={{ backgroundColor: '#eff6ff', color: '#1e40af', borderLeft: '2px solid #bfdbfe', borderRight: '2px solid #bfdbfe' }}>Total Jam</th>
                    <th>Poli Umum</th>
                    <th>Poli Lansia</th>
                    <th>Poli KIA</th>
                    <th>Poli Gigi</th>
                    <th>Psikologi</th>
                    <th>Poli Gizi</th>
                    <th>IGD</th>
                    <th>Poli KB</th>
                    <th>Persalinan</th>
                    <th>UKM</th>
                    <th>Lainnya</th>
                    <th>Farmasi/Lab</th>
                    <th>Validasi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.sdm.map((pegawai: any, index: number) => {
                    const totalAlokasi = ["umum", "lansia", "kia", "gigi", "psiko", "gizi", "igd", "kb", "persalin", "ukm", "lain", "farmasi"].reduce((acc, key) => acc + (Number(pegawai[key]) || 0), 0);
                    const isValid = totalAlokasi === Number(pegawai.totalJam);
                    const inputStyle = { padding: '0.6rem', width: '80px', fontSize: '0.9rem' };

                    const updatePegawai = (field: string, value: any) => {
                      const newSdm = [...formData.sdm];
                      newSdm[index] = { ...newSdm[index], [field]: value };
                      setFormData({ ...formData, sdm: newSdm });
                    };

                    return (
                      <tr key={index} style={{ backgroundColor: pegawai.totalJam && !isValid ? '#fee2e2' : 'transparent' }}>
                        <td className="sticky-col" style={{ verticalAlign: 'top', minWidth: '300px', backgroundColor: pegawai.totalJam && !isValid ? '#fee2e2' : 'var(--bg-panel)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input type="text" className="form-input" style={{ padding: '0.6rem', fontSize: '0.9rem', borderColor: pegawai.totalJam && !isValid ? 'red' : 'var(--border)' }} placeholder="ID" value={pegawai.id || ''} onChange={e => updatePegawai('id', e.target.value)} />
                            <select className="form-select" style={{ padding: '0.6rem', fontSize: '0.9rem', borderColor: pegawai.totalJam && !isValid ? 'red' : 'var(--border)' }} value={pegawai.jenisTenaga || ''} onChange={e => updatePegawai('jenisTenaga', e.target.value)}>
                              <option value="">-- Jenis Tenaga --</option>
                            <option value="Dokter Umum">Dokter Umum</option>
                            <option value="Dokter Gigi">Dokter Gigi</option>
                            <option value="Bidan">Bidan</option>
                            <option value="Perawat">Perawat</option>
                            <option value="Perawat Gigi">Perawat Gigi</option>
                            <option value="Psikolog Klinis">Psikolog Klinis</option>
                            <option value="ATLM (Analis Lab)">ATLM (Analis Lab)</option>
                            <option value="Tenaga Kefarmasian">Tenaga Kefarmasian</option>
                            <option value="Tenaga Gizi">Tenaga Gizi</option>
                            <option value="Fisioterapis">Fisioterapis</option>
                            <option value="Dokter Sp.KKLP">Dokter Sp.KKLP</option>
                            <option value="SDM Kesehatan Lainnya">SDM Kesehatan Lainnya</option>
                            <option value="Non SDM Kesehatan">Non SDM Kesehatan</option>
                          </select>
                          </div>
                        </td>
                        <td style={{ backgroundColor: '#eff6ff', borderLeft: '2px solid #bfdbfe', borderRight: '2px solid #bfdbfe' }}>
                          <input type="number" className="form-input" style={{...inputStyle, backgroundColor: '#ffffff', fontWeight: 'bold', borderColor: pegawai.totalJam && !isValid ? 'red' : 'var(--border)'}} value={pegawai.totalJam} onChange={e => updatePegawai('totalJam', e.target.value)} />
                        </td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.umum || ''} onChange={e => updatePegawai('umum', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.lansia || ''} onChange={e => updatePegawai('lansia', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.kia || ''} onChange={e => updatePegawai('kia', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.gigi || ''} onChange={e => updatePegawai('gigi', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.psiko || ''} onChange={e => updatePegawai('psiko', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.gizi || ''} onChange={e => updatePegawai('gizi', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.igd || ''} onChange={e => updatePegawai('igd', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.kb || ''} onChange={e => updatePegawai('kb', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.persalin || ''} onChange={e => updatePegawai('persalin', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.ukm || ''} onChange={e => updatePegawai('ukm', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.lain || ''} onChange={e => updatePegawai('lain', e.target.value)} /></td>
                        <td><input type="number" className="form-input" style={inputStyle} value={pegawai.farmasi || ''} onChange={e => updatePegawai('farmasi', e.target.value)} /></td>
                        <td style={{ minWidth: '150px' }}>
                          {pegawai.totalJam ? (isValid ? <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ OK</span> : 
                            <div style={{ color: 'var(--error)', fontWeight: 'bold', fontSize: '0.85rem' }}>
                              ✗ CEK JAM<br/>
                              <span style={{ fontWeight: 'normal', fontSize: '0.75rem' }}>(Alokasi: {totalAlokasi}, Total: {pegawai.totalJam})</span>
                            </div>) : null}
                        </td>
                        <td>
                          <button style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }} onClick={() => {
                              const newSdm = [...formData.sdm];
                              newSdm.splice(index, 1);
                              setFormData({ ...formData, sdm: newSdm });
                            }}>Hapus</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ color: 'var(--primary)', margin: 0 }}>3. Pendalaman Kualitatif & Strategi</h2>
                <p className="text-muted" style={{ margin: '0.5rem 0 0 0' }}>Pertanyaan wawancara kepada pihak fasilitas kesehatan untuk memahami kondisi lapangan.</p>
              </div>
              <button className="btn btn-secondary" onClick={() => {
                const kualitatif = Array.isArray(formData.kualitatif) ? [...formData.kualitatif] : [];
                kualitatif.push({ id: `q${Date.now()}`, question: '', answer: '', suggestions: [] });
                setFormData({ ...formData, kualitatif });
              }}>
                + Tambah Pertanyaan Baru
              </button>
            </div>

            {(Array.isArray(formData.kualitatif) ? formData.kualitatif : []).map((q: any, index: number) => {
              const isDefault = ['q1', 'q2', 'q3'].includes(q.id);
              
              return (
                <div key={q.id} className="form-group" style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid var(--border)', position: 'relative' }}>
                  {!isDefault && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                      <button className="btn" style={{ padding: '0.4rem', color: '#ef4444', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px' }} onClick={() => {
                        if (window.confirm('Hapus pertanyaan ini?')) {
                          const kualitatif = formData.kualitatif.filter((item: any) => item.id !== q.id);
                          setFormData({ ...formData, kualitatif });
                        }
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  
                  <label className="form-label" style={{ fontSize: '1.1rem', marginBottom: '1rem', width: '90%' }}>
                    {isDefault ? q.question : (
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Tulis pertanyaan tambahan baru di sini..." 
                        value={q.question}
                        onChange={e => {
                          const newQ = [...formData.kualitatif];
                          newQ[index].question = e.target.value;
                          setFormData({ ...formData, kualitatif: newQ });
                        }}
                        style={{ fontWeight: 600, fontSize: '1.1rem' }}
                      />
                    )}
                  </label>

                  {q.suggestions && q.suggestions.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {q.suggestions.map((suggestion: string, sIndex: number) => (
                        <button 
                          key={sIndex}
                          className="btn btn-secondary" 
                          style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', backgroundColor: q.answer === suggestion ? '#e0e7ff' : '', borderColor: q.answer === suggestion ? '#818cf8' : '' }} 
                          onClick={() => {
                            const newQ = [...formData.kualitatif];
                            newQ[index].answer = suggestion;
                            setFormData({ ...formData, kualitatif: newQ });
                          }}
                        >
                          + {suggestion.split(' ').slice(0, 3).join(' ')}...
                        </button>
                      ))}
                    </div>
                  )}

                  <textarea 
                    className="form-input" 
                    rows={2} 
                    placeholder="Ketik jawaban atau keterangan di sini..." 
                    value={q.answer || ""} 
                    onChange={e => {
                      const newQ = [...formData.kualitatif];
                      newQ[index].answer = e.target.value;
                      setFormData({ ...formData, kualitatif: newQ });
                    }}
                  ></textarea>
                </div>
              );
            })}
          </div>
        )}

        {step === 4 && result && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Rekapitulasi Total Biaya</h1>
              <p className="text-muted" style={{ fontSize: '1.2rem' }}>Dihitung secara real-time berdasarkan matriks alokasi</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ padding: '2rem', backgroundColor: '#f1f5f9', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Total Biaya Keseluruhan JKN</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Rp {Math.round(result.totalBiaya || 0).toLocaleString('id-ID')}
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #cbd5e1', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Unit Cost (UC) Kapitasi: <strong style={{ color: 'var(--primary)' }}>Rp {Math.round(result.ucKapitasi || 0).toLocaleString('id-ID')}</strong> / Kunjungan
                </div>
              </div>
              <div style={{ padding: '2rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Biaya JKN Perkapita / Bulan</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)' }}>
                  Rp {Math.round(result.biayaPerkapita || 0).toLocaleString('id-ID')}
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #a7f3d0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  UC Total Keseluruhan: <strong style={{ color: 'var(--success)' }}>Rp {Math.round(result.ucTotal || 0).toLocaleString('id-ID')}</strong> / Kunjungan
                </div>
              </div>
            </div>

            {/* NON JKN SCORECARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ padding: '1.5rem', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Total Biaya Non-JKN (Estimasi)</h3>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#c2410c' }}>
                  Rp {Math.round(result.totalBiayaNonJkn || 0).toLocaleString('id-ID')}
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #fed7aa', color: '#9a3412', fontSize: '0.9rem' }}>
                  UC Non-Kapitasi: <strong style={{ color: '#c2410c' }}>Rp {Math.round(result.ucNonKapitasi || 0).toLocaleString('id-ID')}</strong> / Kunjungan
                </div>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>Total Biaya Rawat Inap (Proyeksi)</h3>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1d4ed8' }}>
                  {(result.totalBiayaRawatInap || 0) > 0 ? `Rp ${Math.round(result.totalBiayaRawatInap || 0).toLocaleString('id-ID')}` : 'Tidak Ada Rawat Inap'}
                </div>
                {(result.totalBiayaRawatInap || 0) > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #bfdbfe', color: '#1e40af', fontSize: '0.9rem' }}>
                    UC Rawat Inap: <strong style={{ color: '#1d4ed8' }}>Rp {Math.round(result.ucRawatInap || 0).toLocaleString('id-ID')}</strong> / Kunjungan
                  </div>
                )}
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>Rincian Biaya (JKN)</h3>
            <div className="table-container">
              <table className="data-table">
                <tbody>
                  <tr>
                    <td><strong>Biaya SDM / Tenaga Kesehatan</strong><br/><span style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>Dihitung berdasarkan FTE dan Gaji per Profesi</span></td>
                    <td style={{textAlign:'right', fontWeight:700}}>Rp {Math.round(result.biayaSdm || 0).toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td><strong>Biaya Obat / BMHP</strong></td>
                    <td style={{textAlign:'right', fontWeight:700}}>Rp {Math.round(result.biayaObat || 0).toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td><strong>Biaya Alat Kesehatan (Alkes)</strong></td>
                    <td style={{textAlign:'right', fontWeight:700}}>Rp {Math.round(result.biayaAlkes || 0).toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td><strong>Biaya Non-Medis</strong></td>
                    <td style={{textAlign:'right', fontWeight:700}}>Rp {Math.round(result.biayaNonMedis || 0).toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td><strong>Biaya Overhead / Tak Langsung</strong></td>
                    <td style={{textAlign:'right', fontWeight:700}}>Rp {Math.round(result.biayaOverhead || 0).toLocaleString('id-ID')}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: 'var(--bg-panel)' }}>
                    <td style={{ textAlign: 'right', fontWeight: 800 }}>TOTAL BIAYA JKN (Harus sama dengan Scorecard):</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>Rp {Math.round(result.totalBiaya || 0).toLocaleString('id-ID')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setStep(3)}><ArrowLeft size={18} /> Kembali Edit Data</button>
              <button className="btn btn-secondary" style={{ backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' }} onClick={handleSaveDraft}><Save size={18} /> Simpan ke Dasbor (Offline)</button>
              <button className="btn btn-primary"><Download size={18} /> Ekspor Laporan PDF</button>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        {step < 4 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            {step > 0 ? (
              <button className="btn btn-secondary" onClick={prevStep}><ArrowLeft size={18} /> Kembali</button>
            ) : <div/>}

            {step >= 0 && step < 3 && (
              <button className="btn btn-primary" onClick={nextStep}>Selanjutnya <ArrowRight size={18} /></button>
            )}

            {step === 3 && (
              <button className="btn btn-primary" style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)' }} onClick={calculateAndShowResults}>
                <Calculator size={18} /> Hitung Kalkulasi
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
