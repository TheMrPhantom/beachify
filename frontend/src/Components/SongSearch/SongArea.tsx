import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import Songcard from './Songcard';
import style from './songarea.module.scss'
import { doRequest, getAndStore } from '../Common/StaticFunctions';
import { Song } from '../Common/Types';
import Cookies from 'js-cookie';
type Props = {}

const SongArea = (props: Props) => {
    const [searchText, setsearchText] = useState("")
    const [songs, setsongs] = useState([])
    const [searchUsed, setsearchUsed] = useState(false)

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
        doRequest("queue/song", "PUT", song)
    }

    const songlist = (): Array<JSX.Element> => {

        return songs.map((song: any) => {
            return <Songcard
                key={song.trackID}
                song={{
                    songname: song.songname,
                    interpret: song.interprets[0],
                    album: song.album,
                    coverURL: song.coverURL,
                    trackID: song.trackID,
                }}
                callback={addSongtoQueue}
            />
        })
    }

    return (
        <div className={style.container}>
            <TextField
                placeholder='Song hinzufügen'
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
            {songs.length === 0 && Cookies.get("show-search-help") === undefined ? <img src="downloadArrow.svg" alt="React Logo" style={{ width: "50%", maxWidth: "300px", minWidth: "150px" }} /> : <></>}
            {songlist()}

        </div>
    )
}

export default SongArea