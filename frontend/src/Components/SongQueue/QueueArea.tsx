import { Paper, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { title } from 'process';
import style from './queuearea.module.scss';
import commonStyle from '../Common/common.module.scss';
import Songcard from "../SongSearch/Songcard";
import Spacer from "../Common/Spacer";
import { getAndStore } from '../Common/StaticFunctions';
import { Song } from '../Common/Types';

type Props = {
}

const QueueArea = (props: Props) => {
    const [songs, setsongs] = useState<Array<Song>>([])

    useEffect(() => {
        getAndStore("queue/song", setsongs)
    }, [])


    const currentlyPlaying = () => {
        if (songs.length > 0) {
            return <>
                <Typography variant='h4'>Aktuell spielt:</Typography>
                <Songcard
                    key={songs[0].trackID}
                    song={songs[0]}
                />
            </>
        } else {
            return <></>
        }
    }

    const nextSong = () => {
        if (songs.length > 1) {
            return <>
                <Typography variant='h4'>Nächster Song:</Typography>
                <Songcard
                    key={songs[1].trackID}
                    song={songs[1]}
                />
            </>
        } else {
            return <></>
        }
    }

    const queue = () => {
        if (songs.length > 2) {
            return <>
                <Typography variant='h4'>Warteschlange:</Typography>
                {songs.slice(2).map((song: Song) => {
                    return <Songcard
                        key={song.trackID}
                        song={song}
                    />
                })}
            </>
        } else {
            return <></>
        }
    }

    return (
        <div className={style.outterContainer}>
            <div className={style.currentNextContainer}>
                {currentlyPlaying()}
                {nextSong()}
            </div>
            <div className={style.queueContainer}>
                {queue()}
            </div>
        </div>
    )
}

export default QueueArea