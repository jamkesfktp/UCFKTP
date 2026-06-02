import { X } from 'lucide-react';

export default function ReferenceModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'white', borderRadius: '12px', width: '100%', maxWidth: '800px',
        maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={24} color="var(--text-muted)" />
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Referensi Pengisian Variabel</h2>
        
        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>1. Jenis Faskes</h3>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Puskesmas Non Rawat Inap</li>
          <li>Puskesmas Rawat Inap</li>
          <li>Klinik Pratama Non Rawat Inap</li>
          <li>Klinik Pratama Rawat Inap</li>
          <li>Dokter Praktek Perorangan Non Rawat Inap</li>
          <li>Dokter Praktek Perorangan Rawat Inap</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>2. Akreditasi</h3>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Dasar</li>
          <li>Madya</li>
          <li>Utama</li>
          <li>Paripurna</li>
          <li>Belum Terakreditasi</li>
          <li>Tidak berlaku</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>3. Karakteristik Wilayah Kerja</h3>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Perkotaan</li>
          <li>Perdesaan</li>
          <li>Terpencil</li>
          <li>Sangat Terpencil</li>
          <li>Tidak berlaku</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>4. Unit Kerja (Tenaga SDM)</h3>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', columns: 2 }}>
          <li>Poli umum</li>
          <li>Poli gigi</li>
          <li>Poli KIA</li>
          <li>Poli KB</li>
          <li>Poli Anak</li>
          <li>Poli Lansia</li>
          <li>Poli Lainnya</li>
          <li>Rawat Inap</li>
          <li>UKM</li>
          <li>Admin</li>
          <li>Kepala FKTP</li>
          <li>Instalasi Farmasi</li>
          <li>Laboratorium</li>
          <li>Persalinan</li>
        </ul>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onClose}>Tutup Referensi</button>
        </div>
      </div>
    </div>
  );
}
