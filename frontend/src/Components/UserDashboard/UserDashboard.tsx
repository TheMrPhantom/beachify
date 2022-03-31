import React, { useEffect, useState } from 'react'
import SongArea from '../SongSearch/SongArea';
import QueueArea from "../SongQueue/QueueArea";
import style from './userdashboard.module.scss';
import { useParams } from 'react-router-dom';
import { getAndStoreAsync } from '../Common/StaticFunctions';

type Props = {}

const UserDashboard = (props: Props) => {
    const params = useParams()
    const [loadedSecretState, setloadedSecretState] = useState(false)
    const [hasCorrectSecret, sethasCorrectSecret] = useState(false)

    useEffect(() => {
        getAndStoreAsync("auth/secret/check/" + params.secret, sethasCorrectSecret).then(() => setloadedSecretState(true))
    }, [])

    return (
        <div className={style.app}>
            <SongArea />
            <QueueArea />
        </div>
    )
}

export default UserDashboard