const fs = require("fs");
const _ = require("underscore");
const parseMatchPdf = require("./parseMatchPDF");
const matchesJson = require("../ui/data/matches.json");

const generateMatchDataJson = async () => {
  const pdfFileNames = fs.readdirSync("./matches/pdf");
  const jsonFileNames = Object.keys(matchesJson);
  const jsonFilesRequired = _.difference(pdfFileNames, jsonFileNames);

  for (const fileName of jsonFilesRequired) {
    matchesJson[fileName.split(".")[0]] = await parseMatchPdf(
      "./matches/pdf/" + fileName
    );
  }

  await fs.writeFileSync(
    "./ui/data/matches.json",
    JSON.stringify(matchesJson, null, 4),
    {
      encoding: "utf8",
    }
  );
};

generateMatchDataJson();
