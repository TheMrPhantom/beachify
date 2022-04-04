import React, { useState, useEffect, useRef } from 'react'
import SongTableItem from './SongTableItem'
import style from './songtable.module.scss'
import { Typography } from '@mui/material'

type Props = {}

const SongTable = (props: Props) => {

    const [refs, setrefs] = useState([])

    useEffect(() => {
        const output = []

    }, [])

    const maxWidth = () => {

    }


    return (
        <div className={style.songtableContainer}>
            <Typography variant="h4">Warteschlange</Typography>
            <SongTableItem songname="lala" />
            <SongTableItem songname="lu" />
            <SongTableItem songname="ludfsfdsfdsfd" />
            <SongTableItem approvalPending />
            <SongTableItem />
            <SongTableItem />
            <SongTableItem />
            <SongTableItem approvalPending />
            <SongTableItem />
        </div>
    )
}

export default SongTable