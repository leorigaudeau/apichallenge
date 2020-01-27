const bodyParser = require("body-parser");
const express = require("express");
let fs = require("fs"),
  PDFParser = require("pdf2json");
const app = express();

app.use(bodyParser.json());

app.get("/ss", (req, res) => {
  res.send('{json:"dd"}')
});

app.get("/reader/:start?/:end?", (req, res) => {
  let pdfParser = new PDFParser();

  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
  pdfParser.on("pdfParser_dataReady", pdfData => {

    let start = req.params.start ? req.params.start : 0;
    console.log(start);
    let end = req.params.end ? req.params.end : pdfData.formImage.Pages.length;
    let index = 0;
    let newJson = {
      data: []
    };

    while (start < end) {
      newJson.data.push({
        content: [],
        idPage: start
      });
      let elements = newJson.data[index];
      let j = 0;
      while (j < pdfData.formImage.Pages[start].Texts.length) {
        elements.content.push(decodeURI(pdfData.formImage.Pages[start].Texts[j].R[0].T));
        j++;
      }
      start++;
      index++;
    }
    res.send(newJson);
  });

  pdfParser.loadPDF("./cha48.pdf");
});

// Start server
app.listen(process.env.PORT || 5006, () => {
  console.log(`Server listening`, process.env.PORT || 5006);
});
