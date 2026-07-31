import { TRACKS, MISSIONS, missionsForTrack } from "~/lib/game/missions";
import { useGameStore } from "~/lib/game/store";

export function CommandCenter() {
  const completed = useGameStore((s) => s.completed);
  const selectTrack = useGameStore((s) => s.selectTrack);
  const setView = useGameStore((s) => s.setView);
  const startMission = useGameStore((s) => s.startMission);
  const isUnlocked = useGameStore((s) => s.isUnlocked);
  const ensureDaily = useGameStore((s) => s.ensureDaily);
  const dailyDoneDate = useGameStore((s) => s.dailyDoneDate);
  const today = new Date().toISOString().slice(0, 10);
  const dailyReady = dailyDoneDate !== today;

  const nextMission = MISSIONS.find(
    (m) => isUnlocked(m.id) && !completed.includes(m.id),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p className="telemetry" style={{ marginBottom: varSpace2 }}>
          <span className="lit">COMMAND</span> · RECRUIT PROTOCOL ACTIVE
        </p>
        <h2 style={{ margin: 0, fontSize: "var(--text-lg)" }}>Command Center</h2>
        <p style={{ color: "var(--text-dim)", marginTop: "var(--space-2)", maxWidth: 520 }}>
          Clear training tracks to build the skill stack for Member of Technical
          Staff — Model Training. Every mission is a protocol you can execute with
          your hands, not just your eyes.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: "var(--space-4)",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <div className="hl-panel">
          <div className="hl-panel__inner" style={{ padding: "var(--space-4)" }}>
            <div className="telemetry" style={{ marginBottom: "var(--space-2)" }}>
              NEXT OBJECTIVE
            </div>
            {nextMission ? (
              <>
                <h3 style={{ margin: 0, fontSize: "var(--text-md)" }}>
                  {nextMission.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "var(--text-sm)",
                    margin: "var(--space-2) 0 var(--space-4)",
                  }}
                >
                  {nextMission.intel}
                </p>
                <button
                  type="button"
                  className="hl-btn hl-btn--primary"
                  onClick={() => startMission(nextMission.id)}
                >
                  Engage · +{nextMission.xp} XP
                </button>
              </>
            ) : (
              <p style={{ color: "var(--cyan)" }}>
                All protocols cleared. Maintain daily ops.
              </p>
            )}
          </div>
        </div>

        <div className="hl-panel">
          <div className="hl-panel__inner" style={{ padding: "var(--space-4)" }}>
            <div className="telemetry" style={{ marginBottom: "var(--space-2)" }}>
              DAILY OPS
            </div>
            <h3 style={{ margin: 0, fontSize: "var(--text-md)" }}>
              {dailyReady ? "Challenge Available" : "Challenge Complete"}
            </h3>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "var(--text-sm)",
                margin: "var(--space-2) 0 var(--space-4)",
              }}
            >
              {dailyReady
                ? "One high-signal drill. Streak fuel + bonus XP."
                : "Return tomorrow for a new randomized protocol."}
            </p>
            <button
              type="button"
              className="hl-btn hl-btn--primary"
              disabled={!dailyReady}
              onClick={() => {
                ensureDaily();
                setView("daily");
              }}
            >
              {dailyReady ? "Open Daily" : "Locked"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div
          className="telemetry"
          style={{ marginBottom: "var(--space-3)" }}
        >
          TRAINING TRACKS
        </div>
        <div className="mission-grid">
          {TRACKS.map((t) => {
            const list = missionsForTrack(t.id);
            const done = list.filter((m) => completed.includes(m.id)).length;
            const total = list.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <button
                key={t.id}
                type="button"
                className="mission-card"
                style={{ background: "none", border: "none", padding: 0, textAlign: "left" }}
                onClick={() => selectTrack(t.id)}
              >
                <div className="hl-panel">
                  <div
                    className="hl-panel__inner"
                    style={{ padding: "var(--space-4)" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "var(--space-3)",
                      }}
                    >
                      <span
                        className="telemetry lit"
                        style={{ fontSize: "var(--text-lg)" }}
                      >
                        {t.icon}
                      </span>
                      <span className="chip">{t.codename}</span>
                    </div>
                    <h3
                      style={{
                        margin: "var(--space-3) 0 var(--space-2)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {t.name}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-dim)",
                        fontSize: "var(--text-xs)",
                        margin: "0 0 var(--space-3)",
                        lineHeight: 1.5,
                      }}
                    >
                      {t.blurb}
                    </p>
                    <div className="xp-track">
                      <div className="xp-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div
                      className="telemetry"
                      style={{ marginTop: "var(--space-2)" }}
                    >
                      {done}/{total} CLEARED
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const varSpace2 = "var(--space-2)";
