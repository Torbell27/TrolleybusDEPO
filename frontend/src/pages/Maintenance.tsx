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
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

interface MaintenanceCrew {
  m_crew_id: string;
  status: string;
  name: string;
}

interface Trolleybus {
  trolleybus_id: string;
  status: string;
  number: string;
  route_id: string | null;
  crew_id: string | null;
}

interface MaintenanceRecord {
  m_record_id: string;
  planned: boolean;
  text: string;
  m_crew_id: string;
  trolleybus_id: string;
  completed: boolean;
  Trolleybus: Trolleybus;
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
  const [allTrolleybuses, setAllTrolleybuses] = useState<Trolleybus[]>([
    {
      trolleybus_id: "6699554f-4b7a-4481-9a03-3974ac8a8bfd",
      number: "Т 602",
      status: "Работает",
      route_id: "d39aee5c-1f6c-4d0c-bafb-cf9b52d569a7",
      crew_id: null,
    },
    {
      trolleybus_id: "9166c75b-ac34-415d-a6a4-3dba939433e3",
      number: "Т 3342",
      status: "Обслуживается",
      route_id: null,
      crew_id: null,
    },
    {
      trolleybus_id: "5911484a-80b8-4743-9e7f-d13ed66059bc",
      number: "Т 217",
      status: "В депо",
      route_id: "6cda71cc-0174-46ed-a688-e21ac85128fd",
      crew_id: "541c027f-7e08-4acb-89f7-3144875f018b",
    },
    {
      trolleybus_id: "c5c8a901-cdb3-46ee-aa9e-bbc967ee8e27",
      number: "Т 409",
      status: "Работает",
      route_id: "26bdc966-4972-408d-bce8-ae7ed962065f",
      crew_id: "01398d2b-a957-492e-8eef-36aa4524d383",
    },
    {
      trolleybus_id: "5ac1557a-06cf-4f57-a5df-3e0b080f17e6",
      number: "Т 891",
      status: "В депо",
      route_id: "74b0ae03-aa97-4e39-b6e2-f35ef2b27b76",
      crew_id: "5de50d32-35a1-42cf-b682-d8c396647766",
    },
    {
      trolleybus_id: "0bb65d04-dd52-4f21-a7ab-402abb22e238",
      number: "Т 543",
      status: "Работает",
      route_id: "7244a13f-ee14-414c-9955-d0d853d26b7b",
      crew_id: "d45025b0-17ee-4549-adc0-62167b0c3f9d",
    },
    {
      trolleybus_id: "9c3d8afb-91fc-4def-94c1-a1270c87f97e",
      number: "Т 715",
      status: "Работает",
      route_id: "80649e09-a7ea-447e-bdcc-ad84a46a1a27",
      crew_id: null,
    },
    {
      trolleybus_id: "ca4f8d3c-3afa-4d2a-9b6e-06de7553aad3",
      number: "Т 777",
      status: "В депо",
      route_id: "d40e2200-0ebc-4a96-ac4c-2c282792a0e4",
      crew_id: null,
    },
    {
      trolleybus_id: "ea53bf3f-1c84-4022-b092-4c868f81097f",
      number: "Т 2461",
      status: "Работает",
      route_id: "6fb28934-59f7-490f-8b21-c839bf92faa4",
      crew_id: null,
    },
    {
      trolleybus_id: "ed6108c9-02af-4c57-b4fa-cb400a61a589",
      number: "Т 680",
      status: "Обслуживается",
      route_id: null,
      crew_id: null,
    },
    {
      trolleybus_id: "f5a5f519-04c1-4604-831d-3537695c4dbc",
      number: "Т 1944",
      status: "Работает",
      route_id: "6ee00d39-9891-4baf-bd11-de3b0a999357",
      crew_id: null,
    },
  ]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [completeDialog, setCompleteDialog] =
    useState<MaintenanceRecord | null>(null);
  const [trolleybusCanWork, setTrolleybusCanWork] = useState<boolean>(false);

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
        await fetchAllTrolleybuses();
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

  const handleCompleteRecord = async () => {
    try {
      const record = completeDialog;
      if (!record) return;
      await api.put(`/maintenance-record/complete/${record.m_record_id}`, {
        trolleybus_can_work: trolleybusCanWork,
        trolleybus_id: record.trolleybus_id,
      });
      setCompleteDialog(null);
      setOkDialog("Статус троллейбуса и записи успешно изменены");
      await fetchRecords();
      await fetchAllTrolleybuses();
    } catch (error) {
      setOkDialog("Не удалось обновить статус троллейбуса и записи");
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
                    <TableCell>Завершено</TableCell>
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
                        <Checkbox checked={record.completed} disabled />
                      </TableCell>
                      <TableCell>
                        {!record.completed && (
                          <Tooltip title="Заврешить ТО">
                            <IconButton
                              onClick={() => setCompleteDialog(record)}
                            >
                              <CheckIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                        )}
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
                    {crew.name} ({crew.status})
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
                {allTrolleybuses
                  .filter((t) => {
                    return (
                      t.status ===
                      (!recordFormData.planned ? "Работает" : "В депо")
                    );
                  })
                  .map((trolleybus) => (
                    <MenuItem
                      key={trolleybus.trolleybus_id}
                      value={trolleybus.trolleybus_id}
                    >
                      {trolleybus.number} ({trolleybus.status})
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

      <Dialog open={!!completeDialog} onClose={() => setCompleteDialog(null)}>
        <DialogTitle>Завершение ТО</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={trolleybusCanWork}
                onChange={(e) => setTrolleybusCanWork(e.target.checked)}
              />
            }
            label={`Троллейбус ${completeDialog?.Trolleybus?.number} может продолжать работу`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCompleteRecord()}>Завершить</Button>
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
