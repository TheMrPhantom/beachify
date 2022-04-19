import { Alert, Snackbar } from '@mui/material'
import React from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { closeToast } from '../../Actions/CommonAction';
import { CommonReducerType } from '../../Reducer/CommonReducer';

type Props = {}

const Toast = (props: Props) => {
    const alertState: CommonReducerType = useSelector((state: RootStateOrAny) => state.commonReducer);
    const dispatch = useDispatch()

    return (
        <Snackbar
            open={alertState.toast.isOpen}
            autoHideDuration={alertState.toast.duration}
            onClose={() => {
                console.log("lwlwl")
                dispatch(closeToast())
            }}
        >
            <Alert
                onClose={() => {
                    console.log("lwlwl")
                    dispatch(closeToast())
                }}
                variant='filled'
                severity={alertState.toast.type}
                sx={{ width: '100%' }}
            >
                {alertState.toast.message}
                {alertState.toast.jsxElement}
            </Alert>
        </Snackbar>
    )
}

export default Toast