import { useEffect, useState } from "react";
import { useGameStore } from "~/lib/game/store";

export function WakeScreen() {
  const completeWake = useGameStore((s) => s.completeWake);
  const [phase, setPhase] = useState(0);
  const [callsign, setCallsign] = useState("CHIEF");
  const setCallsignStore = useGameStore((s) => s.setCallsign);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="wake-screen">
      <div className="scanlines" />
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-6)",
          padding: "var(--space-6)",
          maxWidth: 420,
        }}
      >
        <div className="wake-glyph" aria-hidden>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-xl)",
              color: "var(--cyan)",
              textShadow: "0 0 12px var(--glow-halo)",
            }}
          >
            Δ
          </span>
        </div>

        {phase >= 1 && (
          <p className="telemetry feedback-burst">
            <span className="lit">DOMAIN LINK</span> · HARD-LIGHT ONLINE
          </p>
        )}

        {phase >= 2 && (
          <div className="feedback-burst" style={{ width: "100%" }}>
            <h1
              style={{
                fontSize: "var(--text-xl)",
                margin: 0,
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              Mission: xAI Recruit
            </h1>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "var(--text-sm)",
                marginTop: "var(--space-3)",
              }}
            >
              Train protocols. Earn clearance. Ship proof of work for Model
              Training Staff.
            </p>
          </div>
        )}

        {phase >= 3 && (
          <div
            className="feedback-burst"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            <label className="hl-field">
              <span className="hl-field__label">Callsign</span>
              <input
                className="hl-input"
                value={callsign}
                maxLength={16}
                onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                aria-label="Callsign"
              />
            </label>
            <button
              type="button"
              className="hl-btn hl-btn--primary"
              onClick={() => {
                setCallsignStore(callsign);
                completeWake();
              }}
            >
              Initialize Training
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
