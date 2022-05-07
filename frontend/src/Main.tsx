import React from 'react'
import UserDashboard from './Components/UserDashboard/UserDashboard'
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import Settings from './Components/Settings/Settings';
import LandingPage from './Components/LandingPage/LandingPage';

type Props = {}

const Main = (props: Props) => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard/:secret" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/moderator" element={<AdminDashboard />} />
        </Routes>
    )
}

export default Main