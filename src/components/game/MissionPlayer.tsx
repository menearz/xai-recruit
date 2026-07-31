import { useCallback, useMemo, useState } from "react";
import { getMission, type Mission } from "~/lib/game/missions";
import { useGameStore } from "~/lib/game/store";
import { GradientGame } from "./GradientGame";

export function MissionPlayer() {
  const id = useGameStore((s) => s.activeMissionId);
  const completeMission = useGameStore((s) => s.completeMission);
  const completeDaily = useGameStore((s) => s.completeDaily);
  const setView = useGameStore((s) => s.setView);
  const mission = id ? getMission(id) : undefined;
  const isDaily =
    useGameStore((s) => s.view) === "daily" ||
    useGameStore((s) => s.dailyId) === id;

  if (!mission) {
    return (
      <div className="hl-panel">
        <div className="hl-panel__inner">
          <p className="telemetry alert">NO MISSION LOADED</p>
          <button type="button" className="hl-btn" onClick={() => setView("command")}>
            Return to Command
          </button>
        </div>
      </div>
    );
  }

  return (
    <MissionBody
      mission={mission}
      onAbort={() => setView("command")}
      onComplete={(bonus) => {
        if (isDaily && useGameStore.getState().view === "daily") {
          // daily path handled separately
        }
        completeMission(mission.id, bonus);
      }}
      onDailyComplete={() => completeDaily()}
      dailyMode={useGameStore.getState().view === "daily"}
    />
  );
}

function MissionBody({
  mission,
  onAbort,
  onComplete,
  onDailyComplete,
  dailyMode,
}: {
  mission: Mission;
  onAbort: () => void;
  onComplete: (bonus?: number) => void;
  onDailyComplete: () => void;
  dailyMode: boolean;
}) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const [choiceState, setChoiceState] = useState<"idle" | "correct" | "wrong">(
    "idle",
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [blankVals, setBlankVals] = useState<Record<string, string>>({});
  const [orderPicked, setOrderPicked] = useState<number[]>([]);
  const [shuffle] = useState(() => {
    if (mission.payload.type !== "order") return [] as number[];
    const idx = mission.payload.items.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j]!, idx[i]!];
    }
    return idx;
  });

  const finish = useCallback(
    (ok: boolean, msg: string) => {
      setFeedback(msg);
      setChoiceState(ok ? "correct" : "wrong");
      if (ok) {
        setResolved(true);
      }
    },
    [],
  );

  const claim = () => {
    if (dailyMode) onDailyComplete();
    else onComplete(choiceState === "correct" ? 10 : 0);
  };

  const p = mission.payload;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div className="telemetry">
        <span className="status-node" />
        MISSION <span className="lit">{mission.id.toUpperCase()}</span>
        {dailyMode && (
          <>
            {" "}
            · <span className="alert">DAILY</span>
          </>
        )}
      </div>
      <h2 style={{ margin: 0, fontSize: "var(--text-lg)" }}>{mission.title}</h2>
      <p style={{ color: "var(--text-dim)", margin: 0 }}>{mission.intel}</p>

      <div className="hl-panel">
        <div className="hl-panel__inner" style={{ padding: "var(--space-4)" }}>
          {p.type === "quiz" && (
            <>
              <p style={{ marginTop: 0, whiteSpace: "pre-wrap" }}>{p.question}</p>
              <div className="choice-list">
                {p.choices.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    disabled={resolved}
                    className={`choice-btn ${
                      selected === i
                        ? i === p.correctIndex
                          ? "choice-btn--correct"
                          : "choice-btn--wrong"
                        : resolved && i === p.correctIndex
                          ? "choice-btn--correct"
                          : ""
                    }`}
                    onClick={() => {
                      setSelected(i);
                      if (i === p.correctIndex) finish(true, p.explain);
                      else finish(false, "Incorrect. Re-read the intel and try again.");
                    }}
                  >
                    <span className="telemetry" style={{ marginRight: 8 }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}

          {p.type === "token" && (
            <>
              <p style={{ marginTop: 0 }}>{p.prompt}</p>
              <div className="code-block" style={{ marginBottom: "var(--space-4)" }}>
                {p.context}
                <span style={{ color: "var(--cyan)" }}> █</span>
              </div>
              <div className="choice-list">
                {p.choices.map((c, i) => (
                  <button
                    key={c}
                    type="button"
                    disabled={resolved}
                    className={`choice-btn ${
                      selected === i
                        ? i === p.correctIndex
                          ? "choice-btn--correct"
                          : "choice-btn--wrong"
                        : ""
                    }`}
                    onClick={() => {
                      setSelected(i);
                      if (i === p.correctIndex) finish(true, p.explain);
                      else finish(false, "Low probability token. Try another.");
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}

          {p.type === "code" && (
            <>
              <p style={{ marginTop: 0 }}>{p.prompt}</p>
              <div className="code-block" style={{ marginBottom: "var(--space-4)" }}>
                {p.template}
              </div>
              <div className="hl-form">
                {p.blanks.map((bl) => (
                  <label key={bl.id} className="hl-field">
                    <span className="hl-field__label">
                      Blank {bl.id} — {bl.hint}
                    </span>
                    <input
                      className="hl-input"
                      value={blankVals[bl.id] ?? ""}
                      disabled={resolved}
                      onChange={(e) =>
                        setBlankVals((v) => ({ ...v, [bl.id]: e.target.value }))
                      }
                    />
                  </label>
                ))}
                {!resolved && (
                  <button
                    type="button"
                    className="hl-btn hl-btn--primary"
                    onClick={() => {
                      const ok = p.blanks.every(
                        (bl) =>
                          (blankVals[bl.id] ?? "").trim().replace(/['"]/g, "") ===
                          bl.answer,
                      );
                      if (ok) finish(true, p.explain);
                      else
                        finish(
                          false,
                          "Values do not match. Check types and indices.",
                        );
                    }}
                  >
                    Submit Payload
                  </button>
                )}
              </div>
            </>
          )}

          {p.type === "bug-hunt" && (
            <>
              <p style={{ marginTop: 0 }}>{p.prompt}</p>
              <div className="code-block">
                {p.lines.map((line, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={resolved}
                    className={`code-line ${
                      selected === i
                        ? i === p.bugLine
                          ? "code-line--bug"
                          : "code-line--ok"
                        : "code-line--ok"
                    }`}
                    style={{
                      width: "100%",
                      background:
                        selected === i
                          ? i === p.bugLine
                            ? "rgba(36,224,242,0.12)"
                            : "rgba(255,176,32,0.12)"
                          : undefined,
                      border: "none",
                      color: "inherit",
                      textAlign: "left",
                    }}
                    onClick={() => {
                      setSelected(i);
                      if (i === p.bugLine) finish(true, p.explain);
                      else finish(false, "That line is valid. Keep scanning.");
                    }}
                  >
                    <span style={{ color: "var(--text-dim)", marginRight: 12 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {line}
                  </button>
                ))}
              </div>
            </>
          )}

          {p.type === "order" && (
            <>
              <p style={{ marginTop: 0 }}>{p.prompt}</p>
              <p className="telemetry" style={{ marginBottom: "var(--space-3)" }}>
                SELECT IN CORRECT SEQUENCE · {orderPicked.length}/
                {p.items.length}
              </p>
              <div className="choice-list">
                {shuffle.map((origIdx) => {
                  const pickedAt = orderPicked.indexOf(origIdx);
                  return (
                    <button
                      key={origIdx}
                      type="button"
                      disabled={resolved || pickedAt >= 0}
                      className="choice-btn"
                      onClick={() => {
                        const next = [...orderPicked, origIdx];
                        setOrderPicked(next);
                        if (next.length === p.correctOrder.length) {
                          const ok = next.every(
                            (v, i) => v === p.correctOrder[i],
                          );
                          if (ok) finish(true, p.explain);
                          else {
                            finish(false, "Sequence mismatch. Reset and rethink.");
                            setTimeout(() => {
                              setOrderPicked([]);
                              setFeedback(null);
                              setChoiceState("idle");
                            }, 1200);
                          }
                        }
                      }}
                    >
                      {pickedAt >= 0 && (
                        <span className="chip" style={{ marginRight: 8 }}>
                          {pickedAt + 1}
                        </span>
                      )}
                      {p.items[origIdx]}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {p.type === "gradient" && (
            <>
              <p style={{ marginTop: 0 }}>{p.prompt}</p>
              <GradientGame
                targetW={p.targetW}
                targetB={p.targetB}
                tolerance={p.tolerance}
                onSuccess={() => finish(true, p.explain)}
              />
            </>
          )}

          {feedback && (
            <div
              className="feedback-burst"
              style={{
                marginTop: "var(--space-4)",
                padding: "var(--space-3)",
                border: "1px solid var(--edge)",
                clipPath: "var(--clip-cell)",
                background: "var(--charcoal)",
              }}
            >
              <div className="telemetry" style={{ marginBottom: 6 }}>
                {choiceState === "correct" ? (
                  <span className="lit">PROTOCOL SUCCESS</span>
                ) : (
                  <span className="alert">RECALIBRATE</span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>{feedback}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
        <button type="button" className="hl-btn" onClick={onAbort}>
          Abort
        </button>
        {resolved && (
          <button
            type="button"
            className="hl-btn hl-btn--primary"
            onClick={claim}
          >
            Claim +{mission.xp}
            {dailyMode ? " (+50 daily)" : " XP"}
          </button>
        )}
      </div>
    </div>
  );
}

export function DailyMission() {
  const ensureDaily = useGameStore((s) => s.ensureDaily);
  const dailyId = useGameStore((s) => s.dailyId);
  const dailyDoneDate = useGameStore((s) => s.dailyDoneDate);
  const startMission = useGameStore((s) => s.startMission);
  const setView = useGameStore((s) => s.setView);
  const id = useMemo(() => dailyId ?? ensureDaily(), [dailyId, ensureDaily]);
  const mission = getMission(id);
  const today = new Date().toISOString().slice(0, 10);
  const done = dailyDoneDate === today;

  // When in daily view and mission active path uses MissionPlayer via start
  if (!done && useGameStore.getState().activeMissionId === id) {
    return <MissionPlayer />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <p className="telemetry">
        <span className="lit">DAILY OPS</span> · ROTATING PROTOCOL
      </p>
      <h2 style={{ margin: 0 }}>Daily Challenge</h2>
      {done ? (
        <div className="hl-panel">
          <div className="hl-panel__inner">
            <p style={{ color: "var(--cyan)" }}>
              Daily cleared. Streak protected. Come back after 00:00 UTC rollover.
            </p>
            <button type="button" className="hl-btn" onClick={() => setView("command")}>
              Return to Command
            </button>
          </div>
        </div>
      ) : mission ? (
        <div className="hl-panel">
          <div className="hl-panel__inner" style={{ padding: "var(--space-4)" }}>
            <span className="chip">{mission.track}</span>
            <h3 style={{ margin: "var(--space-3) 0" }}>{mission.title}</h3>
            <p style={{ color: "var(--text-dim)" }}>{mission.intel}</p>
            <p className="telemetry" style={{ marginBottom: "var(--space-4)" }}>
              REWARD <span className="lit">+{mission.xp + 50} XP</span>
            </p>
            <button
              type="button"
              className="hl-btn hl-btn--primary"
              onClick={() => {
                useGameStore.setState({ view: "daily", activeMissionId: id });
                startMission(id);
                // force daily view for claim path
                useGameStore.setState({ view: "daily", activeMissionId: id });
              }}
            >
              Launch Daily
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
