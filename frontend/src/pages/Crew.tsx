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
} from "@mui/material";
import styles from "../styles";

interface Person {
  user_id: string;
  User: {
    name: string;
  };
}

const DEFAULT_LIMIT = 4;
const DEBOUNCE_DELAY = 500;

const Crew: React.FC = () => {
  const theme = useTheme();
  const classes = styles(theme);

  // Кондукторы
  const [conductors, setConductors] = useState<Person[]>([]);
  const [totalConductors, setTotalConductors] = useState<number>(0);
  const [pageConductors, setPageConductors] = useState<number>(1);
  const [searchConductors, setSearchConductors] = useState<string>("");
  const [selectedConductor, setSelectedConductor] = useState<Person | null>(null);
  const [loadingConductors, setLoadingConductors] = useState<boolean>(true);

  // Водители
  const [drivers, setDrivers] = useState<Person[]>([]);
  const [totalDrivers, setTotalDrivers] = useState<number>(0);
  const [pageDrivers, setPageDrivers] = useState<number>(1);
  const [searchDrivers, setSearchDrivers] = useState<string>("");
  const [selectedDriver, setSelectedDriver] = useState<Person | null>(null);
  const [loadingDrivers, setLoadingDrivers] = useState<boolean>(true);

  const fetchConductors = async (pageNumber: number, query: string) => {
    setLoadingConductors(true);
    try {
      const response = await axios.get<{ conductors: Person[]; total: number }>(
        "http://localhost:5000/api/crew/getAvailableConductors",
        {
          params: { page: pageNumber - 1, search: query },
        }
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
        {
          params: { page: pageNumber - 1, search: query },
        }
      );
      setDrivers(response.data.drivers);
      setTotalDrivers(response.data.total);
    } catch (error) {
      console.error("Ошибка при получении водителей:", error);
    } finally {
      setLoadingDrivers(false);
    }
  };

  // Поиск с задержкой: кондукторы
  useEffect(() => {
    const delay = setTimeout(() => {
      setPageConductors(1);
      fetchConductors(1, searchConductors);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(delay);
  }, [searchConductors]);

  // Поиск с задержкой: водители
  useEffect(() => {
    const delay = setTimeout(() => {
      setPageDrivers(1);
      fetchDrivers(1, searchDrivers);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(delay);
  }, [searchDrivers]);

  useEffect(() => {
    fetchConductors(pageConductors, searchConductors);
  }, [pageConductors]);

  useEffect(() => {
    fetchDrivers(pageDrivers, searchDrivers);
  }, [pageDrivers]);

  const totalPagesConductors = Math.ceil(totalConductors / DEFAULT_LIMIT);
  const totalPagesDrivers = Math.ceil(totalDrivers / DEFAULT_LIMIT);

  return (
    <Box p={4}>
      {/* --- Кондукторы --- */}
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

      <Typography         sx={[
          classes.selectedText,
          selectedConductor
            ? classes.selectedTextSuccess
            : classes.selectedTextDefault,
        ]}>
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
              <ListItem disablePadding key={conductor.user_id}                 sx={[
                  classes.listItem,
                  conductor.user_id === selectedConductor?.user_id &&
                    classes.selectedListItem,
                ]}>
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

      {/* --- Водители --- */}
      <Typography variant="h4" sx={classes.titleConductors} gutterBottom mt={6}>
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

      <Typography         sx={[
          classes.selectedText,
          selectedDriver
            ? classes.selectedTextSuccess
            : classes.selectedTextDefault,
        ]}>
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
              <ListItem disablePadding key={driver.user_id} sx={[
                  classes.listItem,
                  driver.user_id === selectedDriver?.user_id &&
                    classes.selectedListItem,
                ]}>
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
    </Box>
  );
};

export default Crew;
