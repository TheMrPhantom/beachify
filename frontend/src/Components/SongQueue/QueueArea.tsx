import {Paper, TextField} from '@mui/material'
import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import { title } from 'process';
import style from '../SongSearch/songarea.module.scss';
import commonStyle from '../Common/common.module.scss';
import Songcard from "../SongSearch/Songcard";
import Spacer from "../Common/Spacer";

type Props = {
}

const QueueArea = (props: Props) => {

    return (
        <div className={style.container}>
            <Typography variant='h3'>Warteschlange</Typography>
            <Spacer vertical={10} />
            <Songcard title='Lie' interpret='NF' album='Perception' coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f' songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M' />
            <Songcard title='Lie' interpret='NF' album='Perception' coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f' songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M' />
            <Songcard title='Lie' interpret='NF' album='Perception' coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f' songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M' />
            <Songcard title='Lie' interpret='NF' album='Perception' coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f' songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M' />
            <Songcard title='Lie' interpret='NF' album='Perception' coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f' songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M' />
            <Songcard title='Lie' interpret='NF' album='Perception' coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f' songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M' />
            <Songcard title='Lie' interpret='NF' album='Perception' coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f' songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M' />
        </div>
    )
}

export default QueueArea