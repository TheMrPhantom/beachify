import { Divider, Paper, Typography } from '@mui/material'
import React from 'react'
import style from './settingsbox.module.scss'
import Spacer from '../Common/Spacer';

type Props = {
    headline: string,
    short: string,
    description: string,
    icon: JSX.Element,
    input: JSX.Element
}

const Settingsbox = (props: Props) => {
    return (
        <Paper className={style.paper}>
            <div className={style.sideContainer}>
                {React.cloneElement(props.icon, { className: style.icon })}
            </div>
            <div className={style.infoContainer}>
                <Typography variant='h4'>{props.headline}</Typography>
                <Typography variant='h6'>{props.short}</Typography>
                <Typography variant='caption'>
                    {props.description}
                </Typography>
                <Spacer vertical={5} />
                <Divider />
                <Spacer vertical={10} />
                {props.input}
            </div>
        </Paper>
    )
}

export default Settingsbox