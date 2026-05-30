<script lang="ts">
    import { marked } from "marked";
    import { getI18n } from "../lib/i18n";

    const t = getI18n();
    let htmlContent = $derived(marked.parse($t("about_content")) as string);
</script>

<div class="container about">
    {@html htmlContent}
</div>

<style>
    .about {
        margin: 0 auto;
        padding: 20px;
    }

    :global(.about h1) {
        margin-bottom: 30px;
        color: var(--primary-color);
    }

    :global(.about h2) {
        font-size: 1.5rem;
        margin-bottom: 15px;
        border-bottom: 2px solid var(--border-color);
        padding-bottom: 10px;
        color: #333;
    }

    :global(.about p) {
        line-height: 1.6;
        color: #555;
    }

    :global(.about a){
        color: #CF4844;
    }
</style>

