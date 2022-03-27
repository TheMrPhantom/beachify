import { Paper, useTheme } from '@mui/material'
import React, { useRef, useState } from 'react'
import style from './songcard.module.scss'
import Typography from '@mui/material/Typography';
import commonStyle from '../Common/common.module.scss';
import config from '../../environment.json'
import { Song } from '../Common/Types';

type Props = {
    song: Song,
    callback?: (song: Song) => void
}

const Songcard = (props: Props) => {
    const [isHovered, setisHovered] = useState(false);
    const refPaper: React.RefObject<HTMLInputElement> = useRef(null);
    const [imgLoaded, setimgLoaded] = useState(false)
    const theme = useTheme();

    const getTopCorner = () => {
        if (props.callback !== undefined
        ) {
            return <div className={style.topCorner}>
                Hinzufügen
            </div>
        } else {
            return <></>
        }
    }

    return (
        <Paper
            className={style.cardContainer + " " + " " + (props.callback !== undefined ? style.cursorPointer : '')}
            sx={{
                borderRadius: "0px 25px 5px 0px",
                position: "relative",
                color: theme.palette.secondary.contrastText
            }}
            elevation={!isHovered ? 1 : 3}
            onClick={() => {
                if (config.DEBUG === true) {
                    console.log('In Songcard: ' + props.song.trackID);
                }
                if (props.callback !== undefined) {
                    props.callback(props.song);
                }
            }}
            onMouseEnter={(value) => {
                setisHovered(true);
            }}
            onMouseLeave={(value) => {
                setisHovered(false);
            }}
        >
            <img src={props.song.coverURL}
                alt='album cover'
                className={style.image}
                style={{ height: refPaper != null && refPaper.current != null ? refPaper.current.offsetHeight : "" }}
                onLoad={() => setimgLoaded(!imgLoaded)}
            />
            <div className={style.textContainer} ref={refPaper}>
                <Typography variant='h5'><b>{props.song.songname}</b></Typography>
                <Typography variant='h5'>{props.song.interpret}</Typography>
                <Typography variant='body1'>{props.song.album}</Typography>
            </div>
            {getTopCorner()}
        </Paper>
    )
}

export default Songcard