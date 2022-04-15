const fs = require("fs");
const _ = require("underscore");
const parseMatchPdf = require("./parseMatchPDF");
let matchesJson = require("../ui/data/matches.json");

const generateMatchDataJson = async () => {
  const pdfFileNames = fs.readdirSync("./matches/pdf");
  const jsonFileNames = matchesJson.map((m) => m.matchFileNameDate);
  const jsonFilesRequired = _.difference(
    pdfFileNames,
    jsonFileNames.map((f) => f + ".pdf")
  );

  for (const fileName of jsonFilesRequired) {
    matchesJson.push({
      ...(await parseMatchPdf("./matches/pdf/" + fileName)),
      matchFileNameDate: fileName.split(".")[0].replaceAll("-", "/"),
    });
  }

  matchesJson = matchesJson.sort(
    (match1, match2) =>
      new Date(match2.matchFileNameDate) - new Date(match1.matchFileNameDate)
  );

  await fs.writeFileSync(
    "./ui/data/matches.json",
    JSON.stringify(matchesJson, null, 4),
    {
      encoding: "utf8",
    }
  );
};

generateMatchDataJson();
