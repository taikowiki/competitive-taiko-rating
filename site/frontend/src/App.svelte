<script lang="ts">
  import {
    Router,
    type Route,
    navigation,
    type RoutingFunction,
  } from "svelte5-router-spa";
  import { onMount, type Component } from "svelte";
  import Layout from "./components/layout/Layout.svelte";

  // Routes
  import Index from "./routes/Index.svelte";
  import Ranking from "./routes/Ranking.svelte";
  import RankingSeasonList from "./routes/ranking/Season.svelte";
  import RankingSeasonDetail from "./routes/ranking/season/Season.svelte";
  import About from "./routes/About.svelte";
  import type { models } from "./lib/i18n/models";

  const route: Route = {
    "/": async () => {
      const session: models.Session = await fetch('/api/v1/current/session').then((e) => e.json())
      const hirobaCompeIds = await fetch('/api/v1/current/compeid').then((e) => e.json())
      return { component: Index, props: { session, hirobaCompeIds } };
    },
    "/ranking": async () => {
      const res = await fetch("/api/v1/ranking/current");
      const data = await res.json();
      return { component: Ranking, props: { rankings: data } };
    },
    "/ranking/season": async () => {
      const res = await fetch("/api/v1/history/seasons");
      const data = await res.json();
      return { component: RankingSeasonList, props: { seasons: data } };
    },
    "/ranking/season/:season": async (param) => {
      const res = await fetch(`/api/v1/ranking/season/${param?.season}`);
      const data = await res.json();
      return {
        component: RankingSeasonDetail,
        props: { season: param?.season, rankings: data },
      };
    },
    "/about": () => ({ component: About, props: {} }),
  };

  onMount(() => {
    navigation.setupLink();
  });
</script>

<Layout>
  <Router {route} />
</Layout>
