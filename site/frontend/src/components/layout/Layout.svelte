<script lang="ts">
    import type { Snippet } from "svelte";
    import Header from "./Header.svelte";
    import { layout } from "../../module/layout";
    import Footer from "./Footer.svelte";

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();

    layout.useLang();
    layout.useIsMobile();
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
