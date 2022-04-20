export const capitalize = (text: string): string => {
  if (!text) {
    return text;
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (date: Date) => {
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

  let day = date.getDate();

  let monthIndex = date.getMonth();
  let monthName = monthNames[monthIndex];

  let year = date.getFullYear();

  return `${day} ${monthName}, ${year}`;
};

function emptyMVP(name: string): MvpDetails {
  return {
    name,
    points: 0,
    wickets: 0,
    runs: 0,
    balls: 0,
    overs: 0,
    text: "",
  };
}

function getPointsForSR(runRate: number) {
  if (runRate >= 200) {
    return 3;
  }

  if (runRate >= 150) {
    return 2;
  }

  if (runRate >= 100) {
    return 1;
  }
  return 0;
}

function getPointsForRunRate(runRate: number) {
  return runRate <= 3 ? 1 : 0;
}

export const findMvp = (match: Match) => {
  if (!match) {
    return emptyMVP("nil");
  }

  const playerPoints: PlayersMvpDetails = {};
  const addPointsForRuns = (b) => {
    const name = getIndexName(b.name, match.matchFileNameDate);
    if (!playerPoints[name]) {
      playerPoints[name] = emptyMVP(name);
    }

    playerPoints[name].points += b.runs * 1.5;
    playerPoints[name].runs += b.runs;
    playerPoints[name].balls += b.balls;

    playerPoints[name].points += b.runs > 10 ? getPointsForSR(b.runRate) : 0;
    playerPoints[name].points += b.notOut ? 1 : 0;
  };

  const addPointsForWickets = (b) => {
    const name = getIndexName(b.name, match.matchFileNameDate);
    if (!playerPoints[name]) {
      playerPoints[name] = emptyMVP(name);
    }

    playerPoints[name].points += b.wickets * 10;
    playerPoints[name].wickets += b.wickets;
    playerPoints[name].overs += b.overs;

    playerPoints[name].points += getPointsForRunRate(b.runRate);
    playerPoints[name].points += b.maidens * 2;
  };

  match.team1.batting.forEach(addPointsForRuns);
  match.team2.batting.forEach(addPointsForRuns);
  match.team1.bowling.forEach(addPointsForRuns);
  match.team2.bowling.forEach(addPointsForWickets);

  const mvp = Object.entries(playerPoints).reduce((acc, [name, player]) => {
    if (acc.points < player.points) {
      return { ...player, name };
    }

    return acc;
  }, emptyMVP("nil"));

  let text = "";

  if (mvp.runs > 0) {
    text += `${mvp.runs} (${mvp.balls})`;
  }

  if (mvp.wickets > 0) {
    if (mvp.runs > 0) {
      text += ` & `;
    }
    text += `${mvp.wickets} (${mvp.overs})`;
  }

  return { ...mvp, text };
};

import swapNames from "./data/swapNames.json";
import { Match, MvpDetails, PlayersMvpDetails } from "./types/match";

export function getIndexName(name, date) {
  return swapNames[name.toLowerCase()] &&
    new Date(date) < new Date(swapNames[name.toLowerCase()]?.beforeDate)
    ? swapNames[name.toLowerCase()]?.name?.toLowerCase()
    : name.toLowerCase();
}
