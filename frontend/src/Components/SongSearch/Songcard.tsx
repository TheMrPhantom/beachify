import { Button, Divider, Paper, useTheme } from '@mui/material'
import React, { useRef, useState } from 'react'
import style from './songcard.module.scss'
import Typography from '@mui/material/Typography';
import config from '../../environment.json'
import { Song } from '../Common/Types';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Spacer from '../Common/Spacer';
import Cookies from 'js-cookie';
import { doGetRequest, doRequest } from '../Common/StaticFunctions';
import { useDispatch } from 'react-redux';
import { setQueueSongs } from '../../Actions/QueueAction';

type Props = {
    song: Song,
    votingPossible?: boolean
    noLabel?: boolean
    callback?: (song: Song) => void
}

const Songcard = (props: Props) => {
    const [isHovered, setisHovered] = useState(false);
    const refPaper: React.RefObject<HTMLInputElement> = useRef(null);
    const [imgLoaded, setimgLoaded] = useState(false)
    const dispatch = useDispatch()

    const theme = useTheme();

    const getTopCorner = () => {
        if (props.noLabel) {
            return <></>
        }

        if (props.callback !== undefined) {
            if (props.song.alreadyAdded) {
                return <div className={style.topCorner}>
                    Bereits hinzugefügt
                </div>
            } else {
                return <div className={style.topCorner}>
                    Hinzufügen
                </div>
            }

        } else {
            if (!props.song.approvalPending) {
                return <div className={style.topCorner}>
                    {props.song.upvotes}
                    <ThumbUpIcon style={{ height: "20px" }} />
                    <Spacer horizontal={5} />
                    {props.song.downvotes}
                    <ThumbDownIcon style={{ height: "20px" }} />
                </div>
            } else {
                return <div className={style.topCorner}>
                    Warte auf Bestätigung
                </div>
            }
        }
    }

    const voteUp = () => {
        doRequest("queue/song/upvote", "PATCH", props.song.trackID).then(() => {
            setVotedCookie().then(() => {
                doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
                    dispatch(setQueueSongs(value.content))
                })
            })
        })
    }

    const voteDown = () => {
        doRequest("queue/song/downvote", "PATCH", props.song.trackID).then(() => {
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
        if (props.votingPossible) {
            const cookieRaw = Cookies.get("voted-songs")
            const cookie = cookieRaw ? cookieRaw : ""

            const queueID = props.song.databaseID ? props.song.databaseID.toString() : "?"
            if (!cookie.includes(queueID)) {
                return <>
                    <Spacer vertical={5} />
                    <Divider style={{ width: "100%" }} />
                    <Spacer vertical={5} />
                    <div className={style.upDownButtons}>
                        <Button sx={{ color: theme.palette.text.secondary }} onClick={() => voteUp()} ><ThumbUpIcon /></Button>
                        <Button sx={{ color: theme.palette.text.secondary }} onClick={() => voteDown()} ><ThumbDownIcon /></Button>
                    </div >
                </>
            }
        }
        return <></>
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
                borderRadius: "0px 25px 5px 0px",
                position: "relative",
                color: theme.palette.secondary.contrastText
            }}
            elevation={!isHovered ? 1 : 3}
            onClick={() => {
                if (config.DEBUG === true) {
                    console.log('In Songcard: ' + props.song.trackID);
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
            <img src={props.song.coverURL}
                alt='album cover'
                className={style.image}
                style={{ height: refPaper != null && refPaper.current != null ? refPaper.current.offsetHeight : "" }}
                onLoad={() => setimgLoaded(!imgLoaded)}
            />
            <div className={style.textContainer} ref={refPaper}>
                <Typography variant='h5'><b>{props.song.songname}</b></Typography>
                <Typography variant='h5'>{props.song.interpret}</Typography>
                <Typography variant='body1'>{props.song.album}</Typography>
                {getVotingButtons()}
            </div>
            {getTopCorner()}
        </Paper >
    )
}

export default Songcard