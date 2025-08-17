import axios from 'axios';
import type { Note, CreateNote } from '../types/note';

export interface FetchNotesResponse {
  totalPages: number;
  notes: Note[];
}

interface FetchNoteParams {
  search?: string;
  page?: number;
  perPage?: number;
}

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN as string;
const apiClient = axios.create({
  baseURL: 'https://notehub-public.goit.study/api/notes',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

//GET notes

export async function fetchNotes(
  params: FetchNoteParams
): Promise<FetchNotesResponse> {
  const { data } = await apiClient.get<FetchNotesResponse>('', { params });
  return data;
}

//POST create note

export async function createNote(note: CreateNote): Promise<Note> {
  const { data } = await apiClient.post<Note>('', note);
  return data;
}

// DELETE note

export async function deleteNote(noteId: string): Promise<{ id: string }> {
  const { data } = await apiClient.delete<{ id: string }>(`/${noteId}`);
  return data;
}

// PATCH note

export async function updateNote(
  noteId: string,
  note: Partial<CreateNote>
): Promise<Note> {
  const { data } = await apiClient.patch<Note>(`/${noteId}`, note);
  return data;
}
