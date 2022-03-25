import { Paper } from '@mui/material'
import React, { useState } from 'react'
import style from './songcard.module.scss'
import Typography from '@mui/material/Typography';
import { title } from 'process';

type Props = {
    title: string,
    interpret: string,
    album: string,
    coverURL: string,
    songID: string
}

const Songcard = (props: Props) => {
    const [isHovered, setisHovered] = useState(false);

    return (
        <Paper
            className={style.cardContainer}
            elevation={!isHovered ? 2 : 7}
            onClick={() => {
                console.log(props.songID);
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