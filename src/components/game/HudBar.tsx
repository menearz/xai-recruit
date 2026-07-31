import { MISSIONS } from "~/lib/game/missions";
import { useGameStore, useRank } from "~/lib/game/store";

export function HudBar() {
  const callsign = useGameStore((s) => s.callsign);
  const xp = useGameStore((s) => s.totalXp);
  const streak = useGameStore((s) => s.streak);
  const completed = useGameStore((s) => s.completed);
  const rank = useRank();
  const thresholds = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];
  const prevThreshold = thresholds[Math.max(0, rank.level - 1)] ?? 0;
  const span = Math.max(1, rank.nextAt - prevThreshold);
  const pct = Math.min(100, Math.round(((xp - prevThreshold) / span) * 100));

  return (
    <header className="hl-panel" style={{ flexShrink: 0 }}>
      <div
        className="hl-panel__inner"
        style={{
          padding: "var(--space-3) var(--space-4)",
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="telemetry">
            <span className="status-node" />
            OPERATIVE <span className="lit">{callsign}</span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-sm)",
              letterSpacing: "var(--tracking-label)",
              marginTop: 4,
            }}
          >
            {rank.title} · LVL {rank.level}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 140, maxWidth: 280 }}>
          <div
            className="telemetry"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span>
              XP <span className="lit">{xp}</span>
            </span>
            <span>NEXT {rank.nextAt}</span>
          </div>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="stat-row">
          <span className="chip">
            STREAK <span style={{ color: "var(--cyan)" }}>{streak}D</span>
          </span>
          <span className="chip">
            CLEAR{" "}
            <span style={{ color: "var(--cyan)" }}>
              {completed.length}/{MISSIONS.length}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
