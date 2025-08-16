import axios, {type AxiosResponse } from 'axios';
import { type Note } from '../types/note';

export interface fetchNotesResponse {
  totalPages: number;
  notes: Note[];
}

interface fetchNoteParams {
  search?: string | undefined;
  page?: number | undefined;
  perPage?: number | undefined;
}

const API_URL = 'https://notehub-public.goit.study/api/notes';
const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;

//GET notes

export async function fetchNotes(
  params: fetchNoteParams
): Promise<fetchNotesResponse> {
  const { search = '', page = 1, perPage = 12 } = params;
  const { data, status } : AxiosResponse<fetchNotesResponse> = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    params: { search, page, perPage },
  });
  if (status !== 200) {
    throw new Error('Error fetching notes');
  }
  return data;
}

//POST create note

type CreateNote = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export async function createNote(note: CreateNote): Promise<Note> {

  const { data, status }: AxiosResponse<Note> = await axios.post(API_URL, note, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  if (status !== 201) {
    throw new Error('Error creating note');
  }
  return data;
}

// DELETE note
export async function deleteNote(noteId: string): Promise<{ id: string }> {
  const { data, status } : AxiosResponse<{ id: string }> = await axios.delete(`${API_URL}/${noteId}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    });
    if (status !== 200) {
      throw new Error('Error deleting note');
  }
  return data;
}

// PATCH note
export async function updateNote(
  noteId: string,
  note: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Note> {
  const { data, status } : AxiosResponse<Note> = await axios.patch(`${API_URL}/${noteId}`, note, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  if (status !== 200) {
    throw new Error('Error updating note');
  }
  return data;
}
