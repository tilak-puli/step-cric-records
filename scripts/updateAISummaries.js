const {BardAPI} = require('bard-api-node');
const latestMatches = require("../ui/data/matches5.json")
const aiSummaries = require("../ui/data/aiSummaries.json")
const fs = require("fs");

const temp_API_cookie = 'aAjZlxKUi3uic7ulPxqQ7vgoFXLJ4FFw56NmbtQGGH4Rl1ab-1vhdzog64kcid9HNgs34Q.';
const assistant = new BardAPI();
const startingText = /.*data json you provided:\n\n/

async function getSummaryFromBardAI(json) {
  await assistant.setSession('__Secure-1PSID', temp_API_cookie);
  const res = await assistant.getBardResponse(`Analyis the below cricket match data json and give me your observations\n${json}`)
  return res.content;
}

// getSummaryFromBardAI()

function compressMatchData(match) {
  return JSON.stringify(match).split("").filter(c => c !== "\t" && c !== "\n" && c !== "").join("");
}

function formatSummary(rawSummary) {
  const summaryCleaned = rawSummary.split(startingText)?.[1] || rawSummary

  return {
    summary: summaryCleaned
  }
}

async function updateAISummaries() {
  for (let match of latestMatches) {
    if (aiSummaries[match.matchFileNameDate]) continue;

    console.log("Getting Summary for " + match.matchFileNameDate)
    const minifiedMatch = compressMatchData(match)
    let summary = await getSummaryFromBardAI(minifiedMatch)
    console.log("Received Summary for " + match.matchFileNameDate)

    if(summary.match(/Response Error/)) {
      process.exit(1)
    }

    aiSummaries[match.matchFileNameDate] = formatSummary(summary)

    // Writing as it's costly to ask bard
    const data = JSON.stringify(aiSummaries, null, 4)
    fs.writeFileSync("./ui/data/aiSummaries.json", data, "utf-8")
  }
}

updateAISummaries()
//
