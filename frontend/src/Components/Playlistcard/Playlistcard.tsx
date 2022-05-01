import { Paper, useTheme } from '@mui/material'
import React, { useRef, useState } from 'react'
import style from './songcard.module.scss'
import Typography from '@mui/material/Typography';
import { Playlist } from '../Common/Types';

type Props = {
    playlist: Playlist,
    callback?: (playlist: Playlist) => void
}

const Playlistcard = (props: Props) => {
    const [isHovered, setisHovered] = useState(false);
    const refPaper: React.RefObject<HTMLInputElement> = useRef(null);
    const [imgLoaded, setimgLoaded] = useState(false)
    const theme = useTheme();

    const getPaperClasses = () => {
        let output = style.cardContainer
        if (props.callback !== undefined) {
            output += " " + style.cursorPointer
        }

        return output
    }

    return (
        <Paper
            className={getPaperClasses()}
            sx={{
                position: "relative",
                color: theme.palette.secondary.contrastText
            }}
            elevation={!isHovered ? 3 : 8}
            onClick={() => {
                if (props.callback !== undefined) {
                    props.callback(props.playlist);
                }
            }}
            onMouseEnter={(value) => {
                setisHovered(true);
            }}
            onMouseLeave={(value) => {
                setisHovered(false);
            }}
        >
            <img src={props.playlist.coverURL}
                alt='album cover'
                className={style.image}
                style={{ height: refPaper != null && refPaper.current != null ? refPaper.current.offsetHeight : "" }}
                onLoad={() => setimgLoaded(!imgLoaded)}
            />
            <div className={style.textContainer} ref={refPaper}>
                <Typography variant='h5'><b>{props.playlist.playlistname}</b></Typography>
            </div>
        </Paper >
    )
}

export default Playlistcard