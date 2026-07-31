import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { GameApp } from "~/components/game/GameApp";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <ClientOnly fallback={<BootFallback />}>
      <GameApp />
    </ClientOnly>
  );
}

function BootFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#030A14",
        color: "#24E0F2",
        fontFamily: "Orbitron, sans-serif",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontSize: 12,
      }}
    >
      Domain link establishing…
    </div>
  );
}
