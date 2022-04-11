const fs = require('fs');
const _ = require("underscore");
const parseMatchPdf = require("./parseMatchPDF");

const generateMatchJsons = async () => {
    const pdfFileNames = fs.readdirSync("./matches/pdf");
    const jsonFileNames = fs.readdirSync("./matches/json");
    const jsonFilesRequired = _.difference(pdfFileNames, jsonFileNames);

    // noinspection ES6MissingAwait
    jsonFilesRequired.forEach(async  (name) => {
        const json = parseMatchPdf("./matches/pdf/" + name);
        await fs.writeFileSync("./matches/json/" + name.split('.')[0] + ".json", JSON.stringify(json));
    })
}

generateMatchJsons();
