import React, { useEffect } from 'react'
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
import { Button, MenuItem, Select, TextField, Typography } from '@mui/material';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setAllSettings, setDefaultBantime, setDefaultplaylist, setGuestToken, setListmode, setQueueState, setQueueSubmittable, setRetentionTime, setTrustmode, setWaitingTime } from '../../Actions/SettingsAction';
import { doGetRequest, doRequest } from '../Common/StaticFunctions';
import { SettingsType } from '../../Reducer/SettingsReducer';
import Spacer from '../Common/Spacer';
import { useNavigate } from 'react-router-dom';

type Props = {}

const Settings = (props: Props) => {
    const dispatch = useDispatch()
    const settingsState: SettingsType = useSelector((state: RootStateOrAny) => state.settingsReducer);
    const navigate = useNavigate();

    useEffect(() => {
        doGetRequest("setting").then((value) => {
            dispatch(setAllSettings(value.content))
        })
    }, [dispatch])


    const listModeElement: JSX.Element = <Select
        value={settingsState.listMode}
        onChange={value => doRequest("setting/listMode", "PUT", value.target.value).then((value) => dispatch(setListmode(value.content)))}
        fullWidth
    >
        <MenuItem value="blacklist">Blacklist</MenuItem>
        <MenuItem value="whitelist">Whitelist</MenuItem>
    </Select>


    const trustmodeElement: JSX.Element = <Select
        value={settingsState.trustMode}
        onChange={value => doRequest("setting/trustMode", "PUT", value.target.value).then((value) => dispatch(setTrustmode(value.content)))}
        fullWidth
    >
        <MenuItem value="approval">Genehmigung Benötigt</MenuItem>
        <MenuItem value="no_approval">Freie Wahl</MenuItem>
    </Select>


    const defaultPlaylistElement: JSX.Element = <TextField
        placeholder='Standard Playlist'
        variant='outlined'
        fullWidth
        InputProps={{
            classes: {
                input: style.resize,
            },
        }}
        value={settingsState.defaultPlaylist}
        onChange={value => doRequest("setting/defaultPlaylist", "PUT", value.target.value).then((value) => dispatch(setDefaultplaylist(value.content)))}
    />



    const guesttokenElement: JSX.Element = <TextField
        placeholder='Gäste-Token Text'
        variant='outlined'
        fullWidth
        InputProps={{
            classes: {
                input: style.resize,
            },
        }}
        value={settingsState.guestToken}
        onChange={value => doRequest("setting/guestToken", "PUT", value.target.value).then((value) => dispatch(setGuestToken(value.content)))}
    />


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
        value={settingsState.waitingTime}
        onChange={value => doRequest("setting/waitingTime", "PUT", value.target.value).then((value) => dispatch(setWaitingTime(value.content)))}
    />



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
        value={settingsState.defaultBanTime}
        onChange={value => doRequest("setting/defaultBanTime", "PUT", value.target.value).then((value) => dispatch(setDefaultBantime(value.content)))}
    />




    const queuestateElement: JSX.Element = <Select
        value={settingsState.queueState}
        onChange={value => doRequest("setting/queueState", "PUT", value.target.value).then((value) => dispatch(setQueueState(value.content)))}
        fullWidth
    >
        <MenuItem value="activated">Aktiviert</MenuItem>
        <MenuItem value="deactivated">Deaktiviert</MenuItem>
    </Select>



    const uploadAcceptedElement: JSX.Element = <Select
        value={settingsState.queueSubmittable}
        onChange={value => doRequest("setting/queueSubmittable", "PUT", value.target.value).then((value) => dispatch(setQueueSubmittable(value.content)))}
        fullWidth
    >
        <MenuItem value="activated">Aktiviert</MenuItem>
        <MenuItem value="deactivated">Deaktiviert</MenuItem>
    </Select>


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
        value={settingsState.retentionTime}
        onChange={value => doRequest("setting/retentionTime", "PUT", value.target.value).then((value) => dispatch(setRetentionTime(value.content)))}
    />

    const toAdminPage = () => {
        navigate("/admin")
    }

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
        <Spacer vertical={5} />
        <div className={style.buttonContainer}>
            <Button
                variant='contained'
                className={style.button}
                onClick={() => toAdminPage()}
            >
                Zurück
            </Button>
        </div>
    </div>

    )
}

export default Settings