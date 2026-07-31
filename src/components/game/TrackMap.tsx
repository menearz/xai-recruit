import { TRACKS, missionsForTrack } from "~/lib/game/missions";
import { useGameStore } from "~/lib/game/store";

export function TrackMap() {
  const selected = useGameStore((s) => s.selectedTrack);
  const selectTrack = useGameStore((s) => s.selectTrack);
  const completed = useGameStore((s) => s.completed);
  const isUnlocked = useGameStore((s) => s.isUnlocked);
  const startMission = useGameStore((s) => s.startMission);

  if (!selected) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <p className="telemetry">
          <span className="lit">MAP</span> · SELECT A TRACK
        </p>
        <h2 style={{ margin: 0 }}>Training Map</h2>
        <div className="mission-grid">
          {TRACKS.map((t) => {
            const list = missionsForTrack(t.id);
            const done = list.filter((m) => completed.includes(m.id)).length;
            return (
              <button
                key={t.id}
                type="button"
                className="mission-card"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  textAlign: "left",
                }}
                onClick={() => selectTrack(t.id)}
              >
                <div className="hl-panel">
                  <div
                    className="hl-panel__inner"
                    style={{ padding: "var(--space-4)" }}
                  >
                    <span className="chip">{t.codename}</span>
                    <h3
                      style={{
                        margin: "var(--space-3) 0 var(--space-2)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {t.name}
                    </h3>
                    <div className="telemetry">
                      {done}/{list.length} CLEARED
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const track = TRACKS.find((t) => t.id === selected)!;
  const list = missionsForTrack(selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <button
        type="button"
        className="hl-btn hl-btn--sm"
        style={{ alignSelf: "flex-start" }}
        onClick={() => selectTrack(null)}
      >
        ← All Tracks
      </button>
      <p className="telemetry">
        <span className="lit">{track.codename}</span> · {track.name.toUpperCase()}
      </p>
      <h2 style={{ margin: 0 }}>{track.name}</h2>
      <p style={{ color: "var(--text-dim)", margin: 0 }}>{track.blurb}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {list.map((m, i) => {
          const done = completed.includes(m.id);
          const unlocked = isUnlocked(m.id);
          return (
            <button
              key={m.id}
              type="button"
              disabled={!unlocked}
              className={`mission-card ${done ? "mission-card--done" : ""} ${
                !unlocked ? "mission-card--locked" : ""
              }`}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                textAlign: "left",
              }}
              onClick={() => unlocked && !done && startMission(m.id)}
            >
              <div className="hl-panel">
                <div
                  className="hl-panel__inner"
                  style={{
                    padding: "var(--space-4)",
                    display: "flex",
                    gap: "var(--space-4)",
                    alignItems: "center",
                  }}
                >
                  <span
                    className="telemetry lit"
                    style={{ fontSize: "var(--text-lg)", minWidth: 36 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "var(--space-2)",
                        alignItems: "center",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        {m.title}
                      </h3>
                      {done && <span className="chip chip--active">CLEARED</span>}
                      {!unlocked && <span className="chip">LOCKED</span>}
                    </div>
                    <p
                      style={{
                        color: "var(--text-dim)",
                        fontSize: "var(--text-xs)",
                        margin: "var(--space-2) 0 0",
                      }}
                    >
                      {m.intel}
                    </p>
                  </div>
                  <span className="telemetry lit">+{m.xp}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
