import React from "react";
import "../styles/Pagination.css";
import { Pagination as MuiPagination } from "@mui/material";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination-container" aria-label="pagination">
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => onPageChange(page)}
        siblingCount={1} // number of page buttons to show next to current
        boundaryCount={1} // number of buttons at start/end
        showFirstButton
        showLastButton
        shape="rounded"
        className="mui-pagination"
      />
    </div>
  );
}

export default Pagination;
