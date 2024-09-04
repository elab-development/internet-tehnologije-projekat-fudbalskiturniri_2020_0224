import React from 'react';
import './Pagination.css';
import usePagination from './usePagination'; // Ovde uvoziš custom hook

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = usePagination(totalPages, currentPage);
 

  return (
    <ul className="pagination">
      {pageNumbers.map((page, index) => (
        <li key={index}>
          <a
            href="#!"
            className={page === currentPage ? 'active' : ''}
            onClick={() => page !== '...' && onPageChange(page)}
          >
            {page}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;
