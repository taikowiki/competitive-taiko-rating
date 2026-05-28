<script lang="ts">
    import { t } from '../../lib/i18n';
    import { navigation } from 'svelte5-router-spa';
    import SeasonCard from '../../components/ranking/SeasonCard.svelte';

    // App.svelte fetches and provides these props
    let { seasons = [] } = $props();
</script>

<div class="card">
    <h2>{ $t('past_season_ranking_list') }</h2>
    <p>{ $t('select_season_for_ranking') }</p>

    {#if seasons.length > 0}
        <div class="season-grid">
            {#each seasons as s}
                <SeasonCard season={s} />
            {/each}
        </div>
    {:else}
        <p>{ $t('no_recorded_season') }</p>
    {/if}

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
    .actions {
        margin-top: 2rem;
        border-top: 1px solid #dee2e6;
        padding-top: 1.5rem;
    }
</style>
