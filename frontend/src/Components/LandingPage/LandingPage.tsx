import { Button } from '@mui/material'
import React from 'react'
import style from './landingpage.module.scss'
import { useNavigate } from 'react-router-dom';

type Props = {}

const LandingPage = (props: Props) => {

    const navigate = useNavigate();

    const toAdminPage = () => {
        navigate("/admin")
    }

    return (
        <div className={style.main}>
            <Button
                variant='contained'
                onClick={() => toAdminPage()}
            >
                Admin Interface
            </Button>
        </div>
    )
}

export default LandingPage