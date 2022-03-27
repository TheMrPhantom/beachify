import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography';
import style from './queuearea.module.scss';
import Songcard from "../SongSearch/Songcard";
import { doGetRequest } from '../Common/StaticFunctions';
import { Song } from '../Common/Types';
import { QueueReducerType } from '../../Reducer/QueueReducer';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setQueueSongs } from '../../Actions/QueueAction';

type Props = {
}

const QueueArea = (props: Props) => {

    const dispatch = useDispatch()
    const queueState: QueueReducerType = useSelector((state: RootStateOrAny) => state.queueReducer);

    useEffect(() => {
        doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
            dispatch(setQueueSongs(value.content))
        })
    }, [dispatch])


    const currentlyPlaying = () => {
        if (queueState.songs.length > 0) {
            return <>
                <Typography variant='h4'>Aktuell spielt:</Typography>
                <Songcard
                    key={queueState.songs[0].trackID}
                    song={queueState.songs[0]}
                />
            </>
        } else {
            return <></>
        }
    }

    const nextSong = () => {
        if (queueState.songs.length > 1) {
            return <>
                <Typography variant='h4'>Nächster Song:</Typography>
                <Songcard
                    key={queueState.songs[1].trackID}
                    song={queueState.songs[1]}
                />
            </>
        } else {
            return <></>
        }
    }

    const queue = () => {
        if (queueState.songs.length > 2) {
            return <>
                <Typography variant='h4'>Warteschlange:</Typography>
                {queueState.songs.slice(2).map((song: Song) => {
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