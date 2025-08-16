import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  onPageChange: (selected: { selected: number }) => void;
  forcePage: number;
}

export default function Pagination({ pageCount, onPageChange, forcePage }: PaginationProps) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="→"
      previousLabel="←"
      onPageChange={onPageChange}
      pageCount={pageCount}
      forcePage={forcePage}
      marginPagesDisplayed={2}
      pageRangeDisplayed={2}
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
    />
  );
}
