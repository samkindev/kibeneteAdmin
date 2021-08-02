import { createTheme } from '@material-ui/core';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#119DFD',
            light: 'rgba(17, 157, 253, 0.25)',
            contrastText: "#fff",
        },
        secondary: {
            main: '#FF03A5',
            light: '#FF03A518',
        }
    }
});