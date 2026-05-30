<script lang="ts">
    import RankingTable from "../../../components/ranking/RankingTable.svelte";
    import type { models } from "../../../lib/models";
    import { getI18n } from "../../../lib/i18n";

    interface Props {
        histories: models.History[];
        season: number;
        session: number;
    }

    let { histories, season, session }: Props = $props();
    const t = getI18n();
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
        {$t('s_x_n_x_records').replace('{season}', season.toString()).replace('{session}', session.toString())}
    </h1>
    <RankingTable {rankings} mode="score" />
</div>
