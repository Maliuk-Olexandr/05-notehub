import axios from 'axios';
import { type Note } from '../types/note';

interface fetchNotesService {
  totalPages: number;
  notes: Note[];
}

const API_URL = 'https://notehub-public.goit.study/api/notes';
const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;

export async function fetchNotes(query?: string, page?: number): Promise<fetchNotesService> {
 try {
   const {data,status} = await axios.get(API_URL, {
     headers: {
       Authorization: `Bearer ${API_KEY}`,
     },
     params: {
       search: query,
       page: page,
     },
   });
   if (status !== 200) {
     throw new Error('Error fetching notes');
   }
   return data;
 } catch (error) {
   console.error('Error fetching notes:', error);
   throw error;
 }
}
