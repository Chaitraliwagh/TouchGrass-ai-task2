import { useState } from "react";
import LandingPage from "./components/LandingPage.jsx";
import PlannerForm from "./components/PlannerForm.jsx";
import LoadingState from "./components/LoadingState.jsx";
import ActivityCard from "./components/ActivityCard.jsx";
import GoingOutside from "./components/GoingOutside.jsx";
import { generateActivity } from "./services/api.js";

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | form | loading | card | outside
  const [prefs, setPrefs] = useState(null);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  const generate = async (preferences) => {
    setPrefs(preferences);
    setError("");
    setScreen("loading");
    try {
      setPlan(await generateActivity(preferences));
      setScreen("card");
    } catch (err) {
      setError(err.message);
      setScreen("form");
    }
  };

  if (screen === "landing") return <LandingPage onStart={() => setScreen("form")} />;
  if (screen === "loading") return <LoadingState />;
  if (screen === "card")
    return <ActivityCard plan={plan} onGoOutside={() => setScreen("outside")} onRetry={() => generate(prefs)} />;
  if (screen === "outside") return <GoingOutside plan={plan} />;
  return <PlannerForm onSubmit={generate} error={error} initial={prefs} />;
}
