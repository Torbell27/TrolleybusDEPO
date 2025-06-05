import { useEffect, useRef, useState } from "react";
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
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Button,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

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
  const [tab, setTab] = useState(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const [conductors, setConductors] = useState<Person[]>([]);
  const [totalConductors, setTotalConductors] = useState<number>(0);
  const [pageConductors, setPageConductors] = useState<number>(1);
  const [searchConductors, setSearchConductors] = useState<string>("");
  const [selectedConductor, setSelectedConductor] = useState<Person | null>(
    null
  );
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
  const [selectedTrolleybus, setSelectedTrolleybus] =
    useState<Trolleybus | null>(null);
  const [loadingTrolleybuses, setLoadingTrolleybuses] = useState<boolean>(true);

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [crews, setCrews] = useState<any[]>([]);
  const [loadingCrews, setLoadingCrews] = useState<boolean>(true);
  const [totalCrews, setTotalCrews] = useState<number>(0);
  const [searchCrews, setSearchCrews] = useState<string>("");
  const [pageCrews, setPageCrews] = useState<number>(1);

  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [crewToEdit, setCrewToEdit] = useState<any | null>(null);
  const [loadingModalDrivers, setLoadingModalDrivers] = useState(false);

  const inputC = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (inputC.current) {
      inputC.current.focus();
    }
  }, []);

  const fetchConductors = async (pageNumber: number, query: string) => {
    setLoadingConductors(true);
    try {
      const response = await axios.get<{ conductors: Person[]; total: number }>(
        `${API_URL}/crew/getAvailableConductors`,
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
    if (driverModalOpen) setLoadingModalDrivers(true)

    setLoadingDrivers(true);
    try {
      const response = await axios.get<{ drivers: Person[]; total: number }>(
        `${API_URL}/crew/getAvailableDrivers`,
        { params: { page: pageNumber - 1, search: query } }
      );
      setDrivers(response.data.drivers);
      setTotalDrivers(response.data.total);
    } catch (error) {
      console.error("Ошибка при получении водителей:", error);
    } finally {
      setLoadingDrivers(false);
      setLoadingModalDrivers(false);
    }
  };

  const fetchTrolleybuses = async (pageNumber: number, query: string) => {
    setLoadingTrolleybuses(true);
    try {
      const response = await axios.get<{
        trolleybuses: Trolleybus[];
        total: number;
      }>(`${API_URL}/crew/getAvailableTrolleybuses`, {
        params: { page: pageNumber - 1, search: query },
      });
      setTrolleybuses(response.data.trolleybuses);
      setTotalTrolleybuses(response.data.total);
    } catch (error) {
      console.error("Ошибка при получении троллейбусов:", error);
    } finally {
      setLoadingTrolleybuses(false);
    }
  };

    const fetchCrews = async (pageNumber: number, query: string) => {
    setLoadingCrews(true);
    try {
      const response = await axios.get<{ crews: any[]; total: number }>(`${API_URL}/crew/getCrews`, {
        params: { page: pageNumber - 1, search: query },
      });
      setCrews(response.data.crews);
      setTotalCrews(response.data.total);
    } catch (error) {
      console.error("Ошибка при получении экипажей:", error);
    } finally {
      setLoadingCrews(false);
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
    const delay = setTimeout(() => {
      setPageCrews(1);
      fetchCrews(1, searchCrews);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(delay);
  }, [searchCrews]);

  useEffect(() => {
    fetchConductors(pageConductors, searchConductors);
  }, [pageConductors]);

  useEffect(() => {
    fetchDrivers(pageDrivers, searchDrivers);
  }, [pageDrivers]);

  useEffect(() => {
    fetchTrolleybuses(pageTrolleybuses, searchTrolleybuses);
  }, [pageTrolleybuses]);

  useEffect(() => {
    fetchCrews(pageCrews, searchCrews);
  }, [pageCrews]);

  const totalPagesConductors = Math.ceil(totalConductors / DEFAULT_LIMIT);
  const totalPagesDrivers = Math.ceil(totalDrivers / DEFAULT_LIMIT);
  const totalPagesTrolleybuses = Math.ceil(totalTrolleybuses / DEFAULT_LIMIT);
  const totalPagesCrews = Math.ceil(totalCrews / DEFAULT_LIMIT);

  const handleSubmit = async () => {
    if (!selectedConductor || !selectedDriver || !selectedTrolleybus) return;

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/crew/createCrew`, {
        conductorId: selectedConductor.user_id,
        driverId: selectedDriver.user_id,
        trolleybusId: selectedTrolleybus.trolleybus_id,
      });
      setSuccessMessage("Экипаж успешно создан");
      setSelectedConductor(null);
      setSelectedDriver(null);
      setSelectedTrolleybus(null);
      fetchCrews(pageConductors, searchConductors);
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

  const handleDeleteCrew = async (crewId: string) => {
    try {
      await axios.delete(`${API_URL}/crew/deleteCrew/${crewId}`);
      setCrews((prev) => prev.filter((crew) => crew.crew_id !== crewId));
      setSuccessMessage("Экипаж успешно удален");
      fetchCrews(pageConductors, searchConductors);
      fetchConductors(pageConductors, searchConductors);
      fetchDrivers(pageDrivers, searchDrivers);
      fetchTrolleybuses(pageTrolleybuses, searchTrolleybuses);
    } catch (error) {
      console.error("Ошибка при удалении экипажа:", error);
      setErrorMessage("Не удалось удалить экипаж");
    }
  };

  const handleEditCrewRole = (crew: any, role: "Driver" | "Conductor" | "Trolleybus") => {
    if (role === "Driver") {
      setCrewToEdit(crew);
      setDriverModalOpen(true);
    }
  };

  const handleChangeDriver = async (newDriver: Person) => {
    if (!crewToEdit) return;

    try {
      await axios.put(`${API_URL}/crew/updateDriver`, {
        crewId: crewToEdit.crew_id,
        newDriverId: newDriver.user_id,
      });
      setSuccessMessage("Водитель обновлен");
      setDriverModalOpen(false);
      setCrewToEdit(null);
      const response = await axios.get<{ crews: any[] }>(`${API_URL}/crew/getCrews`);
      setCrews(response.data.crews);
    } catch (error) {
      console.error("Ошибка при обновлении водителя:", error);
      setErrorMessage("Не удалось обновить водителя");
    }
  };

  return (
    <Box p={4}>
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Создать экипаж" />
        <Tab label="Экипажи" />
      </Tabs>

      {tab === 0 && (
        <Box mt={4}>
          {/* Кондукторы */}
          <Typography variant="h4" gutterBottom>
            Список кондукторов
          </Typography>
          <Paper sx={{ p: 2 }}>
            <TextField
              label="Поиск по имени"
              value={searchConductors}
              onChange={(e) => setSearchConductors(e.target.value)}
              variant="outlined"
              fullWidth
              inputRef={inputC}
            />
            <Typography sx={{ p: 2 }}>
              {selectedConductor ? (
                <>Выбран: <strong>{selectedConductor.User.name}</strong></>
              ) : "Не выбран"}
            </Typography>
            {loadingConductors ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : conductors.length === 0 ? (
      <Typography>Нет свободных кондукторов</Typography>) : (
              <Paper elevation={3}>
                <List>
                  {conductors.map((conductor) => (
                    <ListItem disablePadding key={conductor.user_id}>
                      <ListItemButton
                        selected={conductor.user_id === selectedConductor?.user_id}
                        onClick={() => setSelectedConductor(conductor)}
                        sx={(theme) =>
                          conductor.user_id === selectedConductor?.user_id
                            ? {
                                bgcolor: theme.palette.primary.main,
                                color: "blue",
                                borderRadius: 1,
                                "&:hover": {
                                  bgcolor: theme.palette.primary.dark,
                                },
                              }
                            : {}
                        }
                      >
                        {conductor.User.name}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            {totalPagesConductors > 1 && (
              <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                  count={totalPagesConductors}
                  page={pageConductors}
                  onChange={(_, value) => setPageConductors(value)}
                  color="primary"
                />
              </Box>
            )}
          </Paper>

          {/* Водители */}
          <Typography variant="h4" gutterBottom mt={6}>
            Список водителей
          </Typography>
          <Paper sx={{ p: 2 }}>
            <TextField
              label="Поиск по имени"
              value={searchDrivers}
              onChange={(e) => setSearchDrivers(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Typography sx={{ p: 2 }}>
              {selectedDriver ? (
                <>Выбран: <strong>{selectedDriver.User.name}</strong></>
              ) : "Не выбран"}
            </Typography>
            {loadingDrivers ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : drivers.length === 0 ? (
      <Typography>Нет свободных водителей</Typography>) : (
              <Paper elevation={3}>
                <List>
                  {drivers.map((driver) => (
                    <ListItem disablePadding key={driver.user_id}>
                      <ListItemButton
                        selected={driver.user_id === selectedDriver?.user_id}
                        onClick={() => setSelectedDriver(driver)}
                        sx={(theme) =>
                          driver.user_id === selectedDriver?.user_id
                            ? {
                                bgcolor: theme.palette.primary.main,
                                color: "blue",
                                borderRadius: 1,
                                "&:hover": {
                                  bgcolor: theme.palette.primary.dark,
                                },
                              }
                            : {}
                        }
                      >
                        {driver.User.name}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            {totalPagesDrivers > 1 && (
              <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                  count={totalPagesDrivers}
                  page={pageDrivers}
                  onChange={(_, value) => setPageDrivers(value)}
                  color="primary"
                />
              </Box>
            )}
          </Paper>

          {/* Троллейбусы */}
          <Typography variant="h4" gutterBottom mt={6}>
            Список троллейбусов
          </Typography>
          <Paper sx={{ p: 2 }}>
            <TextField
              label="Поиск по номеру"
              value={searchTrolleybuses}
              onChange={(e) => setSearchTrolleybuses(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Typography sx={{ p: 2 }}>
              {selectedTrolleybus ? (
                <>
                  Выбран: <strong>{selectedTrolleybus.number}</strong> ({selectedTrolleybus.status})
                </>
              ) : "Не выбран"}
            </Typography>
            {loadingTrolleybuses ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : trolleybuses.length === 0 ? (
      <Typography>Нет свободных троллейбусов</Typography>) : (
              <Paper elevation={3}>
                <List>
                  {trolleybuses.map((t) => (
                    <ListItem disablePadding key={t.trolleybus_id}>
                      <ListItemButton
                        selected={t.trolleybus_id === selectedTrolleybus?.trolleybus_id}
                        onClick={() => setSelectedTrolleybus(t)}
                        sx={(theme) =>
                          t.trolleybus_id === selectedTrolleybus?.trolleybus_id
                            ? {
                                bgcolor: theme.palette.primary.main,
                                color: "blue",
                                borderRadius: 1,
                                "&:hover": {
                                  bgcolor: theme.palette.primary.dark,
                                },
                              }
                            : {}
                        }
                      >
                        {t.number}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            {totalPagesTrolleybuses > 1 && (
              <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                  count={totalPagesTrolleybuses}
                  page={pageTrolleybuses}
                  onChange={(_, value) => setPageTrolleybuses(value)}
                  color="primary"
                />
              </Box>
            )}
          </Paper>

          {/* Кнопка подтверждения */}
          <Box mt={5} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={
                !selectedConductor ||
                !selectedDriver ||
                !selectedTrolleybus ||
                submitting
              }
              sx={{ px: 4, py: 1.5, fontSize: "16px" }}
            >
              {submitting ? "Назначение..." : "Создать экипаж"}
            </Button>
          </Box>
        </Box>
      )}

      {/* Вкладка Экипажи */}
<Dialog open={driverModalOpen} onClose={() => setDriverModalOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>Выберите нового водителя</DialogTitle>
  <DialogContent dividers>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Поиск по имени"
      value={searchDrivers}
      onChange={(e) => {
        setSearchDrivers(e.target.value);
        setPageDrivers(1); // сбрасываем на первую страницу при поиске
      }}
      sx={{ mb: 2 }}
    />

    {loadingModalDrivers ? (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    ) : (
      <>
        <List>
          {drivers.map((driver) => (
            <ListItem disablePadding key={driver.user_id}>
              <ListItemButton
                onClick={() => handleChangeDriver(driver)}
                selected={crewToEdit?.Driver?.user_id === driver.user_id}
              >
                {driver.User.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {totalPagesDrivers > 1 && (
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={totalPagesDrivers}
              page={pageDrivers}
              onChange={(_, value) => setPageDrivers(value)}
              color="primary"
            />
          </Box>
        )}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDriverModalOpen(false)}>Отмена</Button>
  </DialogActions>
</Dialog>




{tab === 1 && (
  <Box mt={4}>
  <Typography variant="h4" gutterBottom>
    Список экипажей
  </Typography>
  <Paper sx={{ p: 2 }}>
    {loadingCrews ? (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    ) : crews.length === 0 ? (
      <Typography>Нет экипажей</Typography>
    ) : (
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Кондуктор</TableCell>
              <TableCell>Водитель</TableCell>
              <TableCell>Троллейбус</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {crews.map((crew) => (
              <TableRow key={crew.crew_id}>
              <TableCell>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <span>{crew.crew_id.substring(0, 8) || '—'}...</span>
                </Box>
              </TableCell>

              <TableCell>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleEditCrewRole(crew, 'Conductor')}
                >
                  <span>{crew.Conductor?.User?.name || '—'}</span>
                  <EditIcon />
                </Box>
              </TableCell>

              <TableCell>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleEditCrewRole(crew, 'Driver')}
                >
                  <span>{crew.Driver?.User?.name || '—'}</span>
                  <EditIcon />
                </Box>
              </TableCell>

              <TableCell>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleEditCrewRole(crew, 'Trolleybus')}
                >
                  <span>{crew.Trolleybus?.number || '—'}</span>
                  <EditIcon />
                </Box>
              </TableCell>
                <TableCell align="right">
                  <Button
                    color="error"
                    onClick={() => handleDeleteCrew(crew.crew_id)}
                  >
                  <DeleteIcon color="error" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )}
        {totalPagesCrews > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={totalPagesCrews}
            page={pageCrews}
            onChange={(_, value) => setPageCrews(value)}
            color="primary"
          />
        </Box>
      )}
    </Paper>
    </Box>
)}


      {/* Уведомления */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert
          onClose={() => setSuccessMessage("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Crew;
