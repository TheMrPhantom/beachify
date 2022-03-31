import React, { useEffect, useState } from 'react'
import SongArea from '../SongSearch/SongArea';
import QueueArea from "../SongQueue/QueueArea";
import style from './userdashboard.module.scss';
import { useParams } from 'react-router-dom';
import { getAndStoreAsync } from '../Common/StaticFunctions';
import Cookies from 'js-cookie';
import { Typography } from '@mui/material';

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
            return <div className={style.errorMessage}>
                <Typography variant='h2' align='center'>Bitte öffne den aktuellen Link</Typography>
                <img src="/svg/Palm-White.svg" alt="Palm" style={{ width: "50%", maxWidth: "300px", minWidth: "150px" }} />
            </div>
        }
    }
    return <></>
}

export default UserDashboard