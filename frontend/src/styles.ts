import type { Theme } from "@mui/material";

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(3),
    maxWidth: 900,
    margin: "auto",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f0f4f8",
    borderRadius: 8,
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  },

  titleConductors: {
    fontWeight: 700,
    color: "#004d40",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontSize: "1.4rem",
    marginBottom: theme.spacing(1.5),
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },

  titleDrivers: {
    fontWeight: 700,
    color: "#bf360c",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontSize: "1.4rem",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(1.5),
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
  },

  searchField: {
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
      borderRadius: 4,
      boxShadow: "0 2px 5px rgba(0, 77, 64, 0.15)",
      "& fieldset": {
        borderColor: "#004d40",
      },
      "&:hover fieldset": {
        borderColor: "#00796b",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#004d40",
      },
    },
    input: {
      color: "#004d40",
      fontWeight: 500,
      fontSize: "0.875rem",
    },
  },

  selectedText: {
    marginBottom: theme.spacing(1.5),
    fontWeight: 500,
    fontSize: "1rem",
    letterSpacing: 0.5,
  },

  selectedTextSuccess: {
    color: "#2e7d32",
  },

  selectedTextDefault: {
    color: "#616161",
  },

  paperList: {
    marginTop: theme.spacing(0),
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 8px 18px rgba(43, 50, 60, 0.1)",
  },

  listItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: "background-color 0.2s ease, color 0.2s ease",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.95rem",
    color: "#004d40",
    padding: theme.spacing(1, 2),
    "&:hover": {
      backgroundColor: "#b2dfdb",
      color: "#00332a",
      boxShadow: "inset 3px 0 0 0 #00796b",
    },
  },

  selectedListItem: {
    backgroundColor: "#00796b",
    color: "#e0f2f1",
    fontWeight: 600,
    boxShadow: "inset 3px 0 0 0 #004d40",
  },

  listItemText: {
    paddingY: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    width: "100%",
  },

  paginationBox: {
    marginTop: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    "& .MuiPaginationItem-root": {
      color: "#004d40",
      fontWeight: 500,
      fontSize: "0.875rem",
      "&.Mui-selected": {
        backgroundColor: "#00796b",
        color: "#e0f2f1",
        boxShadow: "0 0 6px 2px rgba(0, 121, 107, 0.4)",
      },
      "&:hover": {
        backgroundColor: "#004d40",
        color: "#a7ffeb",
      },
    },
  },
});

export default styles;
