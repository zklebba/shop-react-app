import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#9c4dcc',
            main: '#6a1b9a',
            dark: '#38006b',
            contrastText: '#ffffff',
        },

        secondary: {
            light: '#ff6090',
            main: '#e91e63',
            dark: '#b0003a',
            contrastText: '#000000',
        },

        info: {
            light: '#83b9ff',
            main: '#448aff',
            dark: '#005ecb',
            contrastText: '#000000',
        }
    }
});

export default theme;
