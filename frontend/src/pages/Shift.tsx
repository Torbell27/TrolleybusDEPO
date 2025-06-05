import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { formatISO, startOfToday } from "date-fns";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const DEFAULT_LIMIT = 4;

const ShiftPage = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [firstStartTime, setFirstStartTime] = useState("06:00");
  const [firstEndTime, setFirstEndTime] = useState("14:00");
  const [secondStartTime, setSecondStartTime] = useState("14:00");
  const [secondEndTime, setSecondEndTime] = useState("22:00");
  const [crews, setCrews] = useState([]);
  const [firstCrewId, setFirstCrewId] = useState("");
  const [secondCrewId, setSecondCrewId] = useState("");
  const [shifts, setShifts] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  const [endNowShiftId, setEndNowShiftId] = useState<string | null>(null);
  const [endNowShiftTime, setEndNowShiftTime] = useState<Date | null>(null);
  const [unplannedEnd, setUnplannedEnd] = useState(false);
  const [manualEndHour, setManualEndHour] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [pageShifts, setPageShifts] = useState<number>(1);
  const [totalShifts, setTotalShifts] = useState<number>(0);

  useEffect(() => {
    fetchCrews();
    fetchShifts(pageShifts);
  }, [pageShifts]);

  const fetchCrews = async () => {
    const res = await api.get("/shift/crew");
    setCrews(res.data.crews || []);
  };

  const fetchShifts = async (pageNumber: number) => {
    try {
      const res = await api.get(`/shift?sort=${sortOrder}`, {
        params: { page: pageNumber - 1 },
      });
      setShifts(res.data.formattedShifts);
      setTotalShifts(res.data.total);
    } catch (error) {
      console.error("Ошибка при получении кондукторов");
    }
  };

  const handleCreateShift = async (
    crewId: string,
    first: boolean,
    startTime: string,
    endTime: string
  ) => {
    const selectedDate = date ? new Date(date) : new Date();
    const [startHour, startMinute] = startTime.split(":");
    const startDate = new Date(selectedDate.getTime());
    startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

    const [endHour, endMinute] = endTime.split(":");
    const endDate = new Date(selectedDate.getTime());
    endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
    await api.post("/shift", {
      crew_id: crewId,
      first_shift: first,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
    });
    fetchShifts(pageShifts);
  };

  const handleDeleteShift = async (shiftId) => {
    await api.delete(`/shift/${shiftId}`);
    setShowDeleteDialog(false);
    fetchShifts(pageShifts); // перезагрузка списка
  };

  const handleEndShift = async () => {
    if (!endNowShiftId) return;

    const body: any = { completed: true };

    if (unplannedEnd && manualEndHour) {
      const now = new Date();
      now.setHours(parseInt(manualEndHour), 0);
      body.end_time = now.toISOString();
    }

    await api.patch(`/shift/${endNowShiftId}/end`, body);
    setEndNowShiftId(null);
    setUnplannedEnd(false);
    setManualEndHour("");
    fetchShifts(pageShifts);
  };

  const crewsOptions = crews.map((crew) => (
    <MenuItem key={crew.crew_id} value={crew.crew_id}>
      Экипаж: {crew.Driver?.User?.name} / {crew.Conductor?.User?.name}
    </MenuItem>
  ));
  const totalPagesShifts = Math.ceil(totalShifts / DEFAULT_LIMIT);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Управление сменами
        </Typography>

        <Grid container spacing={2}>
          <Grid display="flex" size="grow">
            <DatePicker
              sx={{ minWidth: 200 }}
              label="Дата смены"
              value={date}
              minDate={startOfToday()}
              onChange={setDate}
              renderInput={(params) => <TextField fullWidth {...params} />}
            />
            <TextField
              label="Начало (1 смена)"
              type="time"
              fullWidth
              value={firstStartTime}
              onChange={(e) => setFirstStartTime(e.target.value)}
            />
            <TextField
              label="Конец (1 смена)"
              type="time"
              fullWidth
              value={firstEndTime}
              onChange={(e) => setFirstEndTime(e.target.value)}
            />
            <TextField
              label="Начало (2 смена)"
              type="time"
              fullWidth
              value={secondStartTime}
              onChange={(e) => setSecondStartTime(e.target.value)}
            />
            <TextField
              label="Конец (2 смена)"
              type="time"
              fullWidth
              value={secondEndTime}
              onChange={(e) => setSecondEndTime(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>1 смена</InputLabel>
              <Select
                value={firstCrewId}
                onChange={(e) => setFirstCrewId(e.target.value)}
              >
                {crewsOptions}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>2 смена</InputLabel>
              <Select
                value={secondCrewId}
                onChange={(e) => setSecondCrewId(e.target.value)}
              >
                {crewsOptions}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              onClick={() => {
                if (firstCrewId)
                  handleCreateShift(
                    firstCrewId,
                    true,
                    firstStartTime,
                    firstEndTime
                  );
                if (secondCrewId)
                  handleCreateShift(
                    secondCrewId,
                    false,
                    secondStartTime,
                    secondEndTime
                  );
              }}
            >
              Назначить смены
            </Button>
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="h6">Список смен</Typography>
          <Table component={Paper}>
            <TableHead>
              <TableRow>
                <TableCell
                  onClick={() => {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc"),
                      fetchShifts(pageShifts);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Начало смены ⬍
                </TableCell>
                <TableCell>Экипаж</TableCell>
                <TableCell>Первая смена</TableCell>
                <TableCell>Конец смены</TableCell>
                <TableCell>Завершена</TableCell>
                <TableCell>Завершить смену</TableCell>
                <TableCell>Удалить смену</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift.shift_id}>
                  <TableCell>
                    {new Date(shift.start_time).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {shift.Crew?.Driver?.User?.name} /{" "}
                    {shift.Crew?.Conductor?.User?.name}
                  </TableCell>
                  <TableCell>{shift.first_shift ? "Да" : "Нет"}</TableCell>
                  <TableCell>
                    {shift.end_time
                      ? new Date(shift.end_time).toLocaleTimeString()
                      : "-"}
                  </TableCell>
                  <TableCell>{shift.completed ? "Да" : "Нет"}</TableCell>
                  <TableCell>
                    {!shift.completed && (
                      <IconButton
                        onClick={() => {
                          setEndNowShiftId(shift.shift_id);
                          setEndNowShiftTime(shift.start_time);
                        }}
                      >
                        <DoneIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedShiftId(shift.shift_id);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPagesShifts > 1 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                count={totalPagesShifts}
                page={pageShifts}
                onChange={(_, value) => setPageShifts(value)}
                color="primary"
              />
            </Box>
          )}
          <Dialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
          >
            <DialogTitle>Удалить смену?</DialogTitle>
            <DialogContent>
              Вы уверены, что хотите удалить эту смену?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteDialog(false)}>Отмена</Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => handleDeleteShift(selectedShiftId)}
              >
                Удалить
              </Button>
            </DialogActions>
          </Dialog>

          {endNowShiftId && (
            <Box mt={2} p={2} component={Paper}>
              <Typography>
                Завершить смену {new Date(endNowShiftTime).toLocaleString()}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={unplannedEnd}
                    onChange={(e) => setUnplannedEnd(e.target.checked)}
                  />
                }
                label="Внеплановое завершение"
              />
              {unplannedEnd && (
                <TextField
                  label="Час завершения (0-23)"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0, max: 23 }}
                  value={manualEndHour}
                  onChange={(e) => setManualEndHour(e.target.value)}
                  style={{ marginTop: "8px" }}
                />
              )}
              <Button
                variant="contained"
                onClick={handleEndShift}
                style={{ marginTop: "12px" }}
              >
                Подтвердить завершение
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default ShiftPage;
