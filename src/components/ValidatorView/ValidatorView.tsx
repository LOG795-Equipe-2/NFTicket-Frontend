import { Backdrop, Box, Button, CircularProgress, Paper, Stack, styled, TextField, alpha, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Alert } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ConfirmationNumber from "@mui/icons-material/ConfirmationNumber";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import React, { useEffect } from 'react';
import './ValidatorView.scss';

const CssBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
}));

const CssTextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputLabel-root": {
        color: alpha(theme.palette.primary.light, 0.5),
    },
    "& .MuiOutlinedInput-root": {
        "& .MuiButtonBase-root": {
            color: theme.palette.secondary.main,
        },
        "& .MuiOutlinedInput-input": {
            color: theme.palette.primary.light,
        },
        "& fieldset": {
            borderColor: theme.palette.primary.light,
        },
        "&:hover fieldset": {
            borderColor: theme.palette.primary.light,
        },
        "&.Mui-focused fieldset": {
            borderColor: theme.palette.secondary.main,
        },
    },
}));

enum ValidatorState {
    FETCHING,
    ERROR,
    SUCCESS
}

export default function ValidatorView() {
    const { id, eventId } = useParams();
    const navigate = useNavigate();
    const [validatorState, setValidatorState] = React.useState(ValidatorState.FETCHING);
    const [ticketID, setTicketID] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [ticketValidationMessage, setTicketValidationMessage] = React.useState<ValidatorState | null>(null);
    const [closeSessionConfirm, setCloseSessionConfirm] = React.useState(false);
    useEffect(() => {
        // Check validator and event authenticity
        setTimeout(() => setValidatorState(ValidatorState.SUCCESS), 1500);
    });
    const validateTicketID = () => {
        // Check ticket authenticity
        setTicketValidationMessage(ValidatorState.FETCHING);
        setTimeout(() => {
            setTicketValidationMessage(ValidatorState.SUCCESS);
        }, 1500)
    }

    const confirmAndReset = () => {
        setTicketValidationMessage(null);
        setTicketID("");
    }

    const exitSession = () => {
        // Call API
        navigate("/");
    }

    return (
        <CssBox className="Validator">
            {validatorState === ValidatorState.FETCHING && (
                <Backdrop open={true} sx={{ zIndex: 100 }}>
                    <CircularProgress color="info" size={50} />
                </Backdrop>
            )}
            {validatorState === ValidatorState.ERROR && (
                <Backdrop open={true} sx={{ zIndex: 100 }}>
                    <Alert severity="error">Ce validateur n'existe pas!</Alert>
                </Backdrop>
            )}
            {validatorState === ValidatorState.SUCCESS && (
                <Stack spacing={5} direction="column" alignItems="center">
                    <Box className="page-title" sx={{ color: "secondary.main" }}>
                        <ConfirmationNumber
                            sx={{ marginRight: "10px" }}
                        ></ConfirmationNumber>
                        NFTicket
                    </Box>
                    <CssTextField value={ticketID} onChange={(e) => setTicketID(e.target.value)} label="ID du billet" type="text" />
                    <CssTextField value={ticketID} onChange={(e) => setUsername(e.target.value)} label="Nom d'utilisateur" type="text" />
                    <Button onClick={validateTicketID} variant="contained" color="info" disabled={!ticketID || ticketValidationMessage === ValidatorState.FETCHING}>{ticketValidationMessage === ValidatorState.FETCHING ? (
                        <CircularProgress color="info" size={25} />) : ("Valider")
                    }</Button>
                    <Button variant="outlined" color="error" onClick={() => setCloseSessionConfirm(true)}>Fermer la session</Button>
                    {closeSessionConfirm && (
                        <Dialog open={true} onClose={exitSession}>
                            <DialogContent>
                                <DialogContentText>Voulez-vous vraiment fermer votre session?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={exitSession}>Confirmer</Button>
                            </DialogActions>
                        </Dialog>
                    )}
                    {ticketValidationMessage === ValidatorState.SUCCESS && (
                        <Dialog open={true} onClose={confirmAndReset}>
                            <DialogContent>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <CheckCircleIcon color="success" />
                                    <DialogContentText>Le billet a été validé avec succès!</DialogContentText>
                                </Stack>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={confirmAndReset}>Confirmer</Button>
                            </DialogActions>
                        </Dialog>
                    )}
                    {ticketValidationMessage === ValidatorState.ERROR && (
                        <Dialog open={true} onClose={() => setTicketValidationMessage(null)}>
                            <DialogContent>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <ErrorIcon color="error" />
                                    <DialogContentText>Le billet n'a pu être confirmé</DialogContentText>
                                </Stack>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setTicketValidationMessage(null)}>Réessayer</Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </Stack>
            )}
        </CssBox>


    )
}