import { useEffect } from "react";
import { useGameStore } from "~/lib/game/store";
import { WakeScreen } from "./WakeScreen";
import { NavRail, MobileNav } from "./NavRail";
import { HudBar } from "./HudBar";
import { CommandCenter } from "./CommandCenter";
import { TrackMap } from "./TrackMap";
import { MissionPlayer, DailyMission } from "./MissionPlayer";
import { StatsPanel } from "./StatsPanel";

export function GameApp() {
  const view = useGameStore((s) => s.view);
  const wakeDone = useGameStore((s) => s.wakeDone);
  const activeMissionId = useGameStore((s) => s.activeMissionId);

  useEffect(() => {
    if (wakeDone && view === "wake") {
      useGameStore.setState({ view: "command" });
    }
  }, [wakeDone, view]);

  if (!wakeDone || view === "wake") {
    return <WakeScreen />;
  }

  const showMission =
    view === "mission" || (view === "daily" && !!activeMissionId);

  return (
    <div className="app-shell">
      <div className="data-stream" aria-hidden />
      <div className="scanlines" />
      <div className="game-layout">
        <NavRail />
        <div className="main-stage">
          <HudBar />
          <main style={{ flex: 1, minHeight: 0 }}>
            {view === "command" && <CommandCenter />}
            {view === "tracks" && <TrackMap />}
            {showMission && <MissionPlayer />}
            {view === "daily" && !activeMissionId && <DailyMission />}
            {view === "stats" && <StatsPanel />}
          </main>
          <footer
            className="telemetry"
            style={{
              paddingTop: "var(--space-4)",
              borderTop: "1px solid var(--edge)",
              opacity: 0.8,
            }}
          >
            DOMAIN // xAI RECRUIT PROTOCOL // HARD-LIGHT TRAINING GRID
          </footer>
          <MobileNav />
        </div>
      </div>
    </div>
  );
}
