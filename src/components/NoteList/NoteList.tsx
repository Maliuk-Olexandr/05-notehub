import css from './NoteList.module.css';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { fetchNotes, deleteNote } from '../../services/noteService';

interface NoteListProps {
  page: number;
  perPage: number;
}

export default function NoteList({ page, perPage }: NoteListProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, perPage }],
    queryFn: () => fetchNotes({ page, perPage }),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  
  });

  if (isLoading) {return <p>Loading...</p>;}
  if (isError) {return <p>Error fetching notes</p>;}
  if (!data || data.notes.length === 0) {return null;}

  return (
    <ul className={css.list}>
      {data.notes.map(note => (
        <li
          className={css.listItem}
          key={note.id}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => mutation.mutate(note.id)} disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
