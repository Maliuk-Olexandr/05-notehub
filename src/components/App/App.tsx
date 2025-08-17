import css from './App.module.css';
import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import { createNote, fetchNotes } from '../../services/noteService';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import NoteForm from '../NoteForm/NoteForm';
import Modal from '../Modal/Modal';

export default function App() {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [modal, setModal] = useState<boolean>(false);
  const perPage = 12;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (note: Parameters<typeof createNote>[0]) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setModal(false);
    },
  });

  const handleCreate = (note: Parameters<typeof createNote>[0]) => {
    mutation.mutate(note);
  };

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', { debouncedSearch, page }],
    queryFn: () => fetchNotes({ search: debouncedSearch, page, perPage }),
    placeholderData: keepPreviousData,
    enabled: true,
  });

  const totalPages = data?.totalPages || 0;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onSearchChange={setSearch} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
          />
        )}
        <button className={css.button} onClick={() => setModal(true)}>
          Create note +
        </button>
      </header>
      <main className={css.main}>
        {isLoading && <Loader />}
        {!isLoading && isError && <ErrorMessage />}
        {isSuccess && data?.notes?.length > 0 && (
          <NoteList notes={data.notes} />
        )}
      </main>
      {modal && (
        <Modal onClose={() => setModal(false)}>
          <NoteForm onSubmit={handleCreate} onCancel={() => setModal(false)} />
        </Modal>
      )}
    </div>
  );
}
