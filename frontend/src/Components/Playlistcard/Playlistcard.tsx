import { Button, Divider, Paper, Skeleton, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import style from './songcard.module.scss'
import Typography from '@mui/material/Typography';
import config from '../../environment.json'
import { Playlist, Song } from '../Common/Types';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Spacer from '../Common/Spacer';
import Cookies from 'js-cookie';
import { doGetRequest, doPostRequest, doRequest } from '../Common/StaticFunctions';
import { setNextSong, setQueueSongs } from '../../Actions/QueueAction';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { SettingsType } from '../../Reducer/SettingsReducer';
import { setPlaystate } from '../../Actions/SettingsAction';

type Props = {
    playlist: Playlist,
    callback?: (playlist: Playlist) => void
}

const Playlistcard = (props: Props) => {
    const [isHovered, setisHovered] = useState(false);
    const refPaper: React.RefObject<HTMLInputElement> = useRef(null);
    const [imgLoaded, setimgLoaded] = useState(false)
    const [currentTime, setcurrentTime] = useState<Date>(new Date())
    const [skipButtonDisabled, setskipButtonDisabled] = useState(false)
    const dispatch = useDispatch()
    const settingsState: SettingsType = useSelector((state: RootStateOrAny) => state.settingsReducer);
    const cornerElevation = 5
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