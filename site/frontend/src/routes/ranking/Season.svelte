<script lang="ts">
    import type { models } from "../../lib/models";
    import { getI18n } from "../../lib/i18n";

    interface Props {
        seasons: models.Season[];
    }

    let { seasons }: Props = $props();
    const t = getI18n();
</script>

<h1>{$t('ranking_by_season')}</h1>
<div class="container">
    {#each seasons.slice(1) as season}
        <a class="linkbox" href={`/ranking/season/${season.season}`}>
            {$t('season_x_records').replace('{season}', season.season.toString())}
            <span class="period">
                ({season.startDate} - {season.endDate})
            </span>
        </a>
    {/each}
</div>

<style>
    h1 {
        margin-block: 20px;
    }
    .linkbox {
        font-weight: bold;
    }

    .period {
        font-size: 14px;
        font-weight: normal;
    }
</style>
