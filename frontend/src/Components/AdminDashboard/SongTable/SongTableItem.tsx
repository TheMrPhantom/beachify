import { Button, Paper, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import React, { useRef, useEffect, useState } from 'react'
import style from './songtable.module.scss'
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Song } from '../../Common/Types';
import Zoom from '@mui/material/Zoom';

type Props = {
    song: Song,
    clickOnDrag: () => void
    style?: React.CSSProperties
}

const SongTableItem = (props: Props) => {
    const theme = useTheme();
    const [reload, setreload] = useState(0)
    const ref: React.RefObject<HTMLDivElement> = useRef(null);
    const refOutterContainer: React.RefObject<HTMLDivElement> = useRef(null);

    useEffect(() => {
        const r = reload;
        setreload(p => p + 1)
    }, [ref])

    const controllButton = (icon: JSX.Element, callback: () => void, approvalButton: boolean, showAlways?: boolean) => {
        let disabled = approvalButton;
        if (props.song.approvalPending) {
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
        if (props.song.approvalPending) {
            output += ' ' + style.approvalPending;
        }
        return output;
    }

    const buttonContainerClasses = () => {
        let output = style.buttonContainer;
        if (props.song.approvalPending) {
            output += ' ' + style.padRight;
        }
        return output;
    }

    const dragField = () => {
        if (!props.song.approvalPending) {
            return <div className={style.dragger}>
                <DragIndicatorIcon />
            </div>
        } else {
            return <></>
        }
    }

    return (
        <Paper className={paperClasses()} onMouseDown={() => props.clickOnDrag()} style={props.style}>
            <div className={style.leftContainer} ref={refOutterContainer}>
                <Zoom in={ref != null && ref.current != null} mountOnEnter unmountOnExit key={props.song.trackID}>
                    <img src={props.song.coverURL} alt="album cover" style={{ height: ref != null && ref.current != null ? ref.current.offsetHeight : "" }} />
                </Zoom>
                <div className={style.leftSide} ref={ref}>
                    <div className={style.songInfo}>
                        <Typography variant="h6">{props.song.songname}</Typography>
                        <Typography variant="caption">{props.song.album}</Typography>
                    </div>
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

        </ Paper>
    )
}



export default SongTableItem