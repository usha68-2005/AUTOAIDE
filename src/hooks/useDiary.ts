import { useCallback } from "react";
import { DiaryEntry, Mood } from "@/types";
import { useLocalStorage } from "./useLocalStorage";
import { syncDiaryEntry } from "@/lib/diarySync"; // ✅ backend sync

export function useDiary() {
  const [entries, setEntries] =
    useLocalStorage<DiaryEntry[]>("autoaide-diary", []);

  // ✅ ADD ENTRY (local + backend)
  const addEntry = useCallback(
    async (entryData: Omit<DiaryEntry, "id" | "createdAt">) => {
      const newEntry: DiaryEntry = {
        ...entryData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      // ✅ keep existing localStorage behavior
      setEntries((prev) => [newEntry, ...prev]);

      // ✅ IMPORTANT: await backend sync
      await syncDiaryEntry(newEntry);

      return newEntry;
    },
    [setEntries]
  );

  const updateEntry = useCallback(
    (id: string, updates: Partial<DiaryEntry>) => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry
        )
      );
    },
    [setEntries]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    },
    [setEntries]
  );

  const getEntryByDate = useCallback(
    (date: string) => {
      return entries.find((entry) => entry.date === date);
    },
    [entries]
  );

  const getMoodStats = useCallback(() => {
    const moodCounts: Record<Mood, number> = {
      happy: 0,
      neutral: 0,
      stressed: 0,
      tired: 0,
    };

    entries.forEach((entry) => {
      moodCounts[entry.mood]++;
    });

    return moodCounts;
  }, [entries]);

  const getRecentEntries = useCallback(
    (count: number = 7) => {
      return entries.slice(0, count);
    },
    [entries]
  );

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryByDate,
    getMoodStats,
    getRecentEntries,
  };
}
