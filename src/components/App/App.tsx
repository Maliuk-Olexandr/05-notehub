import css from './App.module.css';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

// import type { Note } from '../../types/note';
import { fetchNotes } from '../../services/noteService'; 

import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function App() {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const perPage = 12;

  const [debouncedSearch] = useDebounce(search, 500);
  
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', { debouncedSearch, page }],
    queryFn: () => fetchNotes({ search: debouncedSearch, page, perPage }),
    placeholderData: keepPreviousData,
    enabled: true
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
        {/* Кнопка створення нотатки */}
      </header>
      <main className={css.main}>
        {isLoading && <Loader />}
        {!isLoading && isError && <ErrorMessage />}
        {isSuccess && <NoteList page={page} perPage={perPage} />}
      </main>
    </div>
  );
}

export default App;
