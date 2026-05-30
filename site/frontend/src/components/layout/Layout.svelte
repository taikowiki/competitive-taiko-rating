<script lang="ts">
    import type { Snippet } from "svelte";
    import Header from "./Header.svelte";
    import { layout } from "../../lib/layout";
    import Footer from "./Footer.svelte";
    import { useI18n } from "../../lib/i18n";

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();

    layout.useLang();
    layout.useIsMobile();
    useI18n();
</script>

<Header />
<main>
    {@render children?.()}
</main>
<Footer/>

<style>
    main {
        padding: 10px;
        min-height: calc(100vh - 110px);
        max-width: 1000px;
        margin-inline: auto;
    }
</style>
