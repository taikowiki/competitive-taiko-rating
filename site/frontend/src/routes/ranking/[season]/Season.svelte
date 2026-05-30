<script lang="ts">
    import RankingTable from "../../../components/ranking/RankingTable.svelte"
    import type { models } from "../../../lib/models";
    import { getI18n } from "../../../lib/i18n";

    interface Props {
        rankings: models.Rating[];
        season: number;
    }

    let { rankings, season }: Props = $props();
    const t = getI18n();
</script>

<div class="container">
    <h1>{$t('s_x_final_ranking').replace('{season}', season.toString())}</h1>
    <RankingTable {rankings} />
</div>