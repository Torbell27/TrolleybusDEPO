import type { Theme } from "@mui/material";

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(5),
    maxWidth: 900,
    margin: "auto",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f0f4f8",
    borderRadius: 8,
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },
  titleConductors: {
    fontWeight: 700,
    color: "#004d40",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: "1.9rem",
    marginBottom: theme.spacing(2),
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
  },
  titleDrivers: {
    fontWeight: 700,
    color: "#bf360c",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: "1.9rem",
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(2),
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
  },
  searchField: {
    marginBottom: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
      borderRadius: .5,
      boxShadow: "0 3px 8px rgba(0, 77, 64, 0.2)",
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
      fontWeight: 600,
    },
  },
  selectedText: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    fontSize: "1.1rem",
    letterSpacing: 0.7,
  },
  selectedTextSuccess: {
    color: "#2e7d32", // яркий зелёный — подтверждение
  },
  selectedTextDefault: {
    color: "#616161", // серый для текста по умолчанию
  },
  paperList: {
    marginTop: theme.spacing(0),
    borderRadius: .2,
    overflow: "hidden",
    boxShadow: "0 12px 25px rgba(43, 50, 60, 0.15)",
  },
  listItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: "background-color 0.25s ease, color 0.25s ease",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "1rem",
    color: "#004d40",
    "&:hover": {
      backgroundColor: "#b2dfdb",
      color: "#00332a",
      boxShadow: "inset 3px 0 0 0 #00796b",
    },
  },
  selectedListItem: {
    backgroundColor: "#00796b",
    color: "#e0f2f1",
    fontWeight: 700,
    boxShadow: "inset 3px 0 0 0 #004d40",
  },
  listItemText: {
    paddingY: theme.spacing(1.5),
    paddingLeft: theme.spacing(3),
    width: "100%",
  },
  paginationBox: {
    marginTop: theme.spacing(4),
    display: "flex",
    justifyContent: "center",
    "& .MuiPaginationItem-root": {
      color: "#004d40",
      fontWeight: 600,
      "&.Mui-selected": {
        backgroundColor: "#00796b",
        color: "#e0f2f1",
        boxShadow: "0 0 8px 2px rgba(0, 121, 107, 0.6)",
      },
      "&:hover": {
        backgroundColor: "#004d40",
        color: "#a7ffeb",
      },
    },
  },
});

export default styles;
