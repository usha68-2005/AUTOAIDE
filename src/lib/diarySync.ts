// src/lib/diarySync.ts
import { DiaryEntry } from "@/types";

const API_URL = "http://localhost:5000/api/diary";

export async function syncDiaryEntry(entry: DiaryEntry) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: entry.date,
        mood: entry.mood,
        content: entry.content,
        createdAt: entry.createdAt,
      }),
    });
  } catch (error) {
    console.error("Diary backend sync failed", error);
  }
}
