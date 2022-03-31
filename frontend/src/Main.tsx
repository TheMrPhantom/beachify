import React from 'react'
import UserDashboard from './Components/UserDashboard/UserDashboard'
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';

type Props = {}

const Main = (props: Props) => {
    return (
        <Routes>
            <Route path="/dashboard/:secret" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    )
}

export default Main