import React, { useState, useEffect, useRef } from 'react'
import SongTableItem from './SongTableItem'
import style from './songtable.module.scss'
import { Typography } from '@mui/material'
import { Song } from '../../Common/Types'
import Divider from '@mui/material/Divider';

type Props = {
    songs: Array<Song>
}

const SongTable = (props: Props) => {

    const [dragDropID, setdragDropID] = useState('')
    const [dragDropDiv, setdragDropDiv] = useState('')
    const [width, setwidth] = useState(0)
    const [dragX, setdragX] = useState(0)
    const [dragY, setdragY] = useState(0)

    const ref: React.RefObject<HTMLDivElement> = useRef(null)

    useEffect(() => {
        document.addEventListener('mouseup', mouseUp);
    }, [])


    const getDragDropClasses = (id: string) => {
        if (id !== dragDropDiv || dragDropID === '') {
            return style.dragDropContainer
        } else {
            return style.dragDropContainer + ' ' + style.expanded
        }
    }

    const getDragDropClassesInner = (id: string) => {
        if (id !== dragDropDiv || dragDropID === '') {
            return style.dragDropIndicatorInner
        } else {
            return style.dragDropIndicatorInner + ' ' + style.expanded
        }
    }

    const mouseUp = () => {
        setwidth(0)
        setdragDropID('')
    }

    const mouseMove = (value: React.MouseEvent<HTMLDivElement>) => {
        if (value.currentTarget.parentElement != null) {
            const target = value.currentTarget;

            // Get the bounding rectangle of target
            const rect = target.getBoundingClientRect();

            // Mouse position
            setdragX(value.clientX - rect.left);
            setdragY(value.clientY - rect.top);
        }
    }

    return (
        <div
            className={style.songtableContainer}
            ref={ref} onMouseMove={(value) => { mouseMove(value) }}

        >
            <Typography variant="h4">Warteschlange</Typography>
            {props.songs.map((song: Song) => {
                return <>
                    <div className={getDragDropClasses(song.trackID)}
                        onMouseEnter={() => setdragDropDiv(song.trackID)}
                        onMouseLeave={() => setdragDropDiv('')}

                    >
                        <Divider className={getDragDropClassesInner(song.trackID)} />
                    </div>
                    <SongTableItem
                        song={song}
                        clickOnDrag={() => { }}
                        style={dragDropID === song.trackID ? {
                            opacity: '0.3',
                            zIndex: 100000
                        } : {
                            display: 'none',
                        }}
                    />

                    <SongTableItem
                        song={song}
                        clickOnDrag={(): void => {
                            if (ref != null && ref.current != null) {
                                setwidth(ref.current.offsetWidth)
                            }
                            setdragDropID(song.trackID)
                        }}
                        style={dragDropID === song.trackID ? {
                            position: 'absolute',
                            left: (dragX - 4) + 'px',
                            top: dragY + 'px',
                            transform: 'translate(-100%, -50%)',
                            width: width > 0 ? width : "",
                            height: "86px"
                        } : {}}
                    />
                </>
            })}
        </div >
    )
}

export default SongTable