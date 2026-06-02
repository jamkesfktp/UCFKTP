const XLSX = require('xlsx');
const wb = XLSX.readFile('C:/UCFKTP/Costing_Tool_Updated_Version 29 Mei 2026.xlsx');
console.log('Sheets:', wb.SheetNames);

const wsMaster = wb.Sheets['Master File (Hide)'];
if (wsMaster) {
  console.log('\n--- Master File (Hide) ---');
  const data = XLSX.utils.sheet_to_json(wsMaster, { header: 1 });
  for (let i = 0; i < Math.min(20, data.length); i++) {
    console.log(`Row ${i+1}:`, data[i]);
  }
} else {
  console.log('No Master File (Hide) sheet found.');
}

const wsKalkulasi = wb.Sheets['Kalkulasi (hide)'];
if (wsKalkulasi) {
  console.log('\n--- Kalkulasi (hide) ---');
  const data = XLSX.utils.sheet_to_json(wsKalkulasi, { header: 1 });
  for (let i = 0; i < Math.min(30, data.length); i++) {
    console.log(`Row ${i+1}:`, data[i]);
  }
}

const wsIdentitas = wb.Sheets['1. IDENTITAS'];
if (wsIdentitas) {
  console.log('\n--- 1. IDENTITAS E20, E21, E22 ---');
  console.log('E20:', wsIdentitas['E20'] ? wsIdentitas['E20'].v : 'undefined');
  console.log('E21:', wsIdentitas['E21'] ? wsIdentitas['E21'].v : 'undefined');
  console.log('E22:', wsIdentitas['E22'] ? wsIdentitas['E22'].v : 'undefined');
}
