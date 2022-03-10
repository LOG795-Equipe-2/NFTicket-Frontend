import { Box, styled, TextField, Typography, Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import NFTicketTransactionServiceInstance, { NFTicketTransactionService } from '../../services/NFTicketTransactionService';
import EventService from "../../services/EventService";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

let serviceNFT:NFTicketTransactionService

type TableListEventProps = {
    rows: any[];
  };
function TableListEvent(props: TableListEventProps){
    const CssBox = styled(Box)(({ theme }) => ({}));
    
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="right">Endroit</TableCell>
                <TableCell align="right">Ville</TableCell>
                <TableCell align="right">Addresse</TableCell>
                <TableCell align="right">Description</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.rows.map((row) => (
                <TableRow
                    key={row.$id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                    {row.name}
                    </TableCell>
                    <TableCell align="right">{row.locationName}</TableCell>
                    <TableCell align="right">{row.locationCity}</TableCell>
                    <TableCell align="right">{row.locationAddress}</TableCell>
                    <TableCell align="right">{row.description}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableListEvent;