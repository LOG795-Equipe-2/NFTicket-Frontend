import { Box, styled, TextField, Typography, Button } from "@mui/material";
import { AppwriteContext } from '../../App';
import React from "react";
import { useEffect, useState, useContext } from "react";
import NFTicketTransactionServiceInstance, { NFTicketTransactionService } from '../../services/NFTicketTransactionService';
import AuthService from "../../services/AuthService";

let serviceNFT:NFTicketTransactionService

function SettingsView(props: any){
    const CssBox = styled(Box)(({ theme }) => ({}));

    const context = useContext(AppwriteContext);
    
    const unlinkAnchor = () => {
        console.log("in unlinkAnchor");
        context.AuthServiceObject.logoutWallet().then((logoutSuccessful: boolean) => {
            context.setUserLoggedIn({
                ...context.userLoggedIn,
                isLoggedInAnchor: false
            })
        }).catch((err) => {
            console.log("Error while unlinking Anchor: " + err);
            context.setUserLoggedIn({
                ...context.userLoggedIn,
                isLoggedInAnchor: false
            })
        });
    }

    const linkAnchor = () => {
        context.AuthServiceObject.loginWallet().then((isLoggedInWallet: boolean) => {
            context.setUserLoggedIn({
                ...context.userLoggedIn,
                isLoggedInAnchor: isLoggedInWallet
            })
        }).catch((err) => {
            console.log("Error while login to anchor: " + err);
            context.setUserLoggedIn({
                ...context.userLoggedIn,
                isLoggedInAnchor: false
            })
        });
    }

    return (
       <div style={{marginTop: 60 }}>
           <p>Vous pouvez vous connecter à votre compte Anchor pour faire vos transactions.</p>
           <p>Ce compte sera utilisé pour faire vos transactions et voir vos billets NFT.</p>
           <p>Le système se souviendra uniquement du dernier appareil auquel vous vous être connecté.</p>
           {typeof(context.userLoggedIn) !== "undefined" && context.userLoggedIn?.isLoggedInAnchor ? 
                   <Button onClick={unlinkAnchor}>Déconnecter votre compte Anchor de votre appareil actuel</Button> :
                   <Button onClick={linkAnchor}>Connecter son compte Anchor à votre appareil actuel</Button>
            }
       </div>
    );
}

export default SettingsView;