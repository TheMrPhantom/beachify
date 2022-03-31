import { createTheme } from '@mui/material/styles';

const normalPrimary = '#39AEA9'
const normalBackground = '#0e2858'
const normalText = '#ffffff'
const normalSecondary = '#77b5d9'
const normalAction = '#E2D784'

export const normalTheme = createTheme({
    palette: {
        primary: {
            main: normalPrimary
        },
        secondary: {
            main: normalSecondary
        },
        background: {
            default: normalBackground
        },
        text: {
            primary: normalText
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: normalSecondary
                }
            }
        }, MuiButton: {
            styleOverrides: {
                root: {
                    color: normalAction,
                },
                outlined: {
                    borderColor: "#c8c8c8",
                    '&:hover': {
                        borderColor: '#989898'
                    }
                }
            },
        }, MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: normalPrimary
                }
            }
        }
    },
});

export const themes = [normalTheme]