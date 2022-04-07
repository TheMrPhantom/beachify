import React, { useEffect, useState } from 'react'
import { doGetRequest, doRequest, secureRandomNumber } from '../Common/StaticFunctions'
import ErrorPage from '../ErrorPage/ErrorPage'
import UserDashboard from '../UserDashboard/UserDashboard'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { QueueReducerType } from '../../Reducer/QueueReducer';
import Songcard from '../Songcard/Songcard';
import { setNextSong, setQueueSongs } from '../../Actions/QueueAction'
import { Typography } from '@mui/material'
import style from './dashboard.module.scss';
import SongTable from './SongTable/SongTable'
import SongArea from '../SongSearch/SongArea'
import { DummySong } from '../Common/Types';

type Props = {}

const AdminDashboard = (props: Props) => {
    const [loggedIn, setloggedIn] = useState(false)
    const queueState: QueueReducerType = useSelector((state: RootStateOrAny) => state.queueReducer);
    const dispatch = useDispatch()

    useEffect(() => {
        doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
            dispatch(setQueueSongs(value.content))
        })
    }, [dispatch])

    useEffect(() => {
        doGetRequest("auth/login/status").then((value) => {
            if (value.code === 200) {
                setloggedIn(true)
            } else {
                setloggedIn(false)
            }
        })

        if (queueState.currentlyPlaying === null) {
            doRequest("spotiy/playstate/currentlyPlaying", "GET").then((value) => {
                if (value.code === 200) {
                    dispatch(setNextSong(value.content))
                }
            })
        }
    }, [dispatch, queueState.currentlyPlaying])

    const currentlyPlaying = () => {
        if (queueState.currentlyPlaying !== null) {
            return <>
                <Typography variant='h4'>Aktuell spielt</Typography>
                <Songcard song={queueState.currentlyPlaying} playPauseControls noLabel />
            </>
        } else {
            return <>
                <Typography variant='h4'>Aktuell spielt</Typography>
                <Songcard song={DummySong} key={secureRandomNumber()} skeleton />
            </>
        }
    }

    if (queueState.songs.length > 1) {
        return <div className={style.outterFlex}>
            <div className={style.firstSecondSongDiv}>
                {currentlyPlaying()}
                <Typography variant="h4">Nächster Song</Typography>
                <Songcard song={queueState.songs[1]} />
                <SongArea placeholder='Nächsten Song setzen' fullwidth={false} noHelp />
                <SongArea placeholder='Song zur Warteschlage' fullwidth={false} noHelp />
                <SongArea placeholder='Default Playlist' fullwidth={false} noHelp />
            </div>
            <SongTable songs={queueState.songs.slice(2)} />
        </div>
    }

    if (!loggedIn) {
        return <ErrorPage loginRequired />
    }

    return (
        <UserDashboard />
    )
}

export default AdminDashboard