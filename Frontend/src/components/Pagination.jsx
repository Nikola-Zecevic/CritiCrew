import React from "react";
import { Pagination as MuiPagination, Box, useTheme } from "@mui/material";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const theme = useTheme();

  return (
    <Box
      aria-label="pagination"
      sx={{
        display: "flex",
        justifyContent: "center",
        my: 4,
      }}
    >
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => onPageChange(page)}
        siblingCount={1}
        boundaryCount={1}
        showFirstButton
        showLastButton
        shape="rounded"
        sx={{
          "& .MuiPaginationItem-root": {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            fontWeight: "bold",
          },
          "& .Mui-selected": {
            bgcolor: "#f5c518 !important",
            color: "#000",
            borderColor: "#f5c518",
          },
          "& .MuiPaginationItem-root:hover": {
            borderColor: "#f5c518",
            color: "#f5c518",
          },
        }}
      />
    </Box>
  );
}

export default Pagination;
