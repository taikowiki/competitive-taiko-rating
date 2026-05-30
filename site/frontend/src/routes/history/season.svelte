<script lang="ts">
    import type { models } from "../../lib/models";

    interface Props {
        sessions: (models.Session & {startDate: string, endDate: string})[];
    }

    let { sessions }: Props = $props();
    $inspect(sessions)
</script>

<h1>시즌{sessions[0]?.season ?? ''} 기록</h1>
<div class="container">
    {#each sessions as session}
        <a class="linkbox" href={`/history/${session.season}/${session.session}`}>
            세션 {session.session}
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
