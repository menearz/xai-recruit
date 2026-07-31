import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MISSIONS,
  getMission,
  rankForXp,
  type TrackId,
} from "./missions";

export type View =
  | "wake"
  | "command"
  | "tracks"
  | "mission"
  | "daily"
  | "stats";

interface GameState {
  view: View;
  wakeDone: boolean;
  totalXp: number;
  completed: string[];
  streak: number;
  lastPlayDate: string | null;
  dailyId: string | null;
  dailyDoneDate: string | null;
  activeMissionId: string | null;
  selectedTrack: TrackId | null;
  callsign: string;

  completeWake: () => void;
  setView: (v: View) => void;
  setCallsign: (name: string) => void;
  selectTrack: (t: TrackId | null) => void;
  startMission: (id: string) => void;
  completeMission: (id: string, bonusXp?: number) => void;
  isUnlocked: (id: string) => boolean;
  touchStreak: () => void;
  ensureDaily: () => string;
  completeDaily: () => void;
  resetProgress: () => void;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function pickDailyId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return MISSIONS[h % MISSIONS.length]!.id;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      view: "wake",
      wakeDone: false,
      totalXp: 0,
      completed: [],
      streak: 0,
      lastPlayDate: null,
      dailyId: null,
      dailyDoneDate: null,
      activeMissionId: null,
      selectedTrack: null,
      callsign: "CHIEF",

      completeWake: () => set({ wakeDone: true, view: "command" }),
      setView: (v) => set({ view: v }),
      setCallsign: (name) =>
        set({ callsign: name.trim().slice(0, 16).toUpperCase() || "CHIEF" }),
      selectTrack: (t) => set({ selectedTrack: t, view: t ? "tracks" : "command" }),
      startMission: (id) => {
        if (!get().isUnlocked(id)) return;
        get().touchStreak();
        set({ activeMissionId: id, view: "mission" });
      },
      completeMission: (id, bonusXp = 0) => {
        const m = getMission(id);
        if (!m) return;
        const state = get();
        if (state.completed.includes(id)) {
          set({ view: "command", activeMissionId: null });
          return;
        }
        const xpGain = m.xp + bonusXp;
        set({
          completed: [...state.completed, id],
          totalXp: state.totalXp + xpGain,
          activeMissionId: null,
          view: "command",
        });
      },
      isUnlocked: (id) => {
        const m = getMission(id);
        if (!m) return false;
        if (!m.unlockAfter?.length) return true;
        const done = new Set(get().completed);
        return m.unlockAfter.every((req) => done.has(req));
      },
      touchStreak: () => {
        const today = todayKey();
        const { lastPlayDate, streak } = get();
        if (lastPlayDate === today) return;
        if (lastPlayDate === yesterdayKey()) {
          set({ streak: streak + 1, lastPlayDate: today });
        } else {
          set({ streak: 1, lastPlayDate: today });
        }
      },
      ensureDaily: () => {
        const today = todayKey();
        const cur = get().dailyId;
        // rotate daily by date
        const id = pickDailyId(today);
        if (cur !== id) set({ dailyId: id });
        return id;
      },
      completeDaily: () => {
        const today = todayKey();
        if (get().dailyDoneDate === today) return;
        const id = get().ensureDaily();
        const m = getMission(id);
        const bonus = 50;
        get().touchStreak();
        if (m && !get().completed.includes(id)) {
          get().completeMission(id, bonus);
        } else {
          set({
            totalXp: get().totalXp + bonus,
            dailyDoneDate: today,
            view: "command",
            activeMissionId: null,
          });
          return;
        }
        set({ dailyDoneDate: today });
      },
      resetProgress: () =>
        set({
          totalXp: 0,
          completed: [],
          streak: 0,
          lastPlayDate: null,
          dailyId: null,
          dailyDoneDate: null,
          activeMissionId: null,
          selectedTrack: null,
          view: "command",
        }),
    }),
    {
      name: "xai-recruit-progress-v1",
      partialize: (s) => ({
        wakeDone: s.wakeDone,
        totalXp: s.totalXp,
        completed: s.completed,
        streak: s.streak,
        lastPlayDate: s.lastPlayDate,
        dailyId: s.dailyId,
        dailyDoneDate: s.dailyDoneDate,
        callsign: s.callsign,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.wakeDone) {
          state.view = "command";
        }
      },
    },
  ),
);

export function useRank() {
  const xp = useGameStore((s) => s.totalXp);
  return rankForXp(xp);
}
