import { Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import style from './error.module.scss'

type Props = {
    loginRequired?: boolean
}

const ErrorPage = (props: Props) => {
    const [password, setpassword] = useState("")


    if (props.loginRequired) {
        return <div className={style.login}>
            <Typography variant='h2' align='center'>Bitte melde dich an</Typography>
            <TextField
                placeholder='Passwort'
                variant='outlined'
                type='password'
                className={style.passwordField}
                InputProps={{
                    classes: {
                        input: style.resize,
                    },
                }}
                value={password}
                onChange={(value) => {
                    setpassword(value.target.value)
                }}
            />

            <Button variant='contained' className={style.loginButton}>Login</Button>
            <img src="/svg/Palm-White.svg" alt="Palm" style={{ width: "50%", maxWidth: "300px", minWidth: "150px" }} />
        </div >
    }
    return (
        <div className={style.errorMessage}>
            <Typography variant='h2' align='center'>Bitte öffne den aktuellen Link</Typography>
            <img src="/svg/Palm-White.svg" alt="Palm" style={{ width: "50%", maxWidth: "300px", minWidth: "150px" }} />
        </div>
    )
}

export default ErrorPage