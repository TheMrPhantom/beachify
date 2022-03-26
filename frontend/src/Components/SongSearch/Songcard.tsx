import { Paper } from '@mui/material'
import React, { useRef, useState } from 'react'
import style from './songcard.module.scss'
import Typography from '@mui/material/Typography';
import commonStyle from '../Common/common.module.scss';
import config from '../../environment.json'

type Props = {
    title: string,
    interpret: string,
    album: string,
    coverURL: string,
    songID: string,
    callback?: (songID: string) => void
}

const Songcard = (props: Props) => {
    const [isHovered, setisHovered] = useState(false);
    const refPaper: React.RefObject<HTMLInputElement> = useRef(null);
    const [imgLoaded, setimgLoaded] = useState(false)

    return (
        <Paper
            className={style.cardContainer + " " + commonStyle.fullWidth + " " + (props.callback !== undefined ? style.cursorPointer : '')}
            elevation={!isHovered ? 2 : 7}
            onClick={() => {
                if (config.DEBUG === true) {
                    console.log('In Songcard: ' + props.songID);
                }
                if (props.callback !== undefined) {
                    props.callback(props.songID);
                }
            }}
            onMouseEnter={(value) => {
                setisHovered(true);
            }}
            onMouseLeave={(value) => {
                setisHovered(false);
            }}
        >
            <img src={props.coverURL}
                alt='album cover'
                className={style.image}
                style={{ height: refPaper != null && refPaper.current != null ? refPaper.current.offsetHeight : "" }}
                onLoad={() => setimgLoaded(!imgLoaded)}
            />
            <div className={style.textContainer} ref={refPaper}>
                <Typography variant='h5'><b>{props.title}</b></Typography>
                <Typography variant='h5'>{props.interpret}</Typography>
                <Typography variant='body1'>{props.album}</Typography>
            </div>

        </Paper>
    )
}

export default Songcard