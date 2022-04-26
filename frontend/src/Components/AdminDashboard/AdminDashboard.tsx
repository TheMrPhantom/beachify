import React, { useEffect, useState } from 'react'
import { doGetRequest, doRequest, secureRandomNumber } from '../Common/StaticFunctions'
import ErrorPage from '../ErrorPage/ErrorPage'
import UserDashboard from '../UserDashboard/UserDashboard'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { QueueReducerType } from '../../Reducer/QueueReducer';
import Songcard from '../Songcard/Songcard';
import { setNextSong, setQueueSongs } from '../../Actions/QueueAction'
import { Button, Link, Typography } from '@mui/material'
import style from './dashboard.module.scss';
import SongTable from './SongTable/SongTable'
import SongArea from '../SongSearch/SongArea'
import { DummySong } from '../Common/Types';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { closeToast, openToast } from '../../Actions/CommonAction';
import Spacer from '../Common/Spacer';

type Props = {}

const AdminDashboard = (props: Props) => {
    const [loggedIn, setloggedIn] = useState(false);
    const queueState: QueueReducerType = useSelector((state: RootStateOrAny) => state.queueReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        doGetRequest("spotify/authentication").then((value) => {
            if (value.code !== 200) {
                dispatch(openToast({
                    message: "", type: "error", duration: 15000, jsxElement: <>
                        Spotify authentifizierung abgelaufen!
                        <Spacer vertical={15} />
                        <Button
                            variant="outlined"
                            onClick={() => {
                                dispatch(closeToast())
                                doGetRequest("spotify/authorize")
                            }}
                        >
                            Erneuern
                        </Button>
                    </>
                }))
            }
        })
    }, [dispatch])


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
            doRequest("spotify/playstate/currentlyPlaying", "GET").then((value) => {
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
    const nextSong = () => {
        if (queueState.songs !== undefined && queueState.songs.length > 0) {
            return <>
                <Typography variant='h4'>Nächster Song</Typography>
                <Songcard song={queueState.songs[0]} />
            </>
        } else {
            return <>
                <Typography variant='h4'>Nächster Song</Typography>
                <Songcard song={DummySong} key={secureRandomNumber()} skeleton />
            </>
        }
    }

    const redirectToSettings = () => {
        navigate("/admin/settings");
    }

    return <div className={style.outterFlex}>
        <Button
            className={style.settingsButton}
            onClick={() => redirectToSettings()}
            variant='outlined'
        >
            <SettingsIcon />
        </Button>
        <div className={style.firstSecondSongDiv}>
            {currentlyPlaying()}
            {nextSong()}
            <SongArea placeholder='Nächsten Song setzen' fullwidth={false} noHelp />
            <SongArea placeholder='Song zur Warteschlage' fullwidth={false} noHelp />
            <SongArea placeholder='Default Playlist' fullwidth={false} noHelp />
        </div>

        {queueState !== undefined && queueState.songs !== undefined && queueState.songs.length > 1 ?
            <SongTable songs={queueState.songs.slice(1)} /> : <></>}
    </div>

    if (!loggedIn) {
        return <ErrorPage loginRequired />
    }

    return (
        <UserDashboard />
    )
}

export default AdminDashboard