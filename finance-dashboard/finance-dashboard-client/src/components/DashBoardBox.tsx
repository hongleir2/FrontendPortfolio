import { styled } from "@mui/system";
import { Box } from "@mui/material";

const DashBoardBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.light,
  borderRadius: "1rem",
  boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.8)",
}));

export default DashBoardBox;
