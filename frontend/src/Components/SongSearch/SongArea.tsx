import React from 'react'
import { TextField } from '@mui/material';
import Songcard from './Songcard';
import style from './songarea.module.scss'
import commonStyle from '../Common/common.module.scss';
import SongListItem from './SongListItem';

type Props = {}

const SongArea = (props: Props) => {
    return (
        <div className={style.container}>
            <TextField
                placeholder='Songtitel'
                variant='standard'
                className={style.textbox}
                InputProps={{
                    classes: {
                        input: style.resize,
                    },
                }} />
            <Songcard
                title='One Hundred'
                interpret='NF'
                album='Perception'
                coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f'
                songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M'
            />
            <Songcard
                title='Two Hundred'
                interpret='NF'
                album='Perception'
                coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f'
                songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M'
            />
            <Songcard
                title='Three Hundred'
                interpret='NF'
                album='Perception'
                coverURL='https://i.scdn.co/image/ab67616d0000b273cd733919ee57d0cc466e152f'
                songID='spotify:track:0zdycLZKxVZ3EA8Nuxo35M'
            />
            <div className={commonStyle.fullWidth + " " + style.lowerContainer}>
                <SongListItem />
                <SongListItem />
                <SongListItem />
                <SongListItem />
                <SongListItem />
            </div>
        </div>
    )
}

export default SongArea