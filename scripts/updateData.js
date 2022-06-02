let matchesJson = require("../ui/data/matches.json");
const fs = require("fs");


const main = async () => {
    const updated = matchesJson.map(match => {
        try {
            match.team1.fallOfWickets = match.team1.fallOfWickets.map(w => ({name: w[0], score: w[1], over: w[2]}))
            match.team2.fallOfWickets = match.team2.fallOfWickets.map(w => ({name: w[0], score: w[1], over: w[2]}))
        } catch {
            console.log(match);
        }

        return match;
    })

    await fs.writeFileSync(
        "./ui/data/matches.json",
        JSON.stringify(updated, null, 4),
        {
            encoding: "utf8",
        }
    );
}

main()
