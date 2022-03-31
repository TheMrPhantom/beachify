import React from 'react'
import UserDashboard from './Components/UserDashboard/UserDashboard'
import { Route, Routes } from 'react-router-dom';

type Props = {}

const Main = (props: Props) => {
    return (
        <Routes>
            <Route path="/dashboard/:secret" element={<UserDashboard />} />
            <Route path="/admin" element={<UserDashboard />} />
        </Routes>
    )
}

export default Main