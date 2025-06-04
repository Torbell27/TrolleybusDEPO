import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  useMediaQuery,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

interface MaintenanceCrew {
  m_crew_id: string;
  status: string;
  name: string;
}

interface MaintenanceRecord {
  m_record_id: string;
  planned: boolean;
  text: string;
  m_crew_id: string;
  trolleybus_id: string;
}

interface Trolleybus {
  trolleybus_id: string;
  model: string;
  number: string;
}

const Maintenance: React.FC = () => {
  const isPhone = useMediaQuery<boolean>("(max-width:1500px)");

  const [crews, setCrews] = useState<MaintenanceCrew[]>([]);
  const [crewPage, setCrewPage] = useState(1);
  const [crewTotalPages, setCrewTotalPages] = useState(1);
  const [crewSearchStatus, setCrewSearchStatus] = useState("");

  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [recordPage, setRecordPage] = useState(1);
  const [recordTotalPages, setRecordTotalPages] = useState(1);
  const [recordSearchText, setRecordSearchText] = useState("");

  const [okDialog, setOkDialog] = useState<string>("");
  const [crewDialogOpen, setCrewDialogOpen] = useState(false);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<
    "crew" | "record" | ""
  >("");
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  const [crewFormData, setCrewFormData] = useState({
    status: "",
    name: "",
  });

  const [recordFormData, setRecordFormData] = useState({
    planned: false,
    text: "",
    m_crew_id: "",
    trolleybus_id: "",
  });

  const [allCrews, setAllCrews] = useState<MaintenanceCrew[]>([]);
  const [allTrolleybuses, setAllTrolleybuses] = useState<Trolleybus[]>([]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const inputC = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputC.current) inputC.current.focus();
  }, []);

  const fetchCrews = async () => {
    try {
      const response = await api.get("/maintenance-crew/search", {
        params: {
          status: crewSearchStatus,
          page: crewPage,
          limit: 10,
        },
      });
      setCrews(response.data.crews);
      setCrewTotalPages(response.data.pages);
    } catch (error) {
      //console.error("Error fetching crews:", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await api.get("/maintenance-record/search", {
        params: {
          text: recordSearchText,
          page: recordPage,
          limit: 10,
        },
      });
      setRecords(response.data.records);
      setRecordTotalPages(response.data.pages);
    } catch (error) {
      //console.error("Error fetching records:", error);
    }
  };

  const fetchAllCrews = async () => {
    try {
      const response = await api.get("/maintenance-crew");
      setAllCrews(response.data);
    } catch (error) {
      //console.error("Error fetching all crews:", error);
    }
  };

  const fetchAllTrolleybuses = async () => {
    try {
      const response = await api.get("/trolleybuses");
      setAllTrolleybuses(response.data);
    } catch (error) {
      //console.error("Error fetching all trolleybuses:", error);
    }
  };

  useEffect(() => {
    fetchAllCrews();
    fetchAllTrolleybuses();
  }, []);

  const [searchCrewTimeout, setSearchCrewTimeout] = useState<number | null>(
    null
  );
  useEffect(() => {
    if (searchCrewTimeout) {
      clearTimeout(searchCrewTimeout);
      setSearchCrewTimeout(null);
    }
    setSearchCrewTimeout(
      setTimeout(() => {
        setCrewPage(1);
        fetchCrews();
      }, 500)
    );
  }, [crewSearchStatus]);

  useEffect(() => {
    fetchCrews();
  }, [crewPage]);

  const [searchRecordTimeout, setSearchRecordTimeout] = useState<number | null>(
    null
  );
  useEffect(() => {
    if (searchRecordTimeout) {
      clearTimeout(searchRecordTimeout);
      setSearchRecordTimeout(null);
    }
    setSearchRecordTimeout(
      setTimeout(() => {
        setRecordPage(1);
        fetchRecords();
      }, 500)
    );
  }, [recordSearchText]);

  useEffect(() => {
    fetchRecords();
  }, [recordPage]);

  const handleCrewCreate = () => {
    setDialogMode("create");
    setCrewFormData({ status: "", name: "" });
    setFormErrors({});
    setCrewDialogOpen(true);
  };

  const handleCrewEdit = (crew: MaintenanceCrew) => {
    setDialogMode("edit");
    setCurrentItemId(crew.m_crew_id);
    setCrewFormData({ status: crew.status, name: crew.name });
    setFormErrors({});
    setCrewDialogOpen(true);
  };

  const handleCrewDelete = (id: string) => {
    setCurrentItemId(id);
    setDeleteDialogOpen("crew");
  };

  const handleCrewSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!crewFormData.name) errors.name = "Имя обязательно";
    if (!crewFormData.status) errors.status = "Статус обязателен";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (dialogMode === "create") {
        await api.post("/maintenance-crew", crewFormData);
        setOkDialog("Запись о ремонтной бригаде успешно создана");
      } else {
        await api.put(`/maintenance-crew/${currentItemId}`, crewFormData);
        setOkDialog("Запись о ремонтной бригаде успешно изменена");
      }
      setCrewDialogOpen(false);
      await fetchCrews();
      await fetchAllCrews();
    } catch (error) {
      if (dialogMode === "create")
        setOkDialog("Не удалось создать запись о ремонтной бригаде");
      else setOkDialog("Не удалось изменить запись о ремонтной бригаде");
    }
  };

  const handleRecordCreate = () => {
    setDialogMode("create");
    setRecordFormData({
      planned: false,
      text: "",
      m_crew_id: "",
      trolleybus_id: "",
    });
    setFormErrors({});
    setRecordDialogOpen(true);
  };

  const handleRecordEdit = (record: MaintenanceRecord) => {
    setDialogMode("edit");
    setCurrentItemId(record.m_record_id);
    setRecordFormData({
      planned: record.planned,
      text: record.text,
      m_crew_id: record.m_crew_id,
      trolleybus_id: record.trolleybus_id,
    });
    setFormErrors({});
    setRecordDialogOpen(true);
  };

  const handleRecordDelete = (id: string) => {
    setCurrentItemId(id);
    setDeleteDialogOpen("record");
  };

  const handleRecordSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!recordFormData.text) errors.text = "Текст обязателен";
    if (!recordFormData.m_crew_id) errors.m_crew_id = "Бригада обязательна";
    if (!recordFormData.trolleybus_id)
      errors.trolleybus_id = "Троллейбус обязателен";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (dialogMode === "create") {
        await api.post("/maintenance-record", recordFormData);
        setOkDialog("Запись о ТО успешно создана");
      } else {
        await api.put(`/maintenance-record/${currentItemId}`, recordFormData);
        setOkDialog("Запись о ТО успешно изменена");
      }
      setRecordDialogOpen(false);
      await fetchRecords();
    } catch (error) {
      if (dialogMode === "create")
        setOkDialog("Не удалось создать запись о ТО");
      else setOkDialog("Не удалось изменить запись о ТО");
    }
  };

  useEffect(() => {
    setCrewPage((prev) => Math.min(prev, crewTotalPages));
    setRecordPage((prev) => Math.min(prev, recordTotalPages));
  }, [crewTotalPages, recordTotalPages]);

  const handleDeleteConfirm = async () => {
    try {
      if (deleteDialogOpen === "crew") {
        await api.delete(`/maintenance-crew/${currentItemId}`);
        await fetchCrews();
        await fetchAllCrews();
      } else {
        await api.delete(`/maintenance-record/${currentItemId}`);
        await fetchRecords();
      }
      setDeleteDialogOpen("");
      setOkDialog("Запись успешно удалена");
    } catch (error) {
      setOkDialog("Не удалось удалить запись");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Управление техническим обслуживанием
      </Typography>

      <Grid container spacing={2} direction={isPhone ? "column" : "row"}>
        {/* Таблица ремонтной бригады */}
        <Grid sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <TextField
                size="small"
                placeholder="Поиск по статусу"
                value={crewSearchStatus}
                onChange={(e) => setCrewSearchStatus(e.target.value)}
                slotProps={{ input: { startAdornment: <SearchIcon /> } }}
                sx={{ flex: 1, mr: 2 }}
                inputRef={inputC}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCrewCreate}
              >
                Добавить бригаду
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {crews.map((crew) => (
                    <TableRow key={crew.m_crew_id}>
                      <TableCell>{crew.m_crew_id.substring(0, 8)}...</TableCell>
                      <TableCell>{crew.name}</TableCell>
                      <TableCell>{crew.status}</TableCell>

                      <TableCell>
                        <IconButton onClick={() => handleCrewEdit(crew)}>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleCrewDelete(crew.m_crew_id)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={crewTotalPages}
                page={crewPage}
                onChange={(_, page) => setCrewPage(page)}
                color="primary"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Таблица записей о ТО */}
        <Grid sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <TextField
                size="small"
                placeholder="Поиск по тексту"
                value={recordSearchText}
                onChange={(e) => setRecordSearchText(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <SearchIcon />,
                  },
                }}
                sx={{ flex: 1, mr: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleRecordCreate}
              >
                Добавить запись
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Текст</TableCell>
                    <TableCell>Запланировано</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.m_record_id}>
                      <TableCell>
                        {record.m_record_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>{record.text}</TableCell>
                      <TableCell>
                        <Checkbox checked={record.planned} disabled />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleRecordEdit(record)}>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleRecordDelete(record.m_record_id)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={recordTotalPages}
                page={recordPage}
                onChange={(_, page) => setRecordPage(page)}
                color="primary"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Диалоговое окно для бригады */}
      <Dialog open={crewDialogOpen} onClose={() => setCrewDialogOpen(false)}>
        <DialogTitle>
          {dialogMode === "create"
            ? "Добавить бригаду"
            : "Редактировать бригаду"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 400,
            }}
          >
            <TextField
              fullWidth
              label="Имя"
              value={crewFormData.name}
              onChange={(e) =>
                setCrewFormData({ ...crewFormData, name: e.target.value })
              }
              error={!!formErrors.name}
              helperText={formErrors.name}
            />

            <TextField
              fullWidth
              label="Статус"
              value={crewFormData.status}
              onChange={(e) =>
                setCrewFormData({ ...crewFormData, status: e.target.value })
              }
              error={!!formErrors.status}
              helperText={formErrors.status}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCrewDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleCrewSubmit} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалоговое окно для записи о ТО */}
      <Dialog
        open={recordDialogOpen}
        onClose={() => setRecordDialogOpen(false)}
      >
        <DialogTitle>
          {dialogMode === "create"
            ? "Добавить запись ТО"
            : "Редактировать запись ТО"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 400,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={recordFormData.planned}
                  onChange={(e) =>
                    setRecordFormData({
                      ...recordFormData,
                      planned: e.target.checked,
                    })
                  }
                />
              }
              label="Запланированное ТО"
            />

            <TextField
              fullWidth
              label="Текст"
              multiline
              rows={5}
              value={recordFormData.text}
              onChange={(e) =>
                setRecordFormData({ ...recordFormData, text: e.target.value })
              }
              error={!!formErrors.text}
              helperText={formErrors.text}
            />

            <FormControl fullWidth error={!!formErrors.m_crew_id}>
              <InputLabel>Бригада</InputLabel>
              <Select
                value={recordFormData.m_crew_id}
                onChange={(e) =>
                  setRecordFormData({
                    ...recordFormData,
                    m_crew_id: e.target.value,
                  })
                }
                label="Бригада"
              >
                {allCrews.map((crew) => (
                  <MenuItem key={crew.m_crew_id} value={crew.m_crew_id}>
                    {crew.name} ({crew.m_crew_id.substring(0, 8)}...)
                  </MenuItem>
                ))}
              </Select>
              {formErrors.m_crew_id && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {formErrors.m_crew_id}
                </Alert>
              )}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.trolleybus_id}>
              <InputLabel>Троллейбус</InputLabel>
              <Select
                value={recordFormData.trolleybus_id}
                onChange={(e) =>
                  setRecordFormData({
                    ...recordFormData,
                    trolleybus_id: e.target.value,
                  })
                }
                label="Троллейбус"
              >
                {allTrolleybuses.map((trolleybus) => (
                  <MenuItem
                    key={trolleybus.trolleybus_id}
                    value={trolleybus.trolleybus_id}
                  >
                    {trolleybus.model} ({trolleybus.number})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.trolleybus_id && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {formErrors.trolleybus_id}
                </Alert>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecordDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleRecordSubmit} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалоговое окно подтверждения удаления */}
      <Dialog open={!!deleteDialogOpen} onClose={() => setDeleteDialogOpen("")}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить эту запись?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen("")}>Отмена</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!okDialog} onClose={() => setOkDialog("")}>
        <DialogTitle>
          {okDialog.includes("Не удалось") ? "Ошибка" : "Успешно"}
        </DialogTitle>
        <DialogContent>
          <Typography>{okDialog}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOkDialog("")}>ОК</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Maintenance;
