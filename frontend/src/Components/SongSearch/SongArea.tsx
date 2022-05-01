import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import Songcard from '../Songcard/Songcard';
import style from './songarea.module.scss'
import { doGetRequest, doRequest, getAndStore } from '../Common/StaticFunctions';
import { Song } from '../Common/Types';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setQueueSongs } from '../../Actions/QueueAction';
import { openToast } from '../../Actions/CommonAction';

type Props = {
    placeholder?: string
    fullwidth?: boolean
    noHelp?: boolean
}

const SongArea = (props: Props) => {
    const [searchText, setsearchText] = useState("")
    const [songs, setsongs] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        if (searchText !== "" && Cookies.get("search-help") === undefined) {
            Cookies.set("show-search-help", "false")
        }
    }, [searchText])


    useEffect(() => {
        if (searchText.length === 0) {
            setsongs([]);
            return
        }
        getAndStore("search/song/" + searchText, setsongs)
    }, [searchText])


    const addSongtoQueue = async (song: Song) => {
        await doRequest("queue/song", "PUT", song).then((value) => {
            if (value.code !== 200) {
                console.log(value)
                dispatch(openToast({ message: value.content, type: 'error' }))
            } else {
                doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
                    dispatch(setQueueSongs(value.content))
                })
            }
        })
        setsearchText("")
    }

    const songlist = (): Array<JSX.Element> => {
        if (searchText.length === 0) {
            return []
        }
        return songs.map((song: any) => {
            return <Songcard
                key={song.trackID}
                song={song}
                callback={addSongtoQueue}
            />
        })
    }

    return (
        <div className={style.container + (props.fullwidth || props.fullwidth === undefined ? (' ' + style.fullscreen) : '')
        }>
            <TextField
                placeholder={props.placeholder ? props.placeholder : 'Song hinzufügen'}
                variant='standard'
                fullWidth
                className={style.textbox}
                InputProps={{
                    classes: {
                        input: style.resize,
                    },
                }}
                value={searchText}
                onChange={(value) => {
                    setsearchText(value.target.value)
                }}
            />
            {
                songs.length === 0 && Cookies.get("show-search-help") === undefined && !props.noHelp ?
                    <img src="/svg/downloadArrow.svg" alt="React Logo" style={{ width: "50%", maxWidth: "300px", minWidth: "150px" }} /> :
                    <></>
            }
            {songlist()}

        </div >
    )
}

export default SongArea