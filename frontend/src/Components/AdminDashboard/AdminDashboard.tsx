import React, { useEffect, useState } from 'react'
import { doGetRequest } from '../Common/StaticFunctions'
import ErrorPage from '../ErrorPage/ErrorPage'
import Settings from '../Settings/Settings'
import UserDashboard from '../UserDashboard/UserDashboard'
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

    return <Settings />

    if (!loggedIn) {
        return <ErrorPage loginRequired />
    }

    return (
        <UserDashboard />
    )
}

export default AdminDashboard