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
        match.team1.score === match1.team1.score &&
        match.team2.score === match1.team2.score
      ) {
        console.error("Found duplicate match");
      }
    }
  }
}

const generateMatchDataJson = async () => {
  const pdfFileNames = fs.readdirSync("./matches/pdf");
  const jsonFileNames = matchesJson.map((m) => m.matchFileNameIdentifier);
  const jsonFilesRequired = _.difference(pdfFileNames, jsonFileNames);

  for (const fileName of jsonFilesRequired) {
    matchesJson.push({
      ...(await parseMatchPdf("./matches/pdf/" + fileName)),
      matchFileNameDate: fileName
        .split(".")[0]
        .replaceAll("-", "/")
        .split("(")[0]
        .trim(),
      matchFileNameIdentifier: fileName,
    });
  }

  // checkDuplicate();

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
