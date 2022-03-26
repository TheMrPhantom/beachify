import React, { useEffect, useState } from 'react'
import { TextField } from '@mui/material';
import Songcard from './Songcard';
import style from './songarea.module.scss'
import { getAndStore } from '../Common/StaticFunctions';

type Props = {}

const SongArea = (props: Props) => {
    const [searchText, setsearchText] = useState("")
    const [songs, setsongs] = useState([])

    useEffect(() => {
        if (searchText.length === 0) {
            setsongs([]);
            return
        }
        getAndStore("search/song/" + searchText, setsongs)
    }, [searchText])


    const fancyCallBack = (songID: string) => {
        console.log('callback: ' + songID);
    }

    const songlist = (): Array<JSX.Element> => {

        return songs.map((song: any) => {
            return <Songcard
                key={song.trackID}
                title={song.songname}
                interpret={song.interprets[0]}
                album={song.album}
                coverURL={song.coverURL}
                songID={song.trackID}
                callback={fancyCallBack}
            />
        })
    }

    return (
        <div className={style.container}>
            <TextField
                placeholder='Songtitel'
                variant='standard'
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

            {songlist()}

        </div>
    )
}

export default SongArea