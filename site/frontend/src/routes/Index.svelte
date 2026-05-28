<script lang="ts">
    import { t } from '../lib/i18n';

    let { 
        competition = null, 
        song1 = '', song1Level = 0, 
        song2 = '', song2Level = 0, 
        song3 = '', song3Level = 0, 
        hirobaCompes = [] 
    } = $props();

    function getDuration(start: string, end: string) {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1;
    }

    function getDiffInfo(diff: string | number) {
        const d = String(diff);
        if (d === '4') return { color: '#DB1885', alias: 'oni' };
        if (d === '5') return { color: '#9568E4', alias: 'ura' };
        return { color: 'inherit', alias: '' };
    }
    let songs = $derived(competition ? [
        { no: competition.songNo1, diff: competition.diff1, title: song1, level: song1Level },
        { no: competition.songNo2, diff: competition.diff2, title: song2, level: song2Level },
        { no: competition.songNo3, diff: competition.diff3, title: song3, level: song3Level }
    ] : []);
</script>

{#if competition}
    <div class="card">
        <h2>{ $t('current_session_info') } (S{competition.season} #{competition.session})</h2>
        <div class="info-grid">
            <p>
                <strong>{ $t('session_period') || 'Session' }:</strong> {competition.startDate} ~ {competition.endDate}
                ({getDuration(competition.startDate, competition.endDate)} { $t('days') })
            </p>
            <!-- Assuming season duration needs another API call or field, for now just placeholder -->
            <p>
                <strong>{ $t('season_period') || 'Season' }:</strong> S{competition.season} { $t('ongoing') || 'Ongoing' }
            </p>
        </div>
        
        <h3>{ $t('specified_songs') }</h3>
        <table>
            <tbody>
                {#each songs as song}
                    {@const diffInfo = getDiffInfo(song.diff)}
                    <tr>
                        <td>
                            <a href="https://taiko.wiki/song/{song.no}?diff={diffInfo.alias}" 
                               style="color: {diffInfo.color}; font-weight: bold;" 
                               target="_blank">
                                {song.level > 0 ? `★${song.level} ` : ''}{song.title}
                            </a>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="card">
        <h2>{ $t('hiroba_links') }</h2>
        {#if hirobaCompes.length > 0}
            <div class="hiroba-links">
                {#each hirobaCompes as compe}
                    <a 
                        href="https://donderhiroba.jp/compe_detail.php?compe_id={compe.compeId}" 
                        target="_blank" 
                        class="btn btn-primary"
                    >
                        { $t('competition_id') }: {compe.compeId}
                    </a>
                {/each}
            </div>
        {:else}
            <p>{ $t('no_hiroba_compes') }</p>
        {/if}
    </div>
{:else}
    <div class="card">
        <p>{ $t('no_competition_info') }</p>
    </div>
{/if}

<style>
    .info-grid {
        margin-bottom: 1.5rem;
    }

    .hiroba-links {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    h3 {
        margin-top: 1.5rem;
        border-left: 4px solid var(--secondary-color);
        padding-left: 0.5rem;
    }
</style>
