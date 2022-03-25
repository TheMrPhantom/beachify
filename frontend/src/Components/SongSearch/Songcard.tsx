import { Paper } from '@mui/material'
import React, { useState } from 'react'
import style from './songcard.module.scss'
import Typography from '@mui/material/Typography';
import commonStyle from '../Common/common.module.scss';
import { title } from 'process';
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

    return (
        <Paper
            className={style.cardContainer + " " + commonStyle.fullWidth + (props.callback !== undefined ? style.cursorPointer : '')}
            elevation={!isHovered ? 2 : 7}
            onClick={() => {
                if (config.DEBUG === true) {
                    console.log('In Songcard: ' + props.songID);
                }
                if (props.callback != undefined) {
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
            <img alt='album cover' src={props.coverURL} className={style.image} />
            <div className={style.textContainer}>
                <Typography variant='h5'><b>{props.title}</b></Typography>
                <Typography variant='h5'>{props.interpret}</Typography>
                <Typography variant='body1'>{props.album}</Typography>
            </div>

        </Paper>
    )
}

export default Songcard