/**
 * Test class for Anchor Browser Link.
 * Allows for testing of AnchorBrowserManager
 * Not for production.
 * 
 * Author: Anthony Brochu
 */

import { Box, styled } from "@mui/material";
import NFTicketTransactionService from '../../services/NFTicketTransactionService';
import { Ticket } from '../../services/NFTicketTransactionService';
import { useEffect, useState } from "react";

async function connectToBackend(){
  let service = new NFTicketTransactionService('http://localhost:3000')
  await service.init()
  return service
}

let serviceNFT:NFTicketTransactionService

function AnchorTests() {
    const CssBox = styled(Box)(({ theme }) => ({}));

    async function getAssetsForUser(){
      if(serviceNFT.getManager().isUserLogged()){
        setLoading(true)
        let userName = serviceNFT.getManager().getAccountName();
        
        let dataAssets = await fetch('http://localhost:3000/atomic-assets/assets/' + userName).then(response => response.json())
        
        for(const element of dataAssets.rows){
            /* Temp index for prevent spam */
            if(typeof(element.immutable_serialized_data) == "object"){
              let dataTemplate = await fetch('http://localhost:3000/atomic-assets/templates/' + element.collection_name + '/' + element.template_id)
              .then(response => response.json())

              element.immutable_serialized_data.locationName = dataTemplate.rows[0].immutable_serialized_data.locationName
              element.immutable_serialized_data.eventName = dataTemplate.rows[0].immutable_serialized_data.eventName
            }
        }

        setLoading(false)
        return dataAssets.rows
      }
    }

    let [assets, setAssets] = useState([])
    let [loading, setLoading] = useState(false)

    useEffect(() => {
      connectToBackend().then((service) => {
          // Try to restore the session at beginning.
          service.getManager().restoreSession().then((value) => {
            console.log("restored session?: " + value)
          })
          serviceNFT = service
      });
    }, []); // checks for changes in the values in this array
 

    async function performTransactionCreateTicketBackend(){
      let transactionObject = await serviceNFT.createTicketAndValidate(
        new Ticket(
          "test",
          "28 février",
          "10h",
          "2",
          "b",
          "Centre Bell 1",
          "Show des cowboys"
        )
      )
      getAssetsForUser().then((data) => setAssets(data))
    }

    return (
        <CssBox className="home">
            <button onClick={() => serviceNFT.getManager().login()}>Login</button>
            <button onClick={() => performTransactionCreateTicketBackend() }>createTickets</button>
            <button onClick={() => serviceNFT.getManager().logout()}>logout</button>
            <button onClick={() => getAssetsForUser().then((data) => setAssets(data)) }>get asset for user</button>
            <p>Status: {loading == true ? 'Loading...' : 'Done'}</p>
            <table>
              <thead>
                <tr>
                  <th>Asset Id</th>
                  <th>Collection Name</th>
                  <th>Schema Name</th>
                  <th>Location Name</th>
                  <th>Event Name</th>
                  <th>Ticket Name</th>
                  <th>Date</th>
                  <th>Hour</th>
                  <th>Row No</th>
                  <th>Seat Row</th>
                </tr>
              </thead>
              <tbody>
                {
                  assets.map((element: any, index:number) => {
                    return (
                      <tr key={element.asset_id}>
                        <td>{element.asset_id}</td>
                        <td>{element.collection_name}</td>
                        <td>{element.schema_name}</td>
                        <td>{element.immutable_serialized_data?.locationName}</td>
                        <td>{element.immutable_serialized_data?.eventName}</td>
                        <td>{element.immutable_serialized_data?.name }</td>
                        <td>{element.immutable_serialized_data?.date }</td>
                        <td>{element.immutable_serialized_data?.hour }</td>
                        <td>{element.immutable_serialized_data?.rowNo }</td>
                        <td>{element.immutable_serialized_data?.seatNo }</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
        </CssBox>
    );
  }
  
  export default AnchorTests;