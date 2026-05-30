<script lang="ts">
    import type { models } from "../lib/models";
    import { layout } from "../lib/layout";
    import { getI18n } from "../lib/i18n";

    interface Props {
        player: models.PlayerDetail;
    }

    let { player }: Props = $props();
    let hirobaURL = $derived(
        `https://donderhiroba.jp/user_profile.php?taiko_no=${player.taikoNo}`,
    );

    const isMobile = layout.getIsMobile();
    const t = getI18n();
</script>

<div class="container">
    {#if player}
        <div class="player-header">
            <div class="avatar">
                <a href={hirobaURL}>
                    <img
                        src="https://img.taiko-p.jp/imgsrc.php?v=&kind=mydon&fn=mydon_{player.taikoNo}"
                        alt="Drum Avatar"
                    />
                </a>
            </div>
            <div class="info">
                <h1>
                    <a href={hirobaURL}>
                        {$t("taiko_no")}: {player.taikoNo}
                    </a>
                </h1>
                <div class="current-stats">
                    <div class="stat-item">
                        <span class="label">{$t("rating")}</span>
                        <span class="value"
                            >{player.currentRating.toFixed(2)}</span
                        >
                    </div>
                    <div class="stat-item">
                        <span class="label">{$t("ranking")}</span>
                        <span class="value">#{player.currentRanking}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="history-section">
            <h2>{$t("season_records")}</h2>
            <table class:is-mobile={$isMobile}>
                <thead>
                    <tr>
                        <th>{$t("season")}</th>
                        <th>{$t("final_rating")}</th>
                        <th>{$t("final_ranking")}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each player.history as h}
                        <tr>
                            <td>Season {h.season}</td>
                            <td>{h.rating.toFixed(2)}</td>
                            <td>#{h.ranking}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <p>{$t("player_not_found")}</p>
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .player-header {
        display: flex;
        gap: 30px;
        align-items: center;
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        margin-bottom: 30px;
    }

    .avatar img {
        width: 150px;
        height: auto;
        border-radius: 8px;
        border: 2px solid #eee;
    }

    .info h1 {
        margin: 0 0 15px 0;
        font-size: 1.5rem;
        color: #333;
    }

    .current-stats {
        display: flex;
        gap: 20px;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
    }

    .stat-item .label {
        font-size: 0.85rem;
        color: #888;
        margin-bottom: 4px;
    }

    .stat-item .value {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary-color);
    }

    .history-section h2 {
        font-size: 1.25rem;
        margin-bottom: 15px;
        color: #333;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    th,
    td {
        padding: 12px 20px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    th {
        background: #f8f9fa;
        font-weight: 600;
        color: #666;
        font-size: 0.9rem;
    }

    tr:last-child td {
        border-bottom: none;
    }

    table.is-mobile  {
        & th, & td{
            padding: 4px 6px;
        }
    }

    @media (max-width: 600px) {
        .player-header {
            flex-direction: column;
            text-align: center;
        }

        .current-stats {
            justify-content: center;
        }
    }
</style>
