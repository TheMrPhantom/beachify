import React, { useState } from 'react'
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
import { MenuItem, Select, TextField, Typography } from '@mui/material';

type Props = {}

const Settings = (props: Props) => {
    const [listmode, setlistmode] = useState("0")

    const listModeElement: JSX.Element = <Select value={listmode} onChange={value => setlistmode(value.target.value)} fullWidth>
        <MenuItem value="0">Blacklist</MenuItem>
        <MenuItem value="1">Whitelist</MenuItem>
    </Select>

    const [trustmode, settrustmode] = useState("1")

    const trustmodeElement: JSX.Element = <Select value={trustmode} onChange={value => settrustmode(value.target.value)} fullWidth>
        <MenuItem value="0">Genehmigung Benötigt</MenuItem>
        <MenuItem value="1">Freie Wahl</MenuItem>
    </Select>

    const [defaultPlaylist, setdefaultPlaylist] = useState("")

    const defaultPlaylistElement: JSX.Element = <TextField
        placeholder='Standard Playlist'
        variant='outlined'
        fullWidth
        InputProps={{
            classes: {
                input: style.resize,
            },
        }}
        value={defaultPlaylist}
        onChange={(value) => {
            setdefaultPlaylist(value.target.value)
        }}
    />

    const [guesttoken, setguesttoken] = useState("")

    const guesttokenElement: JSX.Element = <TextField
        placeholder='Gäste-Token Text'
        variant='outlined'
        fullWidth
        InputProps={{
            classes: {
                input: style.resize,
            },
        }}
        value={guesttoken}
        onChange={(value) => {
            setguesttoken(value.target.value)
        }}
    />

    const [waitingTime, setwaitingTime] = useState("")

    const waitingTimeElement: JSX.Element = <TextField
        placeholder='Wartezeit'
        variant='outlined'
        type='number'
        fullWidth
        InputProps={{
            inputProps: { min: 0 },
            classes: {
                input: style.resize,
            },
        }}
        value={waitingTime}
        onChange={(value) => {
            setwaitingTime(value.target.value)
        }}
    />

    const [banTime, setbanTime] = useState("")

    const banTimeElement: JSX.Element = <TextField
        placeholder='Banzeit'
        variant='outlined'
        type='number'
        fullWidth
        InputProps={{
            inputProps: { min: 0 },
            classes: {
                input: style.resize,
            },
        }}
        value={banTime}
        onChange={(value) => {
            setbanTime(value.target.value)
        }}
    />


    const [queuestate, setqueuestate] = useState("0")

    const queuestateElement: JSX.Element = <Select value={queuestate} onChange={value => setqueuestate(value.target.value)} fullWidth>
        <MenuItem value="0">Aktiviert</MenuItem>
        <MenuItem value="1">Deaktiviert</MenuItem>
    </Select>

    const [uploadAccepted, setuploadAccepted] = useState("0")

    const uploadAcceptedElement: JSX.Element = <Select value={uploadAccepted} onChange={value => setuploadAccepted(value.target.value)} fullWidth>
        <MenuItem value="0">Aktiviert</MenuItem>
        <MenuItem value="1">Deaktiviert</MenuItem>
    </Select>


    const [retentionTime, setretentionTime] = useState("")

    const retentionTimeElement: JSX.Element = <TextField
        placeholder='Verbleibezeit'
        variant='outlined'
        type='number'
        fullWidth
        InputProps={{
            inputProps: { min: 0 },
            classes: {
                input: style.resize,
            },
        }}
        value={retentionTime}
        onChange={(value) => {
            setretentionTime(value.target.value)
        }}
    />


    return (<div>
        <Typography variant='h4' className={style.container} align='center'>Einstellungen</Typography>

        <div className={style.container}>

            <Settingsbox
                headline={Texts.LIST_MODE_HEADLINE}
                short={Texts.LIST_MODE_SUB_HEADLINE}
                description={Texts.LIST_MODE_SUB_DESCRIPTION}
                icon={<ContrastIcon />}
                input={listModeElement}
            />
            <Settingsbox
                headline={Texts.TRUST_MODE_HEADLINE}
                short={Texts.TRUST_MODE_SUB_HEADLINE}
                description={Texts.TRUST_MODE_SUB_DESCRIPTION}
                icon={<CheckBoxIcon />}
                input={trustmodeElement}
            />
            <Settingsbox
                headline={Texts.DEFAULT_PLAYLIST_HEADLINE}
                short={Texts.DEFAULT_PLAYLIST_SUB_HEADLINE}
                description={Texts.DEFAULT_PLAYLIST_SUB_DESCRIPTION}
                icon={<PlaylistPlayIcon />}
                input={defaultPlaylistElement}
            />
            <Settingsbox
                headline={Texts.GUEST_TOKEN_MODE_HEADLINE}
                short={Texts.GUEST_TOKEN_MODE_SUB_HEADLINE}
                description={Texts.GUEST_TOKEN_MODE_SUB_DESCRIPTION}
                icon={<KeyIcon />}
                input={guesttokenElement}
            />
            <Settingsbox
                headline={Texts.WAITING_TIME_MODE_HEADLINE}
                short={Texts.WAITING_TIME_MODE_SUB_HEADLINE}
                description={Texts.WAITING_TIME_MODE_SUB_DESCRIPTION}
                icon={<HourglassTopIcon />}
                input={waitingTimeElement}
            />

            <Settingsbox
                headline={Texts.BAN_TIME_HEADLINE}
                short={Texts.BAN_TIME_SUB_HEADLINE}
                description={Texts.BAN_TIME_SUB_DESCRIPTION}
                icon={<NotInterestedIcon />}
                input={banTimeElement}
            />

            <Settingsbox
                headline={Texts.QUEUE_STATE_HEADLINE}
                short={Texts.QUEUE_STATE_SUB_HEADLINE}
                description={Texts.QUEUE_STATE_SUB_DESCRIPTION}
                icon={<PlaylistAddIcon />}
                input={queuestateElement}
            />

            <Settingsbox
                headline={Texts.QUEUE_SUBMITTABLE_HEADLINE}
                short={Texts.QUEUE_SUBMITTABLE_SUB_HEADLINE}
                description={Texts.QUEUE_SUBMITTABLE_SUB_DESCRIPTION}
                icon={<FileUploadIcon />}
                input={uploadAcceptedElement}
            />
            <Settingsbox
                headline={Texts.RETENTION_TIME_HEADLINE}
                short={Texts.RETENTION_TIME_SUB_HEADLINE}
                description={Texts.RETENTION_TIME_SUB_DESCRIPTION}
                icon={<HotelIcon />}
                input={retentionTimeElement}
            />
        </div>
    </div>

    )
}

export default Settings