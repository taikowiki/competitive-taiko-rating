<script lang="ts">
    import type { Snippet } from "svelte";
    import { t, locale } from "../../lib/i18n";
    import logo from "../../assets/img/layout/logo.png";
    import { navigation } from "svelte5-router-spa";

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();
</script>

<header>
    <div class="container header-content">
        <div class="left">
            <img
                class="logo"
                src={logo}
                alt="logo"
                onclick={() => navigation.goto("/")}
                role="presentation"
            />
            <nav>
                <a href="/">{ $t('nav_home') }</a>
                <a href="/ranking">{ $t('nav_ranking') }</a>
                <a href="/history">{ $t('nav_history') }</a>
                <a href="/about">{ $t('nav_about') }</a>
            </nav>
        </div>
        <div class="right">
            <select bind:value={$locale}>
                <option value="ko">KR</option>
                <option value="ja">JP</option>
                <option value="en">EN</option>
            </select>
        </div>
    </div>
</header>

<main class="container">
    {@render children?.()}
</main>

<footer>
    <div class="container">
        <p>© 2026 Competitive Taiko Rating. Not affiliated with BANDAI NAMCO Entertainment Inc.</p>
    </div>
</footer>

<style>
    header {
        background-color: var(--primary-color);
        color: white;
        height: 50px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
    }

    .left {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .logo {
        height: 32px;
        cursor: pointer;
    }

    nav {
        display: flex;
        gap: 1.5rem;
    }

    nav a {
        color: white;
        font-weight: 500;
        transition: opacity 0.2s;
    }

    nav a:hover {
        opacity: 0.8;
    }

    select {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        cursor: pointer;
    }

    select option {
        color: #333;
    }

    main {
        padding-top: 2rem;
        padding-bottom: 4rem;
        min-height: calc(100vh - 110px);
    }

    footer {
        background-color: var(--sidebar-bg);
        border-top: 1px solid var(--border-color);
        padding: 2rem 0;
        text-align: center;
        font-size: 0.9rem;
        color: #666;
    }

    @media (max-width: 768px) {
        .left {
            gap: 1rem;
        }
        nav {
            gap: 0.75rem;
            font-size: 0.9rem;
        }
    }
</style>
