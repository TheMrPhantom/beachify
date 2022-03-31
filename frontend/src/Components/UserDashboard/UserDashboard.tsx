import React from 'react'
import SongArea from '../SongSearch/SongArea';
import QueueArea from "../SongQueue/QueueArea";
import style from './userdashboard.module.scss';

type Props = {}

const UserDashboard = (props: Props) => {
    return (
        <div className={style.app}>
            <SongArea />
            <QueueArea />
        </div>
    )
}

export default UserDashboard