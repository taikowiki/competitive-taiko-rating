<script lang="ts">
    import type { models } from "../lib/models";
    import RankingTable from "../components/ranking/RankingTable.svelte";

    interface Props {
        rankings: models.Rating[];
        season: number;
    }

    let { rankings, season }: Props = $props();
</script>

<div class="container">
    <h1>
        S{season} 랭킹
    </h1>
    <RankingTable {rankings} />
    <a class="linkbtn" href="/ranking/season"> 시즌 별 랭킹 </a>
</div>
