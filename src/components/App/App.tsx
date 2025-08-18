import css from './App.module.css';
import { useEffect, useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { createNote, fetchNotes } from '../../services/noteService';

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import NoteForm from '../NoteForm/NoteForm';
import Modal from '../Modal/Modal';
import NoResult from '../NoResult/NoResult';
import type { CreateNote } from '../../types/note';

export default function App() {
  const queryClient = useQueryClient();

  // State
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const perPage = 12;

  // Query
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  const { data, isLoading, isError, isFetching, isSuccess } = useQuery({
    queryKey: ['notes', searchQuery, currentPage],
    queryFn: () =>
      fetchNotes({ search: searchQuery, page: currentPage, perPage }),
    placeholderData: keepPreviousData,
  });

  const mutation = useMutation({
    mutationFn: (note: CreateNote) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setModalOpen(false);
    },
  });
  useEffect(() => {
    if (data && data.totalPages < currentPage) {
      setCurrentPage(data.totalPages);
    }
  }, [data, currentPage]);

  const handleCreate = (note: CreateNote) => {
    mutation.mutate(note);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          textInput={searchInput}
          onSearch={value => {
            setSearchInput(value);
            debouncedSearch(value);
          }}
        />
        {isSuccess && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button
          className={css.button}
          onClick={() => setModalOpen(true)}
          disabled={isLoading || isFetching}
        >
          Create note +
        </button>
      </header>
      <main className={css.main}>
        {isLoading && <Loader />}
        {!isLoading && isError && <ErrorMessage />}
        {!isLoading && !isError && data?.notes.length === 0 && <NoResult />}

        {isSuccess && data?.notes?.length > 0 && (
          <NoteList notes={data.notes} />
        )}
      </main>
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm
            onSuccess={handleCreate}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
