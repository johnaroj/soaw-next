```jsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";

import theme from "../../../theme";

<ThemeProvider theme={theme}>
    <SectionAlternate>This is alternative section</SectionAlternate>
</ThemeProvider>