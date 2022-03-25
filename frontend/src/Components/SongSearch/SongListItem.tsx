import { Typography } from '@mui/material'
import React from 'react';
import style from './songlistitem.module.scss';
import Spacer from '../Common/Spacer';
type Props = {}

const SongListItem = (props: Props) => {
  return (
    <div className={style.container}>
        <Typography variant="h5">Tieltitit</Typography>
        <Spacer horizontal={20}/>
        -
        <Spacer horizontal={20}/>
        <Typography variant="h6">interprettttttt</Typography>
    </div>
  )
}

export default SongListItem