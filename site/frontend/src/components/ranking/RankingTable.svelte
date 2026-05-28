<script lang="ts">
    import { navigation } from 'svelte5-router-spa';
    export let rankings = [];
</script>

<table>
    <thead>
        <tr>
            <th>순위</th>
            <th>태고 번호</th>
            <th>레이팅</th>
        </tr>
    </thead>
    <tbody>
        {#each rankings as r}
            <tr onclick={() => navigation.goto(`/player/${r.taikoNo}`)} class="clickable">
                <td>{r.ranking}</td>
                <td>{r.taikoNo}</td>
                <td>{r.rating.toFixed(2)}</td>
            </tr>
        {:else}
            <tr>
                <td colspan="3">데이터가 없습니다.</td>
            </tr>
        {/each}
    </tbody>
</table>

<style>
    .clickable {
        cursor: pointer;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
    }
    
    th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--border-color);
    }
</style>
