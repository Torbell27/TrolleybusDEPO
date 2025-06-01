import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  Pagination,
  Paper,
  TextField,
  ListItemButton,
  useTheme,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import styles from "../styles";

interface Person {
  user_id: string;
  User: {
    name: string;
  };
}

interface Trolleybus {
  trolleybus_id: string;
  number: string;
  status: string;
}

const DEFAULT_LIMIT = 4;
const DEBOUNCE_DELAY = 500;

const Crew: React.FC = () => {
  const theme = useTheme();
  const classes = styles(theme);

  const [conductors, setConductors] = useState<Person[]>([]);
  const [totalConductors, setTotalConductors] = useState<number>(0);
  const [pageConductors, setPageConductors] = useState<number>(1);
  const [searchConductors, setSearchConductors] = useState<string>("");
  const [selectedConductor, setSelectedConductor] = useState<Person | null>(null);
  const [loadingConductors, setLoadingConductors] = useState<boolean>(true);

  const [drivers, setDrivers] = useState<Person[]>([]);
  const [totalDrivers, setTotalDrivers] = useState<number>(0);
  const [pageDrivers, setPageDrivers] = useState<number>(1);
  const [searchDrivers, setSearchDrivers] = useState<string>("");
  const [selectedDriver, setSelectedDriver] = useState<Person | null>(null);
  const [loadingDrivers, setLoadingDrivers] = useState<boolean>(true);

  const [trolleybuses, setTrolleybuses] = useState<Trolleybus[]>([]);
  const [totalTrolleybuses, setTotalTrolleybuses] = useState<number>(0);
  const [pageTrolleybuses, setPageTrolleybuses] = useState<number>(1);
  const [searchTrolleybuses, setSearchTrolleybuses] = useState<string>("");
  const [selectedTrolleybus, setSelectedTrolleybus] = useState<Trolleybus | null>(null);
  const [loadingTrolleybuses, setLoadingTrolleybuses] = useState<boolean>(true);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchConductors = async (pageNumber: number, query: string) => {
    setLoadingConductors(true);
    try {
      const response = await axios.get<{ conductors: Person[]; total: number }>(
        "http://localhost:5000/api/crew/getAvailableConductors",
        { params: { page: pageNumber - 1, search: query } }
      );
      setConductors(response.data.conductors);
      setTotalConductors(response.data.total);
    } catch (error) {
      console.error("Ошибка при получении кондукторов:", error);
    } finally {
      setLoadingConductors(false);
    }
  };

  const fetchDrivers = async (pageNumber: number, query: string) => {
    setLoadingDrivers(true);
    try {
      const response = await axios.get<{ drivers: Person[]; total: number }>(
        "http://localhost:5000/api/crew/getAvailableDrivers",
        { params: { page: pageNumber - 1, search: query } }
      );
      setDrivers(response.data.drivers);
      setTotalDrivers(response.data.total);
    } catch (error) {
      console.error("Ошибка при получении водителей:", error);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const fetchTrolleybuses = async (pageNumber: number, query: string) => {
    setLoadingTrolleybuses(true);
    try {
      const response = await axios.get<{ trolleybuses: Trolleybus[]; total: number }>(
        "http://localhost:5000/api/crew/getAvailableTrolleybuses",
        { params: { page: pageNumber - 1, search: query } }
      );
      setTrolleybuses(response.data.trolleybuses);
      setTotalTrolleybuses(response.data.total);
    } catch (error) {
      console.error("Ошибка при получении троллейбусов:", error);
    } finally {
      setLoadingTrolleybuses(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPageConductors(1);
      fetchConductors(1, searchConductors);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(delay);
  }, [searchConductors]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPageDrivers(1);
      fetchDrivers(1, searchDrivers);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(delay);
  }, [searchDrivers]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPageTrolleybuses(1);
      fetchTrolleybuses(1, searchTrolleybuses);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(delay);
  }, [searchTrolleybuses]);

  useEffect(() => {
    fetchConductors(pageConductors, searchConductors);
  }, [pageConductors]);

  useEffect(() => {
    fetchDrivers(pageDrivers, searchDrivers);
  }, [pageDrivers]);

  useEffect(() => {
    fetchTrolleybuses(pageTrolleybuses, searchTrolleybuses);
  }, [pageTrolleybuses]);

  const totalPagesConductors = Math.ceil(totalConductors / DEFAULT_LIMIT);
  const totalPagesDrivers = Math.ceil(totalDrivers / DEFAULT_LIMIT);
  const totalPagesTrolleybuses = Math.ceil(totalTrolleybuses / DEFAULT_LIMIT);

  const handleSubmit = async () => {
    if (!selectedConductor || !selectedDriver || !selectedTrolleybus) return;

    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/crew/createCrew", {
        conductorId: selectedConductor.user_id,
        driverId: selectedDriver.user_id,
        trolleybusId: selectedTrolleybus.trolleybus_id,
      });
      setSuccessMessage("Экипаж успешно назначен!");
      setSelectedConductor(null);
      setSelectedDriver(null);
      setSelectedTrolleybus(null);
      fetchConductors(pageConductors, searchConductors);
      fetchDrivers(pageDrivers, searchDrivers);
      fetchTrolleybuses(pageTrolleybuses, searchTrolleybuses);
    } catch (error) {
      console.error("Ошибка при назначении экипажа:", error);
      setErrorMessage("Ошибка при создании экипажа.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={4}>
{/* Кондукторы */}
      <Typography variant="h4" sx={classes.titleConductors} gutterBottom>
        Кондукторы
      </Typography>
      <TextField
        label="Поиск по имени"
        value={searchConductors}
        onChange={(e) => setSearchConductors(e.target.value)}
        variant="outlined"
        fullWidth
        sx={classes.searchField}
      />
      <Typography
        sx={[
          classes.selectedText,
          selectedConductor ? classes.selectedTextSuccess : classes.selectedTextDefault,
        ]}
      >
        {selectedConductor ? (
          <>
            Выбран: <strong>{selectedConductor.User.name}</strong>
          </>
        ) : (
          "Не выбран"
        )}
      </Typography>
      {loadingConductors ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={classes.paperList}>
          <List>
            {conductors.map((conductor) => (
              <ListItem
                disablePadding
                key={conductor.user_id}
                sx={[
                  classes.listItem,
                  conductor.user_id === selectedConductor?.user_id &&
                    classes.selectedListItem,
                ]}
              >
                <ListItemButton
                  selected={conductor.user_id === selectedConductor?.user_id}
                  onClick={() => setSelectedConductor(conductor)}
                >
                  {conductor.User.name}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {totalPagesConductors > 1 && (
        <Box mt={3} display="flex" justifyContent="center" sx={classes.paginationBox}>
          <Pagination
            count={totalPagesConductors}
            page={pageConductors}
            onChange={(_, value) => setPageConductors(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Водители */}
      <Typography variant="h4" sx={classes.titleDrivers} gutterBottom mt={6}>
        Водители
      </Typography>
      <TextField
        label="Поиск по имени"
        value={searchDrivers}
        onChange={(e) => setSearchDrivers(e.target.value)}
        variant="outlined"
        fullWidth
        sx={classes.searchField}
      />
      <Typography
        sx={[
          classes.selectedText,
          selectedDriver ? classes.selectedTextSuccess : classes.selectedTextDefault,
        ]}
      >
        {selectedDriver ? (
          <>
            Выбран: <strong>{selectedDriver.User.name}</strong>
          </>
        ) : (
          "Не выбран"
        )}
      </Typography>
      {loadingDrivers ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={classes.paperList}>
          <List>
            {drivers.map((driver) => (
              <ListItem
                disablePadding
                key={driver.user_id}
                sx={[
                  classes.listItem,
                  driver.user_id === selectedDriver?.user_id &&
                    classes.selectedListItem,
                ]}
              >
                <ListItemButton
                  selected={driver.user_id === selectedDriver?.user_id}
                  onClick={() => setSelectedDriver(driver)}
                >
                  {driver.User.name}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {totalPagesDrivers > 1 && (
        <Box mt={3} display="flex" justifyContent="center" sx={classes.paginationBox}>
          <Pagination
            count={totalPagesDrivers}
            page={pageDrivers}
            onChange={(_, value) => setPageDrivers(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Троллейбусы */}
      <Typography variant="h4" sx={classes.titleDrivers} gutterBottom mt={6}>
        Троллейбусы
      </Typography>
      <TextField
        label="Поиск по номеру"
        value={searchTrolleybuses}
        onChange={(e) => setSearchTrolleybuses(e.target.value)}
        variant="outlined"
        fullWidth
        sx={classes.searchField}
      />
      <Typography
        sx={[
          classes.selectedText,
          selectedTrolleybus ? classes.selectedTextSuccess : classes.selectedTextDefault,
        ]}
      >
        {selectedTrolleybus ? (
          <>
            Выбран: <strong>{selectedTrolleybus.number}</strong> ({selectedTrolleybus.status})
          </>
        ) : (
          "Не выбран"
        )}
      </Typography>
      {loadingTrolleybuses ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={classes.paperList}>
          <List>
            {trolleybuses.map((t) => (
              <ListItem
                disablePadding
                key={t.trolleybus_id}
                sx={[
                  classes.listItem,
                  t.trolleybus_id === selectedTrolleybus?.trolleybus_id &&
                    classes.selectedListItem,
                ]}
              >
                <ListItemButton
                  selected={t.trolleybus_id === selectedTrolleybus?.trolleybus_id}
                  onClick={() => setSelectedTrolleybus(t)}
                >
                  {t.number}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {totalPagesTrolleybuses > 1 && (
        <Box mt={3} display="flex" justifyContent="center" sx={classes.paginationBox}>
          <Pagination
            count={totalPagesTrolleybuses}
            page={pageTrolleybuses}
            onChange={(_, value) => setPageTrolleybuses(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Кнопка подтверждения */}
      <Box mt={5} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={
            !selectedConductor || !selectedDriver || !selectedTrolleybus || submitting
          }
          sx={{ px: 4, py: 1.5, fontSize: "16px" }}
        >
          {submitting ? "Назначение..." : "Создать экипаж"}
        </Button>
      </Box>

      {/* Уведомления */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
      >
        <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Crew;
