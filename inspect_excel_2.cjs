const XLSX = require('xlsx');
const workbook = XLSX.readFile('C:/UCFKTP/Costing_Tool_Updated_Version 29 Mei 2026.xlsx', {cellFormula: true, cellDates: true, cellNF: true});
const calcSheet = workbook.Sheets['Kalkulasi (hide)'];
const identitas = workbook.Sheets['1. IDENTITAS'];

const logCell = (sheet, ref) => {
    const cell = sheet[ref];
    if(cell) {
        console.log(ref, 'Value:', cell.v, 'Formula:', cell.f);
    } else {
        console.log(ref, 'Empty');
    }
}

console.log('--- Kalkulasi (hide) ---');
// Let's search for "Unit Cost" in the Kalkulasi sheet
for (let key in calcSheet) {
    if (key[0] === '!') continue;
    const cell = calcSheet[key];
    if (typeof cell.v === 'string' && cell.v.toLowerCase().includes('unit cost')) {
        console.log('Found:', key, cell.v);
        // print next few rows/cols
    }
}
