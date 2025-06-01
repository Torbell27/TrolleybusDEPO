import { Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <Stack direction="row" spacing={2} sx={{ p: 2 }}>
      <Button component={Link} to="/shift" variant="contained">Смена</Button>
      <Button component={Link} to="/crew" variant="contained">Экипаж</Button>
      <Button component={Link} to="/maintenance" variant="contained">Обслуживание</Button>
    </Stack>
  );
};

export default NavigationBar;