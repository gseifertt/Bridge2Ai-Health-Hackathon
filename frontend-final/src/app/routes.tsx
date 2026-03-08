import { createBrowserRouter } from "react-router";
import { Home } from "./screens/Home";
import { Instructions } from "./screens/Instructions";
import { CoughTest } from "./screens/CoughTest";
import { VowelTest } from "./screens/VowelTest";
import { BreathingTest } from "./screens/BreathingTest";
import { HealthForm } from "./screens/HealthForm";
import { Analysis } from "./screens/Analysis";
import { Results } from "./screens/Results";
import { History } from "./screens/History";
import { Profile } from "./screens/Profile";
import { NotFound } from "./screens/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/instructions",
    Component: Instructions,
  },
  {
    path: "/test/cough",
    Component: CoughTest,
  },
  {
    path: "/test/vowel",
    Component: VowelTest,
  },
  {
    path: "/test/breathing",
    Component: BreathingTest,
  },
  {
    path: "/health-info",
    Component: HealthForm,
  },
  {
    path: "/processing",
    Component: Analysis,
  },
  {
    path: "/results",
    Component: Results,
  },
  {
    path: "/history",
    Component: History,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);