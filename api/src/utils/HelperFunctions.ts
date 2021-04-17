const ExcelJS = require('exceljs');

const readCSV = (filepath) => {
  const workbook = new ExcelJS.Workbook();
  return workbook.csv.readFile(filepath)
    .then(() => workbook);
}

const writeXLSX = (filepath, workbook) => {
  return workbook.xlsx.writeFile(filepath);
}

export const convert = (inFile, outFile) => {
  return readCSV(inFile)
    .then(workbook => writeXLSX(outFile, workbook));
};