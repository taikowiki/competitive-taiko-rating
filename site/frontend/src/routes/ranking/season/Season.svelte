<script lang="ts">
    import { t } from '../../../lib/i18n';
    import { navigation } from 'svelte5-router-spa';
    import RankingTable from '../../../components/ranking/RankingTable.svelte';

    // App.svelte fetches and provides these props
    let { season, rankings = [] } = $props();
</script>

<div class="card">
    <h2>S{season} { $t('final_ranking') }</h2>
    <RankingTable {rankings} />

    <div class="actions">
        <button class="btn btn-secondary" onclick={() => navigation.goto('/ranking/season')}>
            { $t('back_to_season_list') }
        </button>
    </div>
</div>

<style>
    .actions {
        margin-top: 2rem;
        border-top: 1px solid #dee2e6;
        padding-top: 1.5rem;
    }

    .btn-secondary {
        background-color: var(--sidebar-bg);
        border: 1px solid var(--border-color);
        color: var(--text-color);
    }

    .btn-secondary:hover {
        background-color: var(--hover-color);
    }
</style>
