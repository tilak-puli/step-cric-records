const fs = require("fs");
const _ = require("underscore");
const parseMatchPdf = require("./parseMatchPDF");
const parseMatchJSON = require("./parseMatchJSON");
const scoredBoardSvgTemplate = fs.readFileSync("./scripts/scoredcard.svg", "utf-8");

let monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getMetaImagesIndexList = function () {
  return fs.readdirSync("./ui/public/metaImages").map(filename => filename.split("_")[1].split(".")[0]);
};

const getMatchesJson = function () {
  const fileNames = fs
    .readdirSync("./ui/data")
    .filter((n) => n.match(/matches\d+\.json/));

  let matches = [];

  for (let fileName of fileNames) {
    const data = fs.readFileSync("./ui/data/" + fileName, "utf-8");
    matches = matches.concat(JSON.parse(data));
  }

  return matches;
};

function checkDuplicate(matchesJson) {
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

async function createDataIndexFile(fileNameIndex) {
  const imports = _.times(
    fileNameIndex + 1,
    (n) => `import matches${n}  from "./matches${n}.json";`
  ).join("\n");

  const exports =
    "[" + _.times(fileNameIndex + 1, (n) => "...matches" + n).join(", ") + "]";

  await fs.writeFileSync(
    "./ui/data/allMatches.ts",
    imports + "\n" + "export default " + exports,
    {
      encoding: "utf8",
    }
  );
}

async function saveJson(fileName, data) {
  await fs.writeFileSync(fileName, JSON.stringify(data, null, 4), {
    encoding: "utf8",
  });
}

async function saveMatch(matchesJson, requiredFileNames) {
  const fileNameIndex = Math.floor(matchesJson.length / 25);
  const chunks = _.chunk(matchesJson, 25);
  const lastChunk = chunks.at(-1);
  const saveAll = !lastChunk
    .map((m) => m.matchFileNameIdentifier)
    .every((f) => requiredFileNames.includes(f));

  console.log("writing to matches json");

  if (saveAll) {
    for (let chunkIndex in chunks) {
      await saveJson(
        "./ui/data/matches" + chunkIndex + ".json",
        chunks[chunkIndex]
      );
    }
  } else {
    await saveJson("./ui/data/matches" + fileNameIndex + ".json", lastChunk);
  }

  await createDataIndexFile(fileNameIndex);
}

function convertFileNameToDate(fileName) {
  return fileName.split(".")[0].replace(/-/g, "/").split("(")[0].trim();
}

async function getParsedMatch(fileName) {
  let data;

  if (fileName.split(".")[1] === "json") {
    data = await parseMatchJSON("./matches/" + fileName);
  } else {
    data = await parseMatchPdf("./matches/" + fileName);
  }

  return {
    ...data,
    matchFileNameDate: convertFileNameToDate(fileName),
    matchFileNameIdentifier: fileName,
  };
}

function getNewMatches(matchesJson, pdfFileNames) {
  const jsonFileNames = matchesJson.map((m) => m.matchFileNameIdentifier);
  return _.difference(pdfFileNames, jsonFileNames);
}

function getMissingMetaImagesIndexes(existingMetaImageIndexes, allMatches) {
  return _.difference(Object.keys(allMatches), existingMetaImageIndexes);
}

const formatDate = (date) => {
  let day = date.getDate();
  let monthIndex = date.getMonth();
  let monthName = monthNames[monthIndex];
  let year = date.getFullYear();

  return `${day} ${monthName}, ${year}`;
};

async function createMetaSvg(match) {
  const date = formatDate(new Date(match.matchFileNameDate))
  let svg = scoredBoardSvgTemplate;

  let team1Overs = match.team1.score.overs;
  let team2Overs = match.team2.score.overs;

  //checking if float numbers
  if (!(Number.isInteger(team1Overs) && Number.isInteger(team2Overs))) {
    team1Overs = team1Overs.toFixed(1)
    team2Overs = team2Overs.toFixed(1)
  }

  svg = svg.replace("17 Aug, 2023", date)
    .replace("Swamiji", match.team1.name)
    .replace("Tilak", match.team2.name)
    .replace("(15)", `(${team1Overs})`)
    .replace("(15)", `(${team2Overs})`)
    .replace("112/7", `${match.team1.score.runs}/${match.team1.score.wickets}`)
    .replace("109/7", `${match.team2.score.runs}/${match.team2.score.wickets}`)
    .replace("Swamiji won by 3 runs", `${match.result}`)

  return svg
}

const main = async () => {
  console.log("Started parsing pdfs");
  const pdfFileNames = fs.readdirSync("./matches");

  let matchesJson = getMatchesJson();
  const newMatchFileNames = getNewMatches(matchesJson, pdfFileNames);
  const missingMetaImagesIndexes = getMissingMetaImagesIndexes(getMetaImagesIndexList(), matchesJson);

  for (const fileName of newMatchFileNames) {
    matchesJson.push(await getParsedMatch(fileName));
  }

  for (const missingIndex of missingMetaImagesIndexes) {
    const svg = await createMetaSvg(matchesJson[missingIndex]);
    fs.writeFileSync(`./ui/public/metaImages/scoreboard_${missingIndex}.svg`, svg, "utf-8")
  }

  checkDuplicate(matchesJson);

  matchesJson = matchesJson.sort(
    (match1, match2) =>
      new Date(match1.matchFileNameDate) - new Date(match2.matchFileNameDate)
  );

  if (newMatchFileNames.length > 0) {
    await saveMatch(matchesJson, newMatchFileNames);
  }

  console.log("Done parsing pdfs");
};

main();
