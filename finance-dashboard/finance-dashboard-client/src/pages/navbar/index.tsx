import React, { useState } from "react";
import { Link } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import { Box, Typography, useTheme } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";

const NavBar = () => {
  const { palette } = useTheme();
  const [selected, setSelected] = useState("dashboard");
  return (
    <FlexBetween
      marginBottom="0.25rem"
      p="0.5rem 0rem"
      color={palette.grey[300]}
    >
      {/* LEFT SIDE */}
      <FlexBetween gap="0.5rem">
        <PixIcon sx={{ fontSize: "28px" }} />
        <Typography variant="h4" fontSize="1.5rem">
          Finance DashBoard
        </Typography>
      </FlexBetween>
      {/* RIGHT SIDE */}
      <FlexBetween gap="2rem">
        <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
          <Link
            to="/"
            onClick={() => setSelected("dashboard")}
            style={{
              color: selected === "dashboard" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Dashboard
          </Link>
        </Box>
        <Box>
          <Link
            to="/predictions"
            onClick={() => setSelected("predictions")}
            style={{
              color: selected === "predictions" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Predictions
          </Link>
        </Box>
      </FlexBetween>
    </FlexBetween>
  );
};

export default NavBar;
