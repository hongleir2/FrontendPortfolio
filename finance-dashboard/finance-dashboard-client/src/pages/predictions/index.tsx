import React from "react";
import { Box, useTheme } from "@mui/material";

const Predictions = () => {
  const { palette } = useTheme();
  return <Box color={palette.grey[300]}>Predictions</Box>;
};

export default Predictions;
