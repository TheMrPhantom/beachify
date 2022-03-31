import React, { useEffect, useState } from 'react'
import SongArea from '../SongSearch/SongArea';
import QueueArea from "../SongQueue/QueueArea";
import style from './userdashboard.module.scss';
import { useParams } from 'react-router-dom';
import { getAndStoreAsync } from '../Common/StaticFunctions';
import Cookies from 'js-cookie';
import { Typography } from '@mui/material';
import ErrorPage from '../ErrorPage/ErrorPage';

type Props = {}

const UserDashboard = (props: Props) => {
    const params = useParams()
    const [loadedSecretState, setloadedSecretState] = useState(false)
    const [hasCorrectSecret, sethasCorrectSecret] = useState(false)

    useEffect(() => {
        getAndStoreAsync("auth/secret/check/" + params.secret, (value: any) => {
            sethasCorrectSecret(value)
            if (value) {
                Cookies.set("beachifyToken", params.secret ? params.secret : "")
            }
        }).then(() => setloadedSecretState(true))

    }, [hasCorrectSecret, loadedSecretState, params.secret])


    if (loadedSecretState) {
        if (hasCorrectSecret) {
            return (
                <div className={style.app}>
                    <SongArea />
                    <QueueArea />
                </div>
            )
        } else {
            return <ErrorPage />
        }
    }
    return <></>
}

export default UserDashboard