<script lang="ts">
    import { t } from '../../lib/i18n';
    import { navigation } from 'svelte5-router-spa';

    let { season } = $props();
</script>

<div class="season-card clickable" onclick={() => navigation.goto(`/ranking/season/${season}`)}>
    <h3>S{season}</h3>
    <p>{ $t('view_season_ranking') }</p>
</div>

<style>
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
</style>
