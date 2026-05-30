<script lang="ts">
    import RankingTable from "../../../components/ranking/RankingTable.svelte";
    import type { models } from "../../../lib/models";

    interface Props {
        histories: models.History[];
        season: number;
        session: number;
    }

    let { histories, season, session }: Props = $props();
    let rankings = $derived.by(() => {
        const rankings: models.Rating[] = [];
        histories.forEach((history, i) => {
            rankings.push({
                taikoNo: history.taikoNo,
                ranking: i + 1,
                rating: history.score,
            });
        });
        return rankings;
    });
    $inspect(rankings, histories)
</script>

<div class="container">
    <h1>
        S{season} #{session} 기록
    </h1>
    <RankingTable {rankings} mode="score" />
</div>
