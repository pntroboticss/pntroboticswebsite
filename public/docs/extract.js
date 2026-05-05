const fs = require('fs');
const PDFParser = require('pdf2json');

async function extract() {
    const files = fs.readdirSync(__dirname);
    for (const file of files) {
        if (!file.endsWith('.pdf')) continue;
        
        await new Promise((resolve, reject) => {
            const pdfParser = new PDFParser(this, 1);
            pdfParser.on("pdfParser_dataError", errData => {
                console.error(`Error on ${file}:`, errData.parserError);
                resolve();
            });
            pdfParser.on("pdfParser_dataReady", pdfData => {
                fs.writeFileSync(`${__dirname}/${file}.txt`, pdfParser.getRawTextContent());
                console.log(`Extracted: ${file}`);
                resolve();
            });
            pdfParser.loadPDF(`${__dirname}/${file}`);
        });
    }
}
extract();
