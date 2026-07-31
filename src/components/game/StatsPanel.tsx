import { TRACKS, MISSIONS, missionsForTrack } from "~/lib/game/missions";
import { useGameStore, useRank } from "~/lib/game/store";

export function StatsPanel() {
  const completed = useGameStore((s) => s.completed);
  const xp = useGameStore((s) => s.totalXp);
  const streak = useGameStore((s) => s.streak);
  const callsign = useGameStore((s) => s.callsign);
  const resetProgress = useGameStore((s) => s.resetProgress);
  const rank = useRank();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p className="telemetry">
          <span className="lit">TELEMETRY</span> · OPERATIVE RECORD
        </p>
        <h2 style={{ margin: 0 }}>Clearance Stats</h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: "var(--space-4)",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        }}
      >
        {[
          { k: "CALLSIGN", v: callsign },
          { k: "RANK", v: rank.title },
          { k: "LEVEL", v: String(rank.level) },
          { k: "TOTAL XP", v: String(xp) },
          { k: "STREAK", v: `${streak}d` },
          {
            k: "MISSIONS",
            v: `${completed.length}/${MISSIONS.length}`,
          },
        ].map((s) => (
          <div key={s.k} className="hl-panel">
            <div className="hl-panel__inner" style={{ padding: "var(--space-3)" }}>
              <div className="telemetry">{s.k}</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--cyan)",
                  marginTop: 6,
                  letterSpacing: "var(--tracking-label)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {s.v}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="telemetry" style={{ marginBottom: "var(--space-3)" }}>
          TRACK COMPLETION
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {TRACKS.map((t) => {
            const list = missionsForTrack(t.id);
            const done = list.filter((m) => completed.includes(m.id)).length;
            const pct = list.length ? Math.round((done / list.length) * 100) : 0;
            return (
              <div key={t.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span className="telemetry">{t.codename}</span>
                  <span className="telemetry lit">
                    {done}/{list.length}
                  </span>
                </div>
                <div className="xp-track">
                  <div className="xp-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hl-panel">
        <div className="hl-panel__inner" style={{ padding: "var(--space-4)" }}>
          <h3 style={{ marginTop: 0, fontSize: "var(--text-sm)" }}>
            Recruit Doctrine
          </h3>
          <ol
            style={{
              color: "var(--text-dim)",
              fontSize: "var(--text-sm)",
              margin: 0,
              paddingLeft: "1.2rem",
              lineHeight: 1.7,
            }}
          >
            <li>Python + Andrew Ng + Karpathy Zero to Hero</li>
            <li>fast.ai · HF course · PyTorch · nanoGPT</li>
            <li>Unsloth / LoRA on real models</li>
            <li>Ship GitHub + HF Spaces · post progress</li>
            <li>Apply MTS Model Training with artifacts</li>
          </ol>
        </div>
      </div>

      <button
        type="button"
        className="hl-btn hl-btn--danger"
        onClick={() => {
          if (
            typeof window !== "undefined" &&
            window.confirm("Wipe all progress? This cannot be undone.")
          ) {
            resetProgress();
          }
        }}
      >
        Reset Progress
      </button>
    </div>
  );
}
