import { Button, Paper, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import React from 'react'
import style from './songtable.module.scss'
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import BlockIcon from '@mui/icons-material/Block';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

type Props = {
    songname?: string
    approvalPending?: boolean
}

const SongTableItem = (props: Props) => {
    const theme = useTheme();

    const controllButton = (icon: JSX.Element, callback: () => void, approvalButton: boolean, showAlways?: boolean) => {
        let disabled = approvalButton;
        if (props.approvalPending) {
            disabled = !disabled;
        }
        if (showAlways) {
            disabled = false;
        }
        return <Button
            className={disabled ? style.disabled : ""}
            disabled={disabled}
            sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.primary.dark }}
            onClick={() => callback()}>
            {icon}
        </Button>
    }

    const paperClasses = () => {
        let output = style.itemPaper;
        if (props.approvalPending) {
            output += ' ' + style.approvalPending;
        }
        return output;
    }

    const buttonContainerClasses = () => {
        let output = style.buttonContainer;
        if (props.approvalPending) {
            output += ' ' + style.padRight;
        }
        return output;
    }

    const dragField = () => {
        if (!props.approvalPending) {
            return <div className={style.dragger}>
                <DragIndicatorIcon />
            </div>
        } else {
            return <></>
        }
    }

    return (
        <Paper className={paperClasses()}>
            <div className={style.leftSide}>
                <div className={style.songInfo}>
                    <Typography variant="h6">Platzhalter song {props.songname}</Typography>
                    <Typography variant="caption">Platzhalter album</Typography>
                </div>
            </div>
            <div className={style.rightSide}>
                <div className={buttonContainerClasses()}>
                    {controllButton(<BlockIcon />, () => { }, false, true)}
                    {controllButton(<DeleteIcon />, () => { }, true, true)}
                    {controllButton(<CheckIcon />, () => { }, true)}
                </div>
                {dragField()}
            </div>
        </Paper>
    )
}



export default SongTableItem