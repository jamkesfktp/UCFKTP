const XLSX = require('xlsx');
const workbook = XLSX.readFile('C:/UCFKTP/Costing_Tool_Updated_Version 29 Mei 2026.xlsx', {cellFormula: true, cellDates: true, cellNF: true});
const calcSheet = workbook.Sheets['Kalkulasi (hide)'];

const logCell = (sheet, ref) => {
    const cell = sheet[ref];
    if(cell) {
        console.log(ref, 'Value:', cell.v, 'Formula:', cell.f);
    } else {
        console.log(ref, 'Empty');
    }
}

console.log('--- Unit Cost Area ---');
logCell(calcSheet, 'O207');
logCell(calcSheet, 'P207');
logCell(calcSheet, 'Q207');
logCell(calcSheet, 'R207');
logCell(calcSheet, 'S207');

console.log('Let us look for other cells with unit cost');
for (let key in calcSheet) {
    if (key[0] === '!') continue;
    const cell = calcSheet[key];
    if (typeof cell.v === 'string' && cell.v.toLowerCase().includes('unit cost')) {
        console.log('Found:', key, cell.v);
        // let's log the value next to it
        const col = key.match(/[A-Z]+/)[0];
        const row = key.match(/[0-9]+/)[0];
        const nextCol = String.fromCharCode(col.charCodeAt(0) + 1);
        logCell(calcSheet, nextCol + row);
    }
}
