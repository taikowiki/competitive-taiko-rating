<script lang="ts">
    import { t } from "../lib/i18n";
</script>

<div class="container">
    <h1>{$t("about_title")}</h1>

    <section>
        <h2>{$t("about_intro_title")}</h2>
        <p>{$t("about_intro_desc")}</p>
    </section>

    <section>
        <h2>{$t("about_participation_title")}</h2>
        <p>{$t("about_participation_desc")}</p>
    </section>

    <section>
        <h2>{$t("about_logic_title")}</h2>
        <p>{$t("about_logic_desc1")}</p>
        <p>{$t("about_logic_desc2")}</p>
    </section>

    <section>
        <h2>{$t("about_operation_title")}</h2>
        <p>{$t("about_operation_desc")}</p>
    </section>
</div>

<style>
    h1 {
        margin-block: 10px;
    }
    h2 {
        border-bottom: 2px solid var(--border-color);
        padding-bottom: 0.5rem;
    }

    section {
        margin-bottom: 2rem;
    }
</style>
