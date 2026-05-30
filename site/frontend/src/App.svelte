<script lang="ts">
  import {
    Router,
    type Route,
    navigation,
    type RoutingFunction,
  } from "svelte5-router-spa";
  import { onMount, type Component, type ComponentProps } from "svelte";
  import Layout from "./components/layout/Layout.svelte";

  // Routes
  import Index from "./routes/Index.svelte";
  import Ranking from "./routes/Ranking.svelte";
  import RankingSeasonList from "./routes/ranking/Season.svelte";
  import RankingSeasonDetail from "./routes/ranking/[season]/Season.svelte";
  import About from "./routes/About.svelte";
  import type { models } from "./lib/models";
  import History from "./routes/History.svelte";
  import Season from "./routes/history/season.svelte";
  import Session from "./routes/history/[season]/session.svelte";
  import Player from "./routes/Player.svelte";

  const route: Route = {
    "/": async () => {
      const session: models.Session = await fetch(
        "/api/v1/current/session",
      ).then((e) => e.json());
      const hirobaCompeIds = await fetch("/api/v1/current/compeid").then((e) =>
        e.json(),
      );
      return { component: Index, props: { session, hirobaCompeIds } };
    },
    "/ranking": async () => {
      const rankings = await fetch("/api/v1/ranking").then((e) => e.json());
      const session: models.Session = await fetch(
        "/api/v1/current/session",
      ).then((e) => e.json());
      return {
        component: Ranking,
        props: { rankings, season: session.season },
      };
    },
    "/ranking/season": async () => {
      const res = await fetch("/api/v1/seasons");
      const seasons = await res.json();
      return { component: RankingSeasonList, props: { seasons } };
    },
    "/ranking/season/:season": async (param) => {
      const res = await fetch(`/api/v1/ranking/${param?.season}`);
      const data = await res.json();
      console.log(data);
      return {
        component: RankingSeasonDetail,
        props: { season: param?.season, rankings: data },
      };
    },
    "/history": async () => {
      const seasons: models.Season[] = await fetch("/api/v1/seasons").then(
        (e) => e.json(),
      );
      return {
        component: History,
        props: { seasons },
      };
    },
    "/history/:season": async (params) => {
      const sessions: models.Session[] = await fetch(
        `/api/v1/sessions?season=${params?.season}`,
      ).then((e) => e.json());
      return {
        component: Season,
        props: { sessions },
      };
    },
    "/history/:season/:session": async (params) => {
      const props: ComponentProps<typeof Session> = await fetch(
        `/api/v1/history?season=${params?.season}&session=${params?.session}`,
      ).then((e) => e.json());
      return {
        component: Session,
        props,
      };
    },
    "/about": () => ({ component: About, props: {} }),
    "/player/:taikoNo": async (params) => {
      const player: models.PlayerDetail = await fetch(
        `/api/v1/player/${params?.taikoNo}`,
      ).then((res) => res.json());
      return {
        component: Player,
        props: { player },
      };
    },
  };

  onMount(() => {
    navigation.setupLink();
  });
</script>

<Layout>
  <Router {route} />
</Layout>
