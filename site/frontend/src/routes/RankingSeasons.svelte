<script lang="ts">
    import { onMount } from 'svelte';
    import { t } from '../lib/i18n';
    import { navigation } from 'svelte5-router-spa';

    let seasons: number[] = [];
    let loading = true;

    onMount(async () => {
        try {
            const res = await fetch('/api/v1/history/seasons');
            seasons = await res.json();
        } catch (e) {
            console.error(e);
        } finally {
            loading = false;
        }
    });
</script>

<div class="card">
    <h2>{ $t('past_season_ranking_list') }</h2>
    <p>{ $t('select_season_for_ranking') }</p>

    {#if loading}
        <p>Loading...</p>
    {:else if seasons.length > 0}
        <div class="season-grid">
            {#each seasons as s}
                <div class="season-card clickable" onclick={() => navigation.goto(`/ranking/season/${s}`)}>
                    <h3>S{s}</h3>
                    <p>{ $t('view_season_ranking') }</p>
                </div>
            {/each}
        </div>
    {:else}
        <p>{ $t('no_recorded_season') }</p>
    /if}

    <div class="actions">
        <button class="btn btn-primary" onclick={() => navigation.goto('/ranking')}>
            { $t('back_to_current_ranking') }
        </button>
    </div>
</div>

<style>
    .season-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }

    .season-card {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 1.5rem;
        text-align: center;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .season-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        border-color: var(--primary-color);
    }

    .season-card h3 {
        margin: 0 0 0.5rem 0;
        color: var(--primary-color);
    }

    .season-card p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
    }

    .clickable {
        cursor: pointer;
    }

    .actions {
        margin-top: 2rem;
        border-top: 1px solid #dee2e6;
        padding-top: 1.5rem;
    }
</style>
