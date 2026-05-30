<script lang="ts">
    import type { models } from "../lib/models";
    import RankingTable from "../components/ranking/RankingTable.svelte";
    import { getI18n } from "../lib/i18n";

    interface Props {
        rankings: models.Rating[];
        season: number;
    }

    let { rankings, season }: Props = $props();
    const t = getI18n();
</script>

<div class="container">
    <h1>
        S{season} {$t("ranking")}
    </h1>
    <RankingTable {rankings} />
    <a class="linkbtn" href="/ranking/season"> {$t("ranking_by_season")} </a>
</div>
