import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";

// Create a theme instance.
const theme = responsiveFontSizes(
  createTheme({
    palette,
    typography: {
      ...typography,
      fontFamily: "Roboto",
    },
    zIndex: {
      appBar: 1200,
      drawer: 1100,
    },
  })
);

export default theme;
