import React from 'react'
import Settingsbox from './Settingsbox'
import ContrastIcon from '@mui/icons-material/Contrast';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import KeyIcon from '@mui/icons-material/Key';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import HotelIcon from '@mui/icons-material/Hotel';

import Texts from '../../texts.json';
import style from './settings.module.scss'
import { Typography } from '@mui/material';

type Props = {}

const Settings = (props: Props) => {
    return (<div>
        <Typography variant='h4' className={style.container}>Einstellungen</Typography>

        <div className={style.container}>

            <Settingsbox
                headline={Texts.LIST_MODE_HEADLINE}
                short={Texts.LIST_MODE_SUB_HEADLINE}
                description={Texts.LIST_MODE_SUB_DESCRIPTION}
                icon={<ContrastIcon />}
                input={<div></div>}
            />
            <Settingsbox
                headline={Texts.TRUST_MODE_HEADLINE}
                short={Texts.TRUST_MODE_SUB_HEADLINE}
                description={Texts.TRUST_MODE_SUB_DESCRIPTION}
                icon={<CheckBoxIcon />}
                input={<div></div>}
            />
            <Settingsbox
                headline={Texts.DEFAULT_PLAYLIST_HEADLINE}
                short={Texts.DEFAULT_PLAYLIST_SUB_HEADLINE}
                description={Texts.DEFAULT_PLAYLIST_SUB_DESCRIPTION}
                icon={<PlaylistPlayIcon />}
                input={<div></div>}
            />
            <Settingsbox
                headline={Texts.GUEST_TOKEN_MODE_HEADLINE}
                short={Texts.GUEST_TOKEN_MODE_SUB_HEADLINE}
                description={Texts.GUEST_TOKEN_MODE_SUB_DESCRIPTION}
                icon={<KeyIcon />}
                input={<div></div>}
            />
            <Settingsbox
                headline={Texts.WAITING_TIME_MODE_HEADLINE}
                short={Texts.WAITING_TIME_MODE_SUB_HEADLINE}
                description={Texts.WAITING_TIME_MODE_SUB_DESCRIPTION}
                icon={<HourglassTopIcon />}
                input={<div></div>}
            />

            <Settingsbox
                headline={Texts.BAN_TIME_HEADLINE}
                short={Texts.BAN_TIME_SUB_HEADLINE}
                description={Texts.BAN_TIME_SUB_DESCRIPTION}
                icon={<NotInterestedIcon />}
                input={<div></div>}
            />

            <Settingsbox
                headline={Texts.QUEUE_STATE_HEADLINE}
                short={Texts.QUEUE_STATE_SUB_HEADLINE}
                description={Texts.QUEUE_STATE_SUB_DESCRIPTION}
                icon={<PlaylistAddIcon />}
                input={<div></div>}
            />

            <Settingsbox
                headline={Texts.QUEUE_SUBMITTABLE_HEADLINE}
                short={Texts.QUEUE_SUBMITTABLE_SUB_HEADLINE}
                description={Texts.QUEUE_SUBMITTABLE_SUB_DESCRIPTION}
                icon={<FileUploadIcon />}
                input={<div></div>}
            />
            <Settingsbox
                headline={Texts.RETENTION_TIME_HEADLINE}
                short={Texts.RETENTION_TIME_SUB_HEADLINE}
                description={Texts.RETENTION_TIME_SUB_DESCRIPTION}
                icon={<HotelIcon />}
                input={<div></div>}
            />
        </div>
    </div>

    )
}

export default Settings