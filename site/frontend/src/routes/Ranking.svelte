<script lang="ts">
    import { onMount } from 'svelte';
    import { t } from '../lib/i18n';
    import { navigation } from 'svelte5-router-spa';

    let rankings: any[] = [];
    let loading = true;

    onMount(async () => {
        try {
            const res = await fetch('/api/v1/ranking/current');
            rankings = await res.json();
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    });
</script>

<div class="card">
    <div class="header-with-action">
        <h2>{ $t('overall_rating_ranking') }</h2>
        <button class="btn btn-secondary" onclick={() => navigation.goto('/ranking/season')}>
            { $t('view_past_seasons') }
        </button>
    </div>

    {#if loading}
        <p>Loading...</p>
    {:else if rankings.length > 0}
        <table>
            <thead>
                <tr>
                    <th>{ $t('rank') }</th>
                    <th>{ $t('taiko_no') }</th>
                    <th>{ $t('rating') }</th>
                </tr>
            </thead>
            <tbody>
                {#each rankings as r}
                    <tr onclick={() => navigation.goto(`/player/${r.taikoNo}`)} class="clickable">
                        <td>{r.ranking}</td>
                        <td>{r.taikoNo}</td>
                        <td>{r.rating.toFixed(2)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>{ $t('no_data') }</p>
    {/if}
</div>

<style>
    .header-with-action {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .clickable {
        cursor: pointer;
    }

    .btn-secondary {
        background-color: var(--sidebar-bg);
        border: 1px solid var(--border-color);
        color: var(--text-color);
        font-size: 0.9rem;
    }

    .btn-secondary:hover {
        background-color: var(--hover-color);
    }
</style>
