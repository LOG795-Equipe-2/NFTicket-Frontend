/**
 * Test class for Anchor Browser Link.
 * Allows for testing of AnchorBrowserManager
 * Not for production.
 * 
 * Author: Anthony Brochu
 */

import { Box, styled, TextField, Typography, Button } from "@mui/material";
import NFTicketTransactionServiceInstance, { NFTicketTransactionService } from '../../services/NFTicketTransactionService';
import { useEffect, useState } from "react";
import { TicketCategoryTransaction } from "../../interfaces/TicketCategory";

async function connectToBackend(){
  let service = NFTicketTransactionServiceInstance;
  await service.init()
  return service
}

let serviceNFT:NFTicketTransactionService

function AnchorTests() {
    const CssBox = styled(Box)(({ theme }) => ({}));

    async function getAssetsForUser(userName: string){
      if(serviceNFT.getManager().isUserLogged()){
        setLoading(true)
        
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

        setLoading(false)
        return dataAssets.rows.sort().reverse()
      }
    }

    let [assets, setAssets] = useState([])
    let [loading, setLoading] = useState(false)

    let [searchUser, setSearchUser] = useState("");
    let [eventId, setEventId] = useState();
    let [ticketValidationNumber, setTicketValidationNumber] = useState("");

    useEffect(() => {
      connectToBackend().then((service) => {
          // Try to restore the session at beginning.
          // service.getManager().restoreSession().then((value) => {
          //   console.log("restored session?: " + value)
          // })
          serviceNFT = service
      });
    }, []); // checks for changes in the values in this array
 

    async function performTransactionCreateTicketBackend(){
      let transactionObject = await serviceNFT.createTicketsAndValidate(
        [
            new TicketCategoryTransaction(
            "Show des cowboys",
            "Centre Bell 1",
            "2022-05-02T20:00:00",
            50.0,
            "VIP",
            1
          ),
          new TicketCategoryTransaction(
            "Show des cowboys",
            "Centre Bell 1",
            "2022-05-02T20:00:00",
            20.96,
            "Normal",
            2
          )
        ]
      )
      getAssetsForUser(serviceNFT.getManager().getAccountName() + "").then((data) => setAssets(data))
    }

    async function handleEventBuyTickets(){
      //Buy Ticket with EventID
      console.log("in handleEventBuyTickets")
    }

    async function startTicketValidation(){
      // Generate a unique ID that will be stored in the DB for validation
      console.log("in startTicketValidation")
      
      // setTicketValidationNumber();
    }

    async function validateIdentityAsClient(){
      // validate the client identity for specific client by signing a trx that the backend will send for us.
      console.log("in validateIdentityAsClient")
    
    }

    function handleEventSubmit(e: React.SyntheticEvent){
      getAssetsForUser(searchUser).then((data) => setAssets(data))
    }

    function handleChange(event: any) {
      setSearchUser(event.target.value);
    }

    function handleChangeEventId(event: any) {
      setEventId(event.target.value);
    }

    return (
        <div className="home">
            <button onClick={() => performTransactionCreateTicketBackend() }>Create Tickets</button>
            <br/>
            <label>
              Event ID:
              <input type="text" value={eventId} onChange={handleChangeEventId} />
            </label>
            <button onClick={(e) => handleEventBuyTickets() }>Buy 1 Ticket from Event</button>
            <br/>

            <button onClick={(e) => startTicketValidation() }>Start Ticket Valudation (Validator Side)</button>
            <p>Your validation number: {ticketValidationNumber}</p>
            <br/>

            <p>The Identify will be validated by sending a transaction to test your ownership. It will be linked to the validator by the ticketValidationNumber.</p>
            <button onClick={(e) => validateIdentityAsClient() }>Validate the ownership of your ticket (Client Side)</button>
            <p>Your validation number: {ticketValidationNumber}</p>
            <br/>


            <br/>
            <br/>
            <label>
              EOS Name:
              <input type="text" value={searchUser} onChange={handleChange} />
            </label>
            <button onClick={(e) => handleEventSubmit(e)}>get asset for user</button>
            <p>Status: {loading == true ? 'Loading...' : 'Done'}</p>
            <table>
              <thead>
                <tr>
                  <th>Asset Id</th>
                  <th>Collection Name</th>
                  <th>Schema Name</th>
                  <th>Event Name</th>
                  <th>Location Name</th>
                  <th>Original Date Time</th>
                  <th>Original Price</th>
                  <th>Category Name</th>
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
                        <td>{element.immutable_serialized_data?.eventName}</td>
                        <td>{element.immutable_serialized_data?.locationName}</td>
                        <td>{element.immutable_serialized_data?.originalDateTime }</td>
                        <td>{element.immutable_serialized_data?.originalPrice }</td>
                        <td>{element.immutable_serialized_data?.categoryName }</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
        </div>
    );
  }
  
  export default AnchorTests;