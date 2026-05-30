<script lang="ts">
    import RankingTable from "../../../components/ranking/RankingTable.svelte"
    import type { models } from "../../../lib/models";

    interface Props {
        rankings: models.Rating[];
        season: number;
    }

    let { rankings, season }: Props = $props();
</script>

<div class="container">
    <h1>S{season} 최종 랭킹</h1>
    <RankingTable {rankings} />
</div>