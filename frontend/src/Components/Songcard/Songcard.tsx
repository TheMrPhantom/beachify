import { Button, Divider, Paper, Skeleton, useTheme } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import style from './songcard.module.scss'
import Typography from '@mui/material/Typography';
import config from '../../environment.json'
import { Song } from '../Common/Types';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Spacer from '../Common/Spacer';
import Cookies from 'js-cookie';
import { doGetRequest, doPostRequest, doRequest } from '../Common/StaticFunctions';
import { setNextSong, setQueueSongs } from '../../Actions/QueueAction';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { SettingsType } from '../../Reducer/SettingsReducer';
import { setPlaystate } from '../../Actions/SettingsAction';

type Props = {
    song: Song,
    votingPossible?: boolean,
    noLabel?: boolean,
    playsIn?: number,
    playPauseControls?: boolean,
    skeleton?: boolean,
    callback?: (song: Song) => void
}

const Songcard = (props: Props) => {
    const [isHovered, setisHovered] = useState(false);
    const refPaper: React.RefObject<HTMLInputElement> = useRef(null);
    const [imgLoaded, setimgLoaded] = useState(false)
    const [currentTime, setcurrentTime] = useState<Date>(new Date())
    const [skipButtonDisabled, setskipButtonDisabled] = useState(false)
    const dispatch = useDispatch()
    const settingsState: SettingsType = useSelector((state: RootStateOrAny) => state.settingsReducer);
    const cornerElevation = 5
    const theme = useTheme();

    useEffect(() => {
        setInterval(() => setcurrentTime(new Date()), 30000);

        if (props.playPauseControls && !props.skeleton) {
            doRequest("spotify/playstate/currentlyPlaying", "GET").then((value) => {
                if (value.code === 200) {
                    dispatch(setNextSong(value.content))
                }
            })
            doRequest("spotify/playstate/playing", "GET").then((value) => {
                if (value.code === 200) {
                    dispatch(setPlaystate(value.content))
                }
            })
        }
    }, [dispatch, props.playPauseControls, props.skeleton])


    const appendTime = () => {
        if (!props.playsIn) {
            return <></>
        }
        return <>
            <Typography variant='caption'>Spielt in {calcTime()} min</Typography>
            <Divider orientation='vertical' className={style.divider} />
        </>
    }

    const calcTime = () => {
        if (props.playsIn) {

            const timeDif = new Date(props.playsIn).getTime() - currentTime.getTime();
            return (timeDif / 1000 / 60).toFixed(0)
        } else {
            return 0;
        }

    }

    const getTopCorner = () => {
        if (props.noLabel || props.skeleton) {
            return <></>
        }

        if (props.callback !== undefined) {
            if (props.song.banned) {
                return <Paper className={style.topCorner} elevation={cornerElevation}>
                    Song gebannt
                </Paper>
            } else if (props.song.alreadyAdded) {
                return <Paper className={style.topCorner} elevation={cornerElevation}>
                    Bereits hinzugefügt
                </Paper>
            } else {
                return <Paper className={style.topCorner} elevation={cornerElevation}>
                    Hinzufügen
                </Paper>
            }

        } else {
            if (!props.song.approvalPending) {
                return <Paper className={style.topCorner} elevation={cornerElevation}>
                    {appendTime()}
                    {props.song.upvotes}
                    <ThumbUpIcon style={{ height: "20px" }} />
                    <Spacer horizontal={5} />
                    {props.song.downvotes}
                    <ThumbDownIcon style={{ height: "20px" }} />
                </Paper>
            } else {
                return <Paper className={style.topCorner} elevation={cornerElevation}>
                    Warte auf Bestätigung
                </Paper>
            }
        }
    }

    const voteUp = () => {
        doRequest("queue/song/upvote", "PUT", props.song.trackID).then(() => {
            setVotedCookie().then(() => {
                doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
                    dispatch(setQueueSongs(value.content))
                })
            })
        })
    }

    const voteDown = () => {
        doRequest("queue/song/downvote", "PUT", props.song.trackID).then(() => {
            setVotedCookie().then(() => {
                doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
                    dispatch(setQueueSongs(value.content))
                })
            })
        })
    }

    const setVotedCookie = async () => {
        const cookieRaw = Cookies.get("voted-songs")
        const cookie = cookieRaw ? cookieRaw : ""
        Cookies.set("voted-songs", cookie + ";" + props.song.databaseID)
    }

    const getVotingButtons = () => {
        if (props.votingPossible&&!props.song.approvalPending) {
            const cookieRaw = Cookies.get("voted-songs")
            const cookie = cookieRaw ? cookieRaw : ""

            const queueID = props.song.databaseID ? props.song.databaseID.toString() : "?"
            if (!cookie.split(";").includes(queueID)) {
                return <>
                    <Spacer vertical={5} />
                    <Divider style={{ width: "100%" }} />
                    <Spacer vertical={10} />
                    <div className={style.upDownButtons}>
                        <Button
                            variant='contained'
                            sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.primary.dark }}
                            onClick={() => voteUp()} >
                            <ThumbUpIcon />
                        </Button>
                        <Button
                            variant='contained'
                            sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.primary.dark }}
                            onClick={() => voteDown()} >
                            <ThumbDownIcon />
                        </Button>
                    </div >
                </>
            }
        }
        return <></>
    }

    const getAdminButtons = () => {
        if (props.playPauseControls) {

            return <>
                <Spacer vertical={5} />
                <Divider style={{ width: "100%" }} />
                <Spacer vertical={10} />
                <div className={style.upDownButtons}>
                    <Button
                        variant='contained'
                        sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.primary.dark }}
                        onClick={() => switchPlayState()} >
                        {settingsState.is_playing ? <PauseIcon /> : <PlayArrowIcon />}

                    </Button>
                    <Button
                        disabled={skipButtonDisabled}
                        variant='contained'
                        sx={{ color: theme.palette.text.primary, backgroundColor: theme.palette.primary.dark }}
                        onClick={() => skipSong()} >
                        <SkipNextIcon />
                    </Button>
                </div >
            </>

        }
        return <></>
    }

    const skipSong = () => {
        setskipButtonDisabled(true)
        setTimeout(() => { setskipButtonDisabled(false) }, 6000)
        doPostRequest("spotify/playstate/skip").then(value => {
            new Promise(v => setTimeout(() => {
                if (value.code === 200) {
                    doRequest("spotify/playstate/currentlyPlaying", "GET").then((value) => {
                        if (value.code === 200) {
                            dispatch(setNextSong(value.content))
                        }
                    })
                }
            }, 1000))
        })
    }

    const switchPlayState = () => {
        doPostRequest("spotify/playstate/toggle").then(value => {
            if (value.code === 200) {
                doRequest("spotify/playstate/playing", "GET").then((value) => {
                    if (value.code === 200) {
                        dispatch(setPlaystate(!settingsState.is_playing))
                    }
                })
            }
        })
    }

    const getPaperClasses = () => {
        let output = style.cardContainer
        if (props.callback !== undefined && !props.song.alreadyAdded) {
            output += " " + style.cursorPointer
        }
        if (props.song.alreadyAdded) {
            output += " " + style.transparent
        }
        return output
    }

    return (
        <Paper
            className={getPaperClasses()}
            sx={{
                position: "relative",
                color: theme.palette.secondary.contrastText
            }}
            elevation={!isHovered ? 3 : 8}
            onClick={() => {
                if (config.DEBUG === true) {
                    console.log('In Songcard: ' + props.song.trackID);
                }
                if (props.song.alreadyAdded) {
                    return
                }
                if (props.callback !== undefined) {
                    props.callback(props.song);
                }
            }}
            onMouseEnter={(value) => {
                setisHovered(true);
            }}
            onMouseLeave={(value) => {
                setisHovered(false);
            }}
        >
            {!props.skeleton ?
                <img src={props.song.coverURL}
                    alt='album cover'
                    className={style.image}
                    style={{ height: refPaper != null && refPaper.current != null ? refPaper.current.offsetHeight : "" }}
                    onLoad={() => setimgLoaded(!imgLoaded)}
                /> : <></>
            }
            <div className={style.textContainer} ref={refPaper}>
                {props.skeleton ?
                    <Skeleton animation="wave" /> :
                    <Typography variant='h5'><b>{props.song.songname}</b></Typography>
                }
                {props.skeleton ?
                    <Skeleton animation="wave" /> :
                    <Typography variant='h5'>{props.song.interpret}</Typography>
                }
                {props.skeleton ?
                    <Skeleton animation="wave" /> :
                    <Typography variant='body1'>{props.song.album}</Typography>
                }
                {getVotingButtons()}
                {getAdminButtons()}
            </div>
            {getTopCorner()}
        </Paper >
    )
}

export default Songcard