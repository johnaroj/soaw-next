```jsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";

import theme from "../../../theme";

<ThemeProvider theme={theme}>
    <Section>This is section with default padding</Section>
</ThemeProvider>