import { Button, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { openToast } from '../../Actions/CommonAction'
import { doPostRequest } from '../Common/StaticFunctions'
import style from './error.module.scss'

type Props = {
    login?: (password: string) => void
}

const ErrorPage = (props: Props) => {
    const [password, setpassword] = useState("")
    const dispatch = useDispatch()

    if (props.login) {
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

            <Button
                variant='contained'
                className={style.loginButton}
                onClick={() => {
                    doPostRequest("login", password).then(value => {
                        if (value.code === 200) {
                            if (props.login) {
                                props.login(password)
                            }
                        } else {
                            dispatch(openToast({ message: "Falsches Passwort!", type: 'error', duration: 3000 }))
                        }
                    })
                }}
            >Login</Button>
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