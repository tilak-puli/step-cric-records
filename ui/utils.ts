import swapNames from "./data/swapNames.json";
import { Match, MvpDetails, PlayersMvpDetails, TeamData } from "./types/match";
import { numberOfBalls } from "./state/stats";

const swapNamesKeys = Object.keys(swapNames);
const lowerCaseSwapNames = {};
swapNamesKeys.forEach((key) => {
  lowerCaseSwapNames[key.toLowerCase()] = swapNames[key];
});

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
    runsGiven: 0,
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
    playerPoints[name].runsGiven += b.runs;

    playerPoints[name].points += getPointsForRunRate(b.runRate);
    playerPoints[name].points += b.maidens * 2;
  };

  match.team1.batting.forEach(addPointsForRuns);
  match.team2.batting.forEach(addPointsForRuns);
  match.team1.bowling.forEach(addPointsForWickets);
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
    text += `${mvp.wickets}/${mvp.runsGiven} (${mvp.overs})`;
  }

  return { ...mvp, text };
};

function getSwappedName(swapConfig, date, name) {
  if (
    swapConfig?.afterDate &&
    new Date(swapConfig?.afterDate) &&
    !(new Date(date) > new Date(swapConfig?.afterDate))
  ) {
    return name.toLowerCase();
  }

  return new Date(date) < new Date(swapConfig?.beforeDate)
    ? swapConfig?.name?.toLowerCase()
    : name.toLowerCase();
}

export function getIndexName(name, date) {
  const swapConfig = lowerCaseSwapNames[name.toLowerCase()];
  if (!swapConfig) return name.toLowerCase();

  if (Array.isArray(swapConfig)) {
    for (const config of swapConfig) {
      const swappedName = getSwappedName(config, date, name);
      if (swappedName !== name.toLowerCase()) {
        return swappedName;
      }
    }
  }

  return getSwappedName(swapConfig, date, name);
}

function addMatchPointsDetails(
  teams: {},
  name: string,
  team1: TeamData,
  team2: TeamData,
  winner: string,
  tournament: any
) {
  teams[name] = {
    matchesPlayed: (teams[name]?.matchesPlayed ?? 0) + 1,
    matchesWon: (teams[name]?.matchesWon ?? 0) + (name === winner ? 1 : 0),
    runsScored: (teams[name]?.runsScored ?? 0) + team1.score.runs,
    ballsBowled:
      (teams[name]?.ballsBowled ?? 0) +
      (team2.allOut
        ? numberOfBalls(tournament.overs)
        : numberOfBalls(team2.score.overs)),

    ballsPlayed:
      (teams[name]?.ballsPlayed ?? 0) +
      (team1.allOut
        ? numberOfBalls(tournament.overs)
        : numberOfBalls(team1.score.overs)),
    runsGiven: (teams[name]?.runsGiven ?? 0) + team2.score.runs,
  };
}

export function getPointsTable(matches: Match[], tournament: any) {
  const teams = {};
  matches.map((m) => {
    addMatchPointsDetails(
      teams,
      m.team1Name,
      m.team1,
      m.team2,
      m.winner,
      tournament
    );
    addMatchPointsDetails(
      teams,
      m.team2Name,
      m.team2,
      m.team1,
      m.winner,
      tournament
    );
  });

  return teams;
}
