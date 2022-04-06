import React, { useEffect, useState } from 'react'
import { doGetRequest } from '../Common/StaticFunctions'
import ErrorPage from '../ErrorPage/ErrorPage'
import UserDashboard from '../UserDashboard/UserDashboard'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { QueueReducerType } from '../../Reducer/QueueReducer';
import Songcard from '../Songcard/Songcard';
import { setQueueSongs } from '../../Actions/QueueAction'
import { Typography } from '@mui/material'
import style from './dashboard.module.scss';
import SongTable from './SongTable/SongTable'
import SongArea from '../SongSearch/SongArea'

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
    }, [])

    if (queueState.songs.length > 1) {
        return <div className={style.outterFlex}>
            <div className={style.firstSecondSongDiv}>
                <Typography variant="h4">Aktuell spielt</Typography>
                <Songcard song={queueState.songs[0]} playPauseControls noLabel />
                <Typography variant="h4">Nächster Song</Typography>
                <Songcard song={queueState.songs[1]} />
                <SongArea placeholder='Nächsten Song setzen' />
                <SongArea placeholder='Song zur Warteschlage' />
                <SongArea placeholder='Default Playlist' />
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