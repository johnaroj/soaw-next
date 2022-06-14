```jsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { colors } from "@mui/material";

import theme from "../../../theme";

<ThemeProvider theme={theme}>
    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <IconText fontIconClass="fas fa-users" color={colors.pink[50]} title="Users Icon Text" />
        <IconText fontIconClass="far fa-address-book" color={colors.purple[500]} title="Book Icon Text" />
        <IconText fontIconClass="fab fa-angellist" color={colors.blue[500]} title="Cool Icon Text" />
        <IconText fontIconClass="fas fa-phone-alt"  color={colors.green[500]} title="Phone Icon Text" />
    </div>
</ThemeProvider>