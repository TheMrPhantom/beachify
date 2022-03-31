import { createTheme } from '@mui/material/styles';

const normalPrimary = '#27abc1'
const normalBackground = '#064f61'
const normalText = '#ffffff'
const normalSecondary = '#77b5d9'
const normalAction = '#ffffff'

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
        }, MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: normalText
                }
            }
        }
    },
});

export const themes = [normalTheme]