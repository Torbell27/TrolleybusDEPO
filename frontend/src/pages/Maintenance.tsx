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
  CircularProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  Engineering as EngineeringIcon,
} from "@mui/icons-material";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

interface Technician {
  user_id: string;
  m_crew_id: string | null;
}

interface MaintenanceCrew {
  m_crew_id: string;
  status: string;
  name: string;
  Technicians: Technician[];
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
  const [crewsLoading, setCrewsLoading] = useState(true);

  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [recordPage, setRecordPage] = useState(1);
  const [recordTotalPages, setRecordTotalPages] = useState(1);
  const [recordSearchText, setRecordSearchText] = useState("");
  const [recordsLoading, setRecordsLoading] = useState(true);

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
    technician_ids: [] as string[],
  });

  const [recordFormData, setRecordFormData] = useState({
    planned: false,
    text: "",
    m_crew_id: "",
    trolleybus_id: "",
  });

  const [allCrews, setAllCrews] = useState<MaintenanceCrew[]>([]);
  const [allTrolleybuses, setAllTrolleybuses] = useState<Trolleybus[]>([]);
  const [allTechnicians, setAllTechnicians] = useState<Technician[]>([]);
  const [availableTechnicians, setAvailableTechnicians] = useState<
    Technician[]
  >([]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [completeDialog, setCompleteDialog] =
    useState<MaintenanceRecord | null>(null);
  const [trolleybusCanWork, setTrolleybusCanWork] = useState<boolean>(false);

  const inputC = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputC.current) inputC.current.focus();
  }, []);

  const fetchCrews = async () => {
    setCrewsLoading(true);
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
      setOkDialog("Не удалось загрузить ремонтные бригады");
    } finally {
      setCrewsLoading(false);
    }
  };

  const fetchRecords = async () => {
    setRecordsLoading(true);
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
      setOkDialog("Не удалось загрузить записи о ТО");
    } finally {
      setRecordsLoading(false);
    }
  };

  const fetchAllCrews = async () => {
    try {
      const response = await api.get("/maintenance-crew");
      setAllCrews(response.data);
    } catch (error) {}
  };

  const fetchAllTrolleybuses = async () => {
    try {
      const response = await api.get("/trolleybus");
      setAllTrolleybuses(response.data);
    } catch (error) {}
  };

  const fetchAllTechnicians = async () => {
    try {
      const response = await api.get("/technician");
      setAllTechnicians(response.data);
      setAvailableTechnicians(
        response.data.filter((t: Technician) => !t.m_crew_id)
      );
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllCrews();
    fetchAllTrolleybuses();
    fetchAllTechnicians();
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
    setCrewFormData({ status: "", name: "", technician_ids: [] });
    setFormErrors({});
    setCrewDialogOpen(true);
  };

  const handleCrewEdit = (crew: MaintenanceCrew) => {
    setDialogMode("edit");
    setCurrentItemId(crew.m_crew_id);
    setCrewFormData({
      status: crew.status,
      name: crew.name,
      technician_ids: crew.Technicians.map((t) => t.user_id),
    });
    setFormErrors({});
    setCrewDialogOpen(true);
  };

  const handleCrewDelete = (id: string) => {
    setCurrentItemId(id);
    setDeleteDialogOpen("crew");
  };

  const handleCloseCrewDialog = () => {
    setCrewDialogOpen(false);
    setAvailableTechnicians(
      allTechnicians.filter((t: Technician) => !t.m_crew_id)
    );
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
      await fetchAllTechnicians();
    } catch (error) {
      if (dialogMode === "create")
        setOkDialog("Не удалось создать запись о ремонтной бригаде");
      else setOkDialog("Не удалось изменить запись о ремонтной бригаде");
    }
  };

  const handleTechnicianSelect = (technicianId: string) => {
    setCrewFormData((prev) => {
      const newTechIds = prev.technician_ids.includes(technicianId)
        ? prev.technician_ids.filter((id) => id !== technicianId)
        : [...prev.technician_ids, technicianId];

      return {
        ...prev,
        technician_ids: newTechIds,
      };
    });
    setAvailableTechnicians((prev) => {
      const technician = allTechnicians.find((t) => t.user_id === technicianId);
      if (!technician) return prev;

      if (crewFormData.technician_ids.includes(technicianId)) {
        return [...prev, technician];
      } else {
        return prev.filter((t) => t.user_id !== technicianId);
      }
    });
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
        await fetchAllTechnicians();
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
                    <TableCell>Техники</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {crewsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : crews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Нет данных
                      </TableCell>
                    </TableRow>
                  ) : (
                    crews.map((crew) => (
                      <TableRow key={crew.m_crew_id}>
                        <TableCell>
                          {crew.m_crew_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{crew.name}</TableCell>
                        <TableCell>{crew.status}</TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {crew.Technicians.map((tech) => (
                              <Chip
                                size="small"
                                avatar={
                                  <Avatar>
                                    <EngineeringIcon fontSize="small" />
                                  </Avatar>
                                }
                                label={`${tech.user_id.substring(0, 8)}...`}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Изменить">
                            <IconButton onClick={() => handleCrewEdit(crew)}>
                              <EditIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Удалить">
                            <IconButton
                              onClick={() => handleCrewDelete(crew.m_crew_id)}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                    <TableCell>Троллейбус</TableCell>
                    <TableCell>Запланировано</TableCell>
                    <TableCell>Завершено</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recordsLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Нет данных
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((record) => (
                      <TableRow key={record.m_record_id}>
                        <TableCell>
                          {record.m_record_id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{record.text}</TableCell>
                        <TableCell>{record.Trolleybus.number}</TableCell>
                        <TableCell>
                          <Checkbox checked={record.planned} disabled />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={record.completed} disabled />
                        </TableCell>
                        <TableCell>
                          {!record.completed && (
                            <Tooltip title="Завершить ТО">
                              <IconButton
                                onClick={() => setCompleteDialog(record)}
                              >
                                <CheckIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Изменить">
                            <IconButton
                              onClick={() => handleRecordEdit(record)}
                            >
                              <EditIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Удалить">
                            <IconButton
                              onClick={() =>
                                handleRecordDelete(record.m_record_id)
                              }
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
      <Dialog
        open={crewDialogOpen}
        onClose={() => handleCloseCrewDialog()}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {dialogMode === "create"
            ? "Добавить бригаду"
            : "Редактировать бригаду"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Имя бригады"
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

            <Typography variant="subtitle1">Выберите техников:</Typography>

            {availableTechnicians.length === 0 ? (
              <Alert severity="info">Нет доступных техников</Alert>
            ) : (
              <List dense sx={{ maxHeight: 300, overflow: "auto" }}>
                {availableTechnicians.map((technician) => (
                  <React.Fragment key={technician.user_id}>
                    <ListItem
                      button
                      onClick={() => handleTechnicianSelect(technician.user_id)}
                      selected={crewFormData.technician_ids.includes(
                        technician.user_id
                      )}
                      sx={{ cursor: "pointer" }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <EngineeringIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={technician.user_id} />
                      {crewFormData.technician_ids.includes(
                        technician.user_id
                      ) && <CheckIcon color="primary" />}
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}

            {crewFormData.technician_ids.length > 0 && (
              <Box>
                <Typography variant="subtitle2">Выбранные техники:</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {crewFormData.technician_ids.map((id) => {
                    const tech = allTechnicians.find((t) => t.user_id === id);
                    return tech ? (
                      <Chip
                        key={tech.user_id}
                        label={`${tech.user_id.substring(0, 8)}...`}
                        onDelete={() => handleTechnicianSelect(tech.user_id)}
                        deleteIcon={<DeleteIcon />}
                        variant="outlined"
                      />
                    ) : null;
                  })}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseCrewDialog()}>Отмена</Button>
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
            ? "Добавить запись о ТО"
            : "Редактировать запись о ТО"}
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
        <DialogTitle>Завершить ТО</DialogTitle>
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
