import React, { useEffect, useState } from 'react'
import { doGetRequest, doPostRequest, doRequest, secureRandomNumber } from '../Common/StaticFunctions'
import ErrorPage from '../ErrorPage/ErrorPage'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { QueueReducerType } from '../../Reducer/QueueReducer';
import Songcard from '../Songcard/Songcard';
import { setNextSong, setQueueSongs } from '../../Actions/QueueAction'
import { Button, Typography } from '@mui/material'
import style from './dashboard.module.scss';
import SongTable from './SongTable/SongTable'
import SongArea from '../SongSearch/SongArea'
import { DummySong } from '../Common/Types';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { closeToast, openToast } from '../../Actions/CommonAction';
import Spacer from '../Common/Spacer';
import Cookies from 'js-cookie';
import { setPlaystate } from '../../Actions/SettingsAction';

type Props = {}

const AdminDashboard = (props: Props) => {
    const [loggedIn, setloggedIn] = useState(false);
    const queueState: QueueReducerType = useSelector((state: RootStateOrAny) => state.queueReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        doGetRequest("spotify/authentication").then((value) => {
            if (value.code !== 200 && loggedIn) {
                dispatch(openToast({
                    message: "", type: "error", duration: 15000, jsxElement: <>
                        Spotify authentifizierung abgelaufen!
                        <Spacer vertical={15} />
                        <Button
                            variant="outlined"
                            onClick={() => {
                                dispatch(closeToast())
                                doGetRequest("spotify/authorize").then(value => {
                                    if (value.code === 200) {
                                        window.location = value.content
                                    }
                                })
                            }}
                        >
                            Erneuern
                        </Button>
                    </>
                }))
            }
        })
        doPostRequest("login", Cookies.get("password")).then(value => {
            if (value.code === 200) {
                setloggedIn(true)
            } else {
                setloggedIn(false)
            }
        })
    }, [dispatch, loggedIn])


    useEffect(() => {
        doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
            if (value.code === 200) {
                dispatch(setQueueSongs(value.content))
            }
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
                <Songcard song={DummySong} key={secureRandomNumber()} playPauseControls skeleton />
            </>
        }
    }
    const nextSong = () => {
        if (queueState.songs !== undefined && queueState.songs.length > 0 && queueState.songs[0].is_next) {
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
        if (!window.location.pathname.includes("moderator")) {
            navigate("/admin/settings");
        } else {
            dispatch(openToast({ message: "Du kannst das nicht mit der Moderations-Seite tun", type: "error" }))
        }
    }

    const getSongTable = (): JSX.Element => {
        if (queueState !== undefined && queueState.songs !== undefined && queueState.songs.length > 0) {
            if (queueState.songs[0].is_next) {
                if (queueState.songs.length > 1) {
                    return <SongTable songs={queueState.songs.slice(1)} />
                }
            } else {
                return <SongTable songs={queueState.songs} />
            }
        }
        return <></>

    }

    if (!loggedIn) {
        return <ErrorPage login={(password) => {
            Cookies.set("password", password, { secure: true })
            doRequest("spotify/playstate/currentlyPlaying", "GET").then((value) => {
                if (value.code === 200) {
                    dispatch(setNextSong(value.content))
                }
            });
            doRequest("spotify/playstate/playing", "GET").then((value) => {
                if (value.code === 200) {
                    dispatch(setPlaystate(value.content))
                }
            });
            doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
                if (value.code === 200) {
                    dispatch(setQueueSongs(value.content))
                }
            });
            setloggedIn(true)
        }} />
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
            <SongArea placeholder='Nächsten Song setzen' fullwidth={false} noHelp nextSong />
            <SongArea placeholder='Song zur Warteschlage' fullwidth={false} noHelp />
        </div>

        {getSongTable()}
    </div>
}

export default AdminDashboard