import { useState, useMemo } from 'react';
import { ArrowLeft, Filter } from 'lucide-react';
import type { SavedSurvey } from '../lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  surveys: SavedSurvey[];
  onBack: () => void;
}

export default function AnalyticsDashboard({ surveys, onBack }: Props) {
  const [filterJenis, setFilterJenis] = useState<'all' | 'rawat_inap' | 'non_rawat_inap'>('all');
  const [filterKklp, setFilterKklp] = useState<'all' | 'ada' | 'tidak'>('all');

  // Filtering Logic
  const filteredSurveys = useMemo(() => {
    return surveys.filter(s => {
      // Filter Rawat Inap
      const jenisFaskes = (s.formData?.identitas?.jenisFaskes || '').toLowerCase();
      const isNonRawatInap = jenisFaskes.includes('non');
      const isRawatInap = jenisFaskes.includes('rawat inap') && !isNonRawatInap;
      
      if (filterJenis === 'rawat_inap' && !isRawatInap) return false;
      if (filterJenis === 'non_rawat_inap' && !isNonRawatInap) return false;

      // Filter Sp.KKLP
      const sdm = s.formData?.sdm || [];
      const hasKklp = sdm.some((p: any) => p.jenisTenaga === 'Dokter Sp.KKLP' && Number(p.totalJam) > 0);
      
      if (filterKklp === 'ada' && !hasKklp) return false;
      if (filterKklp === 'tidak' && hasKklp) return false;

      return true;
    });
  }, [surveys, filterJenis, filterKklp]);

  // Metrics Calculation
  const metrics = useMemo(() => {
    if (filteredSurveys.length === 0) return null;

    let sumJkn = 0;
    let sumNonJkn = 0;
    let sumRawatInap = 0;
    let sumSdm = 0, sumObat = 0, sumAlkes = 0, sumNonMedis = 0, sumOverhead = 0;
    let totalPeserta = 0;
    let sumKunjunganJkn = 0;
    let sumKunjunganNonJkn = 0;
    let sumKunjunganRi = 0;

    filteredSurveys.forEach(s => {
      const res = s.results;
      if (!res) return;
      
      sumJkn += res.totalBiaya || 0;
      sumNonJkn += res.totalBiayaNonJkn || 0;
      sumRawatInap += res.totalBiayaRawatInap || 0;
      
      sumSdm += res.biayaSdm || 0;
      sumObat += res.biayaObat || 0;
      sumAlkes += res.biayaAlkes || 0;
      sumNonMedis += res.biayaNonMedis || 0;
      sumOverhead += res.biayaOverhead || 0;
      
      totalPeserta += Number(s.formData?.identitas?.pesertaJkn || 0);

      // Sum Kunjungan
      const id = s.formData?.identitas || {};
      const kjkn = (Number(id.jkn_ri) || 0) + (Number(id.jkn_umum) || 0) + (Number(id.jkn_lansia) || 0) + 
                   (Number(id.jkn_kia) || 0) + (Number(id.jkn_gigi) || 0) + (Number(id.jkn_psiko) || 0) + 
                   (Number(id.jkn_gizi) || 0) + (Number(id.jkn_igd) || 0) + (Number(id.jkn_kb) || 0) + 
                   (Number(id.jkn_persalin) || 0) + (Number(id.jkn_lab) || 0) + (Number(id.jkn_anc_usg) || 0) + 
                   (Number(id.jkn_ukm) || 0) + (Number(id.jkn_lain) || 0);
      
      const knonjkn = (Number(id.nonjkn_ri) || 0) + (Number(id.nonjkn_umum) || 0) + (Number(id.nonjkn_lansia) || 0) + 
                      (Number(id.nonjkn_kia) || 0) + (Number(id.nonjkn_gigi) || 0) + (Number(id.nonjkn_psiko) || 0) + 
                      (Number(id.nonjkn_gizi) || 0) + (Number(id.nonjkn_igd) || 0) + (Number(id.nonjkn_kb) || 0) + 
                      (Number(id.nonjkn_persalin) || 0) + (Number(id.nonjkn_lab) || 0) + (Number(id.nonjkn_anc_usg) || 0) + 
                      (Number(id.nonjkn_ukm) || 0) + (Number(id.nonjkn_lain) || 0);

      const kri = (Number(id.jkn_ri) || 0) + (Number(id.nonjkn_ri) || 0);

      sumKunjunganJkn += kjkn;
      sumKunjunganNonJkn += knonjkn;
      sumKunjunganRi += kri;
    });

    return {
      totalJkn: sumJkn,
      totalNonJkn: sumNonJkn,
      totalRawatInap: sumRawatInap,
      avgPerkapita: totalPeserta > 0 ? sumJkn / totalPeserta / 12 : 0,
      avgUcKapitasi: sumKunjunganJkn > 0 ? sumJkn / sumKunjunganJkn : 0,
      avgUcNonKapitasi: sumKunjunganNonJkn > 0 ? sumNonJkn / sumKunjunganNonJkn : 0,
      avgUcRi: sumKunjunganRi > 0 ? sumRawatInap / sumKunjunganRi : 0,
      pieData: [
        { name: 'SDM', value: sumSdm },
        { name: 'Obat', value: sumObat },
        { name: 'Alkes', value: sumAlkes },
        { name: 'Non-Medis', value: sumNonMedis },
        { name: 'Overhead', value: sumOverhead }
      ]
    };
  }, [filteredSurveys]);

  const barData = useMemo(() => {
    return filteredSurveys.map(s => ({
      name: s.name,
      'Biaya JKN': Math.round(s.results?.totalBiaya || 0),
      'Biaya Non-JKN': Math.round(s.results?.totalBiayaNonJkn || 0),
    }));
  }, [filteredSurveys]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="layout">
      <header className="header" style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container flex-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src="/kemenkes-logo.png" alt="Logo Kemenkes" style={{ height: '84px', objectFit: 'contain' }} />
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--primary)', marginBottom: '0.2rem' }}>Dasbor Analitik Makro</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Agregat Data {filteredSurveys.length} Fasilitas Kesehatan</p>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} /> Kembali ke Manajemen Data
          </button>
        </div>
      </header>

      <main className="container" style={{ padding: '2rem 1rem' }}>
        {/* Filters Section */}
        <div style={{ backgroundColor: 'var(--bg-panel)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Filter size={18} /> FILTER DATA:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem' }}>Jenis Faskes:</span>
            <select className="form-select" style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 1rem' }} value={filterJenis} onChange={(e: any) => setFilterJenis(e.target.value)}>
              <option value="all">Semua Faskes</option>
              <option value="rawat_inap">Khusus Rawat Inap</option>
              <option value="non_rawat_inap">Khusus Non-Rawat Inap</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem' }}>Dokter Sp.KKLP:</span>
            <select className="form-select" style={{ width: 'auto', padding: '0.4rem 2rem 0.4rem 1rem' }} value={filterKklp} onChange={(e: any) => setFilterKklp(e.target.value)}>
              <option value="all">Semua Kondisi</option>
              <option value="ada">Tersedia Sp.KKLP</option>
              <option value="tidak">Belum Ada Sp.KKLP</option>
            </select>
          </div>
        </div>

        {filteredSurveys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Tidak ada data yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          <>
            {/* Scorecards */}
            <div className="grid-4">
              <div style={{ padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total FKTP</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{filteredSurveys.length}</div>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: '#ecfdf5', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Avg Biaya JKN Perkapita</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>Rp {Math.round(metrics?.avgPerkapita || 0).toLocaleString('id-ID')}</div>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Beban JKN (Agregat)</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2563eb' }}>Rp {Math.round(metrics?.totalJkn || 0).toLocaleString('id-ID')}</div>
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #bfdbfe', fontSize: '0.85rem', color: '#1d4ed8' }}>
                  Avg UC Kapitasi: <strong>Rp {Math.round(metrics?.avgUcKapitasi || 0).toLocaleString('id-ID')}</strong>
                </div>
              </div>
              <div style={{ padding: '1.5rem', backgroundColor: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Beban Non-JKN</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#c2410c' }}>Rp {Math.round(metrics?.totalNonJkn || 0).toLocaleString('id-ID')}</div>
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #fed7aa', fontSize: '0.85rem', color: '#9a3412' }}>
                  Avg UC Non-Kapitasi: <strong>Rp {Math.round(metrics?.avgUcNonKapitasi || 0).toLocaleString('id-ID')}</strong>
                </div>
              </div>
              {/* Optional: Add Rawat Inap specifically if filter is not "Non Rawat Inap" */}
              {filterJenis !== 'non_rawat_inap' && (
                <div style={{ padding: '1.5rem', backgroundColor: '#faf5ff', borderRadius: '12px', border: '1px solid #f3e8ff', gridColumn: 'span 4' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center' }}>Proyeksi Beban Total Rawat Inap (Agregat)</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#7e22ce', textAlign: 'center' }}>Rp {Math.round(metrics?.totalRawatInap || 0).toLocaleString('id-ID')}</div>
                  <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #e9d5ff', fontSize: '0.9rem', color: '#6b21a8', textAlign: 'center' }}>
                    Avg UC Rawat Inap: <strong>Rp {Math.round(metrics?.avgUcRi || 0).toLocaleString('id-ID')}</strong> / Kunjungan
                  </div>
                </div>
              )}
            </div>

            {/* Charts */}
            <div className="grid-2-1">
              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Perbandingan Biaya (JKN vs Non-JKN) per Faskes</h3>
                <div style={{ height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `Rp ${(value/1000000).toFixed(0)}M`} />
                      <RechartsTooltip formatter={(value: any) => `Rp ${Number(value).toLocaleString('id-ID')}`} />
                      <Legend />
                      <Bar dataKey="Biaya JKN" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Biaya Non-JKN" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', textAlign: 'center' }}>Komposisi Biaya (Agregat Nasional)</h3>
                <div style={{ height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics?.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {metrics?.pieData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value: any) => `Rp ${Number(value).toLocaleString('id-ID')}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
