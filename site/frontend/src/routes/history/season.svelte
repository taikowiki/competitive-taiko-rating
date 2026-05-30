<script lang="ts">
    import type { models } from "../../lib/models";
    import { getI18n } from "../../lib/i18n";

    interface Props {
        sessions: (models.Session & {startDate: string, endDate: string})[];
    }

    let { sessions }: Props = $props();
    const t = getI18n();
    $inspect(sessions)
</script>

<h1>{$t('season_x_records').replace('{season}', sessions[0]?.season.toString() ?? '')}</h1>
<div class="container">
    {#each sessions as session}
        <a class="linkbox" href={`/history/${session.season}/${session.session}`}>
            {$t('session_x').replace('{session}', session.session.toString())}
            <span class="period">
                ({session.startDate} - {session.endDate})
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
