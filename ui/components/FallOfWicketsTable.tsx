import {TeamData} from "../types/match";
import {useMemo} from "react";
import {capitalize, getIndexName} from "../utils";
import {SimpleTable} from "./SimpleTable";

const columns = [
    {field: "name", headerName: "Name", width: 40},
    {field: "score", headerName: "Score", width: 10},
    {field: "over", headerName: "Over", width: 10},
];

export function FallOfWicketsTable(props: { team: TeamData; date: string }) {
    const rows = useMemo(() => {
        return props.team.fallOfWickets.map((b, i) => ({
            id: i,
            name: capitalize(getIndexName(b.name, props.date)),
            score: b.score,
            over: b.over,
        }));
    }, [props.team.fallOfWickets, props.date]);

    return (
        <SimpleTable columns={columns} rows={rows} />
    );
}
