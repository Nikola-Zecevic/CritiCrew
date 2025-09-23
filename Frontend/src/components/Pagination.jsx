import React from "react";
import { Pagination as MuiPagination, Box } from "@mui/material";
import { useThemeContext } from "../contexts/ThemeContext";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const { theme } = useThemeContext(); // use the MUI theme directly

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
            bgcolor: theme.palette.secondary.main + " !important",
            color:
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : "#000",
            borderColor: theme.palette.secondary.main,
          },
          "& .MuiPaginationItem-root:hover": {
            borderColor: theme.palette.secondary.main,
            color: theme.palette.secondary.main,
          },
        }}
      />
    </Box>
  );
}

export default Pagination;
