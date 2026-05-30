<script lang="ts">
    import { navigation } from "svelte5-router-spa";
    import type { models } from "../../lib/models";

    interface Props {
        rankings: models.Rating[];
        mode: "rating" | "score";
    }

    let { rankings, mode = "rating" }: Props = $props();
</script>

<table>
    <thead>
        <tr>
            <th>랭킹</th>
            <th>북 번호</th>
            <th>{mode === "rating" ? "레이팅" : "점수"}</th>
        </tr>
    </thead>
    <tbody>
        {#each rankings as ranking}
            <tr onclick={() => navigation.goto(`/player/${ranking.taikoNo}`)}>
                <td>{ranking.ranking}</td>
                <td>{ranking.taikoNo}</td>
                <td>{mode === "rating" ? ranking.rating.toFixed(2) : ranking.rating}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }

    thead th {
        padding: 12px 16px;
        font-weight: 600;
        color: #888;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.05em;
        text-align: center;
        border-bottom: 1px solid var(--border-color);
    }

    tbody tr {
        background-color: #fafafa;
        border-bottom: 1px solid #eee;
        transition: background-color 0.15s ease;
        cursor: pointer;
    }

    tbody tr:hover {
        background-color: #f0f0f0;
    }

    td {
        padding: 14px 16px;
        text-align: center;
        font-size: 0.95rem;
        color: var(--text-color);
    }

    /* Rank column styling */
    td:first-child {
        font-weight: 800;
        width: 80px;
    }

    /* Rating column styling */
    td:last-child {
        font-weight: 600;
        color: var(--primary-color);
    }

    /* Improved visibility for Top 3 */
    tbody tr:nth-child(1) td:first-child {
        color: #d4af37; /* Deeper Gold */
    }

    tbody tr:nth-child(2) td:first-child {
        color: #8a8a8a; /* Solid Silver */
    }

    tbody tr:nth-child(3) td:first-child {
        color: #a0522d; /* Sienna Bronze */
    }

    @media (min-width: 768px) {
        td {
            padding: 16px 20px;
        }
    }
</style>
