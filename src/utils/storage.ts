import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "notes_data";

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  keywords: string[]; // user-defined tags for filtering
};

export async function loadNotes(): Promise<Note[]> {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveNotes(notes: Note[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(notes));
  } catch {
    // silently fail — UI still works with in-memory state
  }
}
