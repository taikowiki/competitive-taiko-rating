<script lang="ts">
    import type { models } from "../lib/models";
    import { getI18n } from "../lib/i18n";

    interface Props {
        seasons: models.Season[];
    }

    let { seasons }: Props = $props();
    const t = getI18n();
</script>

<h1>{$t('history')}</h1>
<div class="container">
    {#each seasons as season}
        <a class="linkbox" href={`/history/${season.season}`}>
            {$t('season_x').replace('{season}', season.season.toString())}
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
