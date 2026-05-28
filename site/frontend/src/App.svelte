<script lang="ts">
  import { Router, type Route, navigation } from "svelte5-router-spa";
  import { onMount } from "svelte";
  import Layout from "./components/layout/Layout.svelte";
  
  // Routes
  import Index from "./routes/Index.svelte";
  import Ranking from "./routes/Ranking.svelte";
  import RankingSeasonList from "./routes/ranking/Season.svelte";
  import RankingSeasonDetail from "./routes/ranking/season/Season.svelte";
  import About from "./routes/About.svelte";

  const route: Route = {
    "/": async () => {
      const res = await fetch("/api/v1/competition/latest");
      const data = await res.json();
      return { component: Index, props: data };
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
