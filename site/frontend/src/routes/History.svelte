<script lang="ts">
    import type { models } from "../lib/models";

    interface Props {
        seasons: models.Season[];
    }

    let { seasons }: Props = $props();
</script>

<h1>기록</h1>
<div class="container">
    {#each seasons as season}
        <a class="linkbox" href={`/history/${season.season}`}>
            시즌 {season.season}
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
