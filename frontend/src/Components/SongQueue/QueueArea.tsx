import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography';
import style from './queuearea.module.scss';
import Songcard from "../Songcard/Songcard";
import { doRequest, doGetRequest, secureRandomNumber } from '../Common/StaticFunctions';
import { DummySong, Song } from '../Common/Types';
import { QueueReducerType } from '../../Reducer/QueueReducer';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setNextSong, setQueueSongs } from '../../Actions/QueueAction';
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse';

type Props = {
}

const QueueArea = (props: Props) => {

    const dispatch = useDispatch()
    const queueState: QueueReducerType = useSelector((state: RootStateOrAny) => state.queueReducer);

    useEffect(() => {
        doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
            dispatch(setQueueSongs(value.content))
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
                <Songcard
                    key={queueState.currentlyPlaying.trackID}
                    song={queueState.currentlyPlaying}
                    noLabel
                />
            </>
        } else {
            return <>
                <Typography variant='h4'>Aktuell spielt</Typography>
                <Songcard song={DummySong} key={secureRandomNumber()} skeleton />
            </>
        }
    }

    const nextSong = () => {
        if (queueState.songs.length > 0) {
            return <>
                <Typography variant='h4'>Nächster Song</Typography>
                <Songcard
                    key={queueState.songs[0].trackID}
                    song={queueState.songs[0]}
                    playsIn={queueState.songs[0].startsAt}
                />
            </>
        } else {
            return <></>
        }
    }

    const queue = () => {
        if (queueState.songs.length > 1) {
            return <>
                <Typography variant='h4'>Warteschlange</Typography>
                <TransitionGroup className={style.queueContainer + ' ' + style.noPadding} >
                    {queueState.songs.slice(1).map((song: Song) => {
                        return <Collapse key={song.trackID}>
                            <Songcard
                                song={song}
                                votingPossible
                                playsIn={song.startsAt}
                            />
                        </Collapse>
                    })}
                </TransitionGroup>
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