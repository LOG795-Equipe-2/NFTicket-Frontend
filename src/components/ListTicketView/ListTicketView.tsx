import { Box, styled, TextField, Typography, Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import NFTicketTransactionServiceInstance, { NFTicketTransactionService } from '../../services/NFTicketTransactionService';
import EventService from "../../services/EventService";
import TableListEvent from '../TableListEvent/TableListEvent';
import TableListTicket from '../TableListTicket/TableListTicket';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

let serviceNFT:NFTicketTransactionService

function ListTicketView(){
    const CssBox = styled(Box)(({ theme }) => ({}));

    async function getAssetsForUser(){
        if(serviceNFT.getManager().isUserLogged()){
            let userName = serviceNFT.getManager().getAccountName()
            
            let dataAssets = await fetch('http://localhost:3000/atomic-assets/assets/' + userName).then(response => response.json())
            
            for(const element of dataAssets.rows){
                /* Temp index for prevent spam */
                if(typeof(element.immutable_serialized_data) == "object"){
                let dataTemplate = await fetch('http://localhost:3000/atomic-assets/templates/' + element.collection_name + '/' + element.template_id)
                .then(response => response.json())

                element.immutable_serialized_data.eventName = dataTemplate.rows[0].immutable_serialized_data.name
                element.immutable_serialized_data.locationName = dataTemplate.rows[0].immutable_serialized_data.locationName
                element.immutable_serialized_data.originalDateTime = dataTemplate.rows[0].immutable_serialized_data.originalDateTime
                }
            }
            return dataAssets.rows.sort().reverse()
        }
      }

    async function connectToBackend(){
        let service = NFTicketTransactionServiceInstance;
        await service.init()
        return service
    }
  
    let [rows, setRows] = useState<any[]>([])
    let [myTickets, setMyTickets] = useState<any[]>([])
    let [myCreatedTickets, setMyCreatedTickets] = useState<any[]>([])

    useEffect(() => {
        connectToBackend().then((service) => {
            // Try to restore the session at beginning.
            service.getManager().restoreSession().then((value) => {
                console.log("restored session?: " + value)

                getAssetsForUser().then((data) => {
                    let myTicketsLocal: any[] = []
                    let myCreatedTicketsLocal: any[] = []
                    let userName = serviceNFT.getManager().getAccountName()
                    if(typeof(data) !== "undefined"){
                        fetch('http://localhost:3000/transactions/getCollNameForUser?userName=' + userName).then((response) => response.json()).then((collName) => {
                            for(let element of data){
                                if(element.collection_name == collName.data){
                                    myCreatedTicketsLocal.push(element)
                                } else {
                                    myTicketsLocal.push(element)
                                }
                            }    
                            setMyTickets(myTicketsLocal)
                            setMyCreatedTickets(myCreatedTicketsLocal)
                        })
                    }
                })
                
            })
            serviceNFT = service
        });

        EventService.getMyEvents().then((data) => {
            setRows(data.documents)
        })
      }, []); // checks for changes in the values in this array
  
    return (
        <div style={{ marginTop: '60px', marginLeft: '50px', marginRight: '50px' }} >
            <h1>Les évènements que vous avez créés</h1>
            <TableListEvent rows={rows}></TableListEvent>

            <h1>Les billets NFT de vos évènements</h1>
            <TableListTicket rows={myCreatedTickets}></TableListTicket>

            <h1>Les billets NFT que vous avez acheter</h1>
            <TableListTicket rows={myTickets}></TableListTicket>

        </div>
    );
}

export default ListTicketView;