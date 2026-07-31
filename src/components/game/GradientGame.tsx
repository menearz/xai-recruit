import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  targetW: number;
  targetB: number;
  tolerance: number;
  onSuccess: () => void;
}

/** Synthetic data around y = targetW * x + targetB */
function makeData(tw: number, tb: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const x = i * 0.8;
    const noise = Math.sin(i * 1.7) * 0.15;
    pts.push({ x, y: tw * x + tb + noise });
  }
  return pts;
}

function mse(
  w: number,
  b: number,
  pts: { x: number; y: number }[],
): number {
  let s = 0;
  for (const p of pts) {
    const err = w * p.x + b - p.y;
    s += err * err;
  }
  return s / pts.length;
}

export function GradientGame({
  targetW,
  targetB,
  tolerance,
  onSuccess,
}: Props) {
  const [w, setW] = useState(0);
  const [b, setB] = useState(0);
  const [won, setWon] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pts = useMemo(() => makeData(targetW, targetB), [targetW, targetB]);
  const cost = mse(w, b, pts);
  const targetCost = mse(targetW, targetB, pts);
  const good = cost <= targetCost + tolerance;

  useEffect(() => {
    if (good && !won) {
      setWon(true);
      onSuccess();
    }
  }, [good, won, onSuccess]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = rect.width;
    const H = rect.height;

    ctx.fillStyle = "#081119";
    ctx.fillRect(0, 0, W, H);

    // grid
    ctx.strokeStyle = "rgba(36,224,242,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const x = (i / 5) * W;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
      const y = (i / 5) * H;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    const xMax = 6;
    const yMin = -2;
    const yMax = 16;
    const toX = (x: number) => (x / xMax) * (W - 40) + 20;
    const toY = (y: number) => H - 20 - ((y - yMin) / (yMax - yMin)) * (H - 40);

    // ideal line
    ctx.strokeStyle = "rgba(15,184,166,0.45)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(targetB));
    ctx.lineTo(toX(xMax), toY(targetW * xMax + targetB));
    ctx.stroke();
    ctx.setLineDash([]);

    // player line
    ctx.strokeStyle = "#24E0F2";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(36,224,242,0.5)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(b));
    ctx.lineTo(toX(xMax), toY(w * xMax + b));
    ctx.stroke();
    ctx.shadowBlur = 0;

    // points
    for (const p of pts) {
      ctx.fillStyle = "#DCF7FB";
      ctx.beginPath();
      ctx.arc(toX(p.x), toY(p.y), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#24E0F2";
      ctx.stroke();
    }
  }, [w, b, pts, targetW, targetB]);

  return (
    <div className="gd-stage">
      <div>
        <canvas ref={canvasRef} className="gd-plot" />
        <p className="telemetry" style={{ marginTop: "var(--space-2)" }}>
          CYAN = YOUR MODEL · TEAL DASH = TARGET BASIN
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div className="hl-field">
          <span className="hl-field__label">
            Weight w = <span className="telemetry lit">{w.toFixed(2)}</span>
          </span>
          <input
            className="hl-range"
            type="range"
            min={-1}
            max={5}
            step={0.05}
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
            aria-label="Weight"
          />
        </div>
        <div className="hl-field">
          <span className="hl-field__label">
            Bias b = <span className="telemetry lit">{b.toFixed(2)}</span>
          </span>
          <input
            className="hl-range"
            type="range"
            min={-2}
            max={5}
            step={0.05}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            aria-label="Bias"
          />
        </div>
        <div className="hl-panel">
          <div className="hl-panel__inner" style={{ padding: "var(--space-3)" }}>
            <div className="telemetry">
              COST J(w,b){" "}
              <span className={good ? "lit" : "alert"}>{cost.toFixed(3)}</span>
            </div>
            <div className="telemetry" style={{ marginTop: 4 }}>
              THRESHOLD{" "}
              <span className="lit">{(targetCost + tolerance).toFixed(3)}</span>
            </div>
            {good && (
              <p
                style={{
                  color: "var(--cyan)",
                  margin: "var(--space-2) 0 0",
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "var(--tracking-label)",
                }}
              >
                BASIN LOCKED — DESCENT COMPLETE
              </p>
            )}
          </div>
        </div>
        <p style={{ color: "var(--text-dim)", fontSize: "var(--text-sm)", margin: 0 }}>
          Drag sliders to minimize mean squared error. This is manual gradient
          descent — feel the basin.
        </p>
      </div>
    </div>
  );
}
