<script lang="ts">
    import { navigation } from "svelte5-router-spa";
    import logo from "../../assets/img/layout/logo.png";
    import { layout } from "../../module/layout";

    const lang = layout.getLang();
</script>

<header>
    <div class="header-content">
        <div class="left">
            <img
                class="logo"
                src={logo}
                alt="logo"
                onclick={() => navigation.goto("/")}
                role="presentation"
            />
            <nav>
                <a href="/about">안내</a>
                <a href="/ranking">랭킹</a>
                <a href="/history">기록</a>
            </nav>
        </div>
        <div class="right">
            <select bind:value={$lang}>
                <option value="ko">KR</option>
                <option value="ja">JP</option>
                <option value="en">EN</option>
            </select>
        </div>
    </div>
</header>

<style>
    header {
        background-color: var(--primary-color);
        color: white;
        height: 50px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
</style>
