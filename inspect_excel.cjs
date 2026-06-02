const XLSX = require('xlsx');
const workbook = XLSX.readFile('C:/UCFKTP/Costing_Tool_Updated_Version 29 Mei 2026.xlsx', {cellFormula: true, cellDates: true, cellNF: true});
console.log(workbook.SheetNames);
