<script lang="ts">
    import type { models } from "../lib/models";
    import { layout } from "../module/layout";

    interface Props {
        session: models.Session | null;
        hirobaCompeIds: string[];
    }

    let { session, hirobaCompeIds }: Props = $props();

    const isMobile = layout.getIsMobile();

    function getDiffColor(diff: '4' | '5') {
        if (diff === '4') return "#DB1885";
        if (diff === '5') return "#7135DB";
        return "inherit";
    }
</script>

<h1>
    태고의 달인 경쟁 레이팅
</h1>
{#if session}
    <div class="container">
        <h2>S{session.season} #{session.session}</h2>
        <div class="period">기간: {session.start} - {session.end}</div>
        <div class="song-container">
            <div class="song-heading">과제곡</div>
            {#each session.songs as song}
                {@const color = getDiffColor(song.diff)}
                <a
                    class="song linkbox"
                    href={`//taiko.wiki/song/${song.songNo}?diff=${song.diff === '4' ? "oni" : "ura"}`}
                    target="_blank"
                >
                    <div class="level" style={`background-color:${color};`}>
                        ★{song.level}
                    </div>
                    <div class="title" style={`color:${color};`}>
                        {song.title}
                    </div>
                </a>
            {/each}
        </div>
    </div>
{:else}
    <div class="container">현재 진행중인 세션이 없습니다.</div>
{/if}

{#if hirobaCompeIds.length}
    <div class="container">
        <h2>동더히로바 대회 링크</h2>
        <div class="link-container" class:is-mobile={$isMobile}>
            {#each hirobaCompeIds as compeId, i}
                <a
                    class="linkbox"
                    href={`https://donderhiroba.jp/compe_detail.php?compeid=${compeId}`}
                    target="_blank"
                >
                    대회 {i + 1}
                </a>
            {/each}
        </div>
    </div>
{/if}

<style>
    h1{
        margin-block: 20px;
    }
    .container {
        margin-bottom: 20px;
    }
    .period {
        font-size: 14px;
    }
    .song-container {
        display: flex;
        flex-direction: column;
        row-gap: 7px;
    }
    .song-heading {
        font-size: 20px;
        font-weight: bold;
    }
    .song {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 6px;
        font-weight: bold;
        background-color: #f1f2f3;
        border-radius: 5px;
        padding: 8px;
    }
    .level {
        padding-inline: 5px;
        color: white;
        border-radius: 5px;
        width: 45px;
        height: 26px;
        text-align: center;
    }

    .link-container {
        display: flex;
        flex-direction: column;
        row-gap: 7px;
    }
</style>
