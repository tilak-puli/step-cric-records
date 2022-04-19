const fs = require("fs");
const _ = require("underscore");
const parseMatchPdf = require("./parseMatchPDF");
let matchesJson = require("../ui/data/matches.json");

function checkDuplicate() {
  for (let i in matchesJson) {
    for (let j in matchesJson) {
      if (i === j) {
        break;
      }
      let match = matchesJson[i];
      let match1 = matchesJson[j];
      if (
        match.team1Name === match1.team1Name &&
        match.team2Name === match1.team2Name &&
        JSON.stringify(match.team1.score) ===
          JSON.stringify(match1.team1.score) &&
        JSON.stringify(match.team2.score) === JSON.stringify(match1.team2.score)
      ) {
        console.error(
          "Found duplicate match: " + match1.matchFileNameIdentifier
        );
      }
    }
  }
}

const generateMatchDataJson = async () => {
  console.log("Started parsing pdfs");
  const pdfFileNames = fs.readdirSync("./matches/pdf");
  const jsonFileNames = matchesJson.map((m) => m.matchFileNameIdentifier);
  const jsonFilesRequired = _.difference(pdfFileNames, jsonFileNames);

  for (const fileName of jsonFilesRequired) {
    matchesJson.push({
      ...(await parseMatchPdf("./matches/pdf/" + fileName)),
      matchFileNameDate: fileName
        .split(".")[0]
        .replace(/-/g, "/")
        .split("(")[0]
        .trim(),
      matchFileNameIdentifier: fileName,
    });
  }

  checkDuplicate();

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

  console.log("Done parsing pdfs");
};

generateMatchDataJson();
