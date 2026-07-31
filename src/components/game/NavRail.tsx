import {
  LayoutDashboard,
  Map,
  Flame,
  BarChart3,
  Crosshair,
} from "lucide-react";
import { useGameStore, type View } from "~/lib/game/store";

const items: { view: View; label: string; Icon: typeof Map }[] = [
  { view: "command", label: "CMD", Icon: LayoutDashboard },
  { view: "tracks", label: "MAP", Icon: Map },
  { view: "daily", label: "DAILY", Icon: Flame },
  { view: "stats", label: "STATS", Icon: BarChart3 },
];

function useNav() {
  const view = useGameStore((s) => s.view);
  const setView = useGameStore((s) => s.setView);
  const selectTrack = useGameStore((s) => s.selectTrack);

  const go = (v: View) => {
    useGameStore.setState({ activeMissionId: null });
    if (v === "tracks") {
      selectTrack(null);
      setView("tracks");
    } else {
      setView(v);
    }
  };

  const isActive = (v: View) => {
    if (v === "tracks") return view === "tracks" || view === "mission";
    if (v === "daily") return view === "daily";
    return view === v;
  };

  return { go, isActive };
}

export function NavRail() {
  const { go, isActive } = useNav();

  return (
    <nav className="nav-rail" aria-label="Primary">
      <div
        className="nav-cell"
        style={{ color: "var(--cyan)", marginBottom: "var(--space-2)" }}
        title="Domain"
      >
        <Crosshair size={22} strokeWidth={1.75} />
      </div>
      {items.map(({ view: v, label, Icon }) => (
        <div key={v} className="nav-cell-wrap">
          <button
            type="button"
            className={`nav-cell ${isActive(v) ? "nav-cell--active" : ""}`}
            onClick={() => go(v)}
            aria-label={label}
            aria-current={isActive(v) ? "page" : undefined}
          >
            <Icon size={20} strokeWidth={1.75} />
          </button>
          <span className="nav-label">{label}</span>
        </div>
      ))}
    </nav>
  );
}

export function MobileNav() {
  const { go, isActive } = useNav();

  return (
    <nav className="mobile-nav" aria-label="Primary mobile">
      {items.map(({ view: v, label, Icon }) => (
        <button
          key={v}
          type="button"
          className={`nav-cell ${isActive(v) ? "nav-cell--active" : ""}`}
          onClick={() => go(v)}
          aria-label={label}
          style={{ width: 64, height: 52, flex: 1 }}
        >
          <div style={{ display: "grid", placeItems: "center", gap: 2 }}>
            <Icon size={18} strokeWidth={1.75} />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 8,
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </span>
          </div>
        </button>
      ))}
    </nav>
  );
}
