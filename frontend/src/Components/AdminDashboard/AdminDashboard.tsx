import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { doGetRequest } from '../Common/StaticFunctions'
import ErrorPage from '../ErrorPage/ErrorPage'
import UserDashboard from '../UserDashboard/UserDashboard'
import style from './dashboard.module.scss'

type Props = {}

const AdminDashboard = (props: Props) => {
    const [loggedIn, setloggedIn] = useState(false)

    useEffect(() => {
        doGetRequest("/auth/login/status").then((value) => {
            if (value.code === 200) {
                setloggedIn(true)
            } else {
                setloggedIn(false)
            }
        })
    }, [])

    if (!loggedIn) {
        return <ErrorPage loginRequired />
    }

    return (
        <UserDashboard />
    )
}

export default AdminDashboard