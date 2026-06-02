import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";

interface ExcelUploadProps {
  onDataExtracted: (data: any) => void;
}

export default function ExcelUpload({ onDataExtracted }: ExcelUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("loading");
    const reader = new FileReader();
    
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        
        // Extract 1. IDENTITAS
        const wsIdentitas = wb.Sheets["1. IDENTITAS"];
        const identitasData = {
          provinsi: wsIdentitas["E4"]?.v || "",
          kabkota: wsIdentitas["E5"]?.v || "",
          kdFaskes: wsIdentitas["E6"]?.v || "",
          namaFktp: wsIdentitas["E7"]?.v || "",
          jenisFaskes: wsIdentitas["E8"]?.v || "",
          karakterWil: wsIdentitas["E9"]?.v || "",
          statusAkre: wsIdentitas["E10"]?.v || "",
          thnAkre: wsIdentitas["E11"]?.v || "",
          cpNama: wsIdentitas["E12"]?.v || "",
          cpTelp: wsIdentitas["E13"]?.v || "",
          cpJabatan: wsIdentitas["E14"]?.v || "",

          jamLayanan: wsIdentitas["E15"]?.v || "",
          menitLayanan: wsIdentitas["G15"]?.v || "",
          hariBuka: wsIdentitas["E16"]?.v || "",
          labSendiri: wsIdentitas["E17"]?.v || "",
          jmlTt: wsIdentitas["E18"]?.v || "",
          
          pesertaJkn: wsIdentitas["E21"]?.v || "",
          pendKapJkn: wsIdentitas["E22"]?.v || "",
          pendNonkapJkn: wsIdentitas["E23"]?.v || "",
          
          jkn_ri: wsIdentitas["E28"]?.v || "", nonjkn_ri: wsIdentitas["G28"]?.v || "",
          jkn_umum: wsIdentitas["E29"]?.v || "", nonjkn_umum: wsIdentitas["G29"]?.v || "",
          jkn_lansia: wsIdentitas["E30"]?.v || "", nonjkn_lansia: wsIdentitas["G30"]?.v || "",
          jkn_kia: wsIdentitas["E31"]?.v || "", nonjkn_kia: wsIdentitas["G31"]?.v || "",
          jkn_gigi: wsIdentitas["E32"]?.v || "", nonjkn_gigi: wsIdentitas["G32"]?.v || "",
          jkn_psiko: wsIdentitas["E33"]?.v || "", nonjkn_psiko: wsIdentitas["G33"]?.v || "",
          jkn_gizi: wsIdentitas["E34"]?.v || "", nonjkn_gizi: wsIdentitas["G34"]?.v || "",
          jkn_igd: wsIdentitas["E35"]?.v || "", nonjkn_igd: wsIdentitas["G35"]?.v || "",
          jkn_kb: wsIdentitas["E36"]?.v || "", nonjkn_kb: wsIdentitas["G36"]?.v || "",
          jkn_persalin: wsIdentitas["E37"]?.v || "", nonjkn_persalin: wsIdentitas["G37"]?.v || "",
          jkn_lab: wsIdentitas["E38"]?.v || "", nonjkn_lab: wsIdentitas["G38"]?.v || "",
          jkn_anc_usg: wsIdentitas["E39"]?.v || "", nonjkn_anc_usg: wsIdentitas["G39"]?.v || "",
          jkn_ukm: wsIdentitas["E40"]?.v || "", nonjkn_ukm: wsIdentitas["G40"]?.v || "",
          jkn_lain: wsIdentitas["E41"]?.v || "", nonjkn_lain: wsIdentitas["G41"]?.v || "",

          // D. DATA KEPEGAWAIAN (Gaji)
          gaji_dokter: wsIdentitas["F46"]?.v || "",
          gaji_dokter_gigi: wsIdentitas["F47"]?.v || "",
          gaji_bidan: wsIdentitas["F48"]?.v || "",
          gaji_perawat: wsIdentitas["F49"]?.v || "",
          gaji_perawat_gigi: wsIdentitas["F50"]?.v || "",
          gaji_psikolog: wsIdentitas["F51"]?.v || "",
          gaji_atlm: wsIdentitas["F52"]?.v || "",
          gaji_farmasi: wsIdentitas["F53"]?.v || "",
          gaji_nutrisionis: wsIdentitas["F54"]?.v || "",
          gaji_keterapian: wsIdentitas["F55"]?.v || "",
          gaji_sdm_lain: wsIdentitas["F56"]?.v || "",
          gaji_non_sdm: wsIdentitas["F57"]?.v || "",
          gaji_sp_kklp: wsIdentitas["F58"]?.v || "",
        };

        // Extract 2. SDM
        const wsSDM = wb.Sheets["2. SDM"];
        const sdmData: any[] = [];
        
        let row = 5;
        while (true) {
          // Check if ID Pegawai or Jenis Tenaga exists
          const id = wsSDM[`C${row}`]?.v;
          const jenisTenaga = wsSDM[`D${row}`]?.v;
          
          if (!jenisTenaga && !id) break; // End of data
          
          sdmData.push({
            id: id || `ADM${row-4}`,
            jenisTenaga: jenisTenaga || "",
            totalJam: wsSDM[`F${row}`]?.v || "",
            umum: wsSDM[`G${row}`]?.v || "",
            lansia: wsSDM[`H${row}`]?.v || "",
            kia: wsSDM[`I${row}`]?.v || "",
            gigi: wsSDM[`J${row}`]?.v || "",
            psiko: wsSDM[`K${row}`]?.v || "",
            gizi: wsSDM[`L${row}`]?.v || "",
            igd: wsSDM[`M${row}`]?.v || "",
            kb: wsSDM[`N${row}`]?.v || "",
            persalin: wsSDM[`O${row}`]?.v || "",
            ukm: wsSDM[`P${row}`]?.v || "",
            lain: wsSDM[`Q${row}`]?.v || "",
            farmasi: wsSDM[`R${row}`]?.v || "",
          });
          row++;
        }

        setStatus("success");
        onDataExtracted({ identitas: identitasData, sdm: sdmData });
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.message || "Gagal membaca file Excel.");
      }
    };
    reader.onerror = () => {
      setStatus("error");
      setErrorMsg("Gagal membaca file.");
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="panel" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed', borderColor: 'var(--secondary)' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
        <UploadCloud size={64} color="var(--primary)" />
      </div>
      <h2 style={{ marginBottom: '0.5rem' }}>Upload Excel Costing Tool</h2>
      <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1rem' }}>
        Pilih file format .xlsx untuk mengisi form secara otomatis.
      </p>
      
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id="excel-upload-real"
        ref={fileInputRef}
      />
      
      <button 
        className="btn btn-primary" 
        onClick={() => fileInputRef.current?.click()}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Memproses..." : "Pilih File Excel"}
      </button>

      {status === "success" && (
        <div style={{ marginTop: '1rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <CheckCircle size={20} /> Data berhasil diekstrak! Klik "Selanjutnya".
        </div>
      )}
      {status === "error" && (
        <div style={{ marginTop: '1rem', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <AlertCircle size={20} /> {errorMsg}
        </div>
      )}
    </div>
  );
}
