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
import EventService from "../../services/EventService";
import appwrite from "../../utils/AppwriteInstance"
import { Query } from "appwrite"

async function connectToBackend(){
  let service = NFTicketTransactionServiceInstance;
  return service
}

let serviceNFT:NFTicketTransactionService

function AnchorTests() {
    const urlApi = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'

    const CssBox = styled(Box)(({ theme }) => ({}));

    async function getAssetsForUser(userName: string){
      if(serviceNFT.getManager().isUserLogged()){
        setLoading(true)
        
        let responseAssets = await fetch(urlApi + '/atomic-assets/assets/' + userName).then(response => response.json())
        
        for(const element of responseAssets.data.rows){
            /* Temp index for prevent spam */
            if(typeof(element.immutable_serialized_data) == "object"){
              let dataTemplate = await fetch(urlApi + '/atomic-assets/templates/' + element.collection_name + '/' + element.template_id)
              .then(response => response.json())

              element.immutable_serialized_data.eventName = dataTemplate.data.rows[0].immutable_serialized_data.name
              element.immutable_serialized_data.locationName = dataTemplate.data.rows[0].immutable_serialized_data.locationName
              element.immutable_serialized_data.originalDateTime = dataTemplate.data.rows[0].immutable_serialized_data.originalDateTime
              element.immutable_serialized_data.originalPrice = dataTemplate.data.rows[0].immutable_serialized_data.originalPrice
              element.immutable_serialized_data.categoryName = dataTemplate.data.rows[0].immutable_serialized_data.categoryName
            }
        }

        setLoading(false)
        return responseAssets.data.rows.sort().reverse()
      }
    }

    let [events, setEvents] = useState<any[]>([])
    let [categoryTickets, setCategoryTickets] = useState<any[]>([])

    let [assets, setAssets] = useState([])
    let [loading, setLoading] = useState(false)

    let [searchUser, setSearchUser] = useState("");
    let [searchEventId, setSearchEventId] = useState("");
    let [ticketCategoryId, setTicketCategoryId] = useState("");
    let [ticketValidationNumber, setTicketValidationNumber] = useState("");    

    let [ticketId, setTicketId] = useState("1099511627829");    

    useEffect(() => {
      connectToBackend().then((service) => {
          // Try to restore the session at beginning.
          // service.getManager().restoreSession().then((value) => {
          //   console.log("restored session?: " + value)
          // })
          serviceNFT = service
          console.log("connected to backend: ")
          console.log(service)
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
      let transactionObject = await serviceNFT.buyTicketFromCategory(ticketCategoryId)
      let validationResponse = await serviceNFT.validateBuyTicketFromCategory(transactionObject)
      console.log(validationResponse)

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
    function handleClearAssets(e: React.SyntheticEvent){
        setAssets([])
    }
    
    function handleGetEvents(e: React.SyntheticEvent){
      EventService.getMyEvents().then((data) => setEvents(data.documents));
    }

    async function handleEventSignTicket(e: React.SyntheticEvent){
      console.log("in handleEventSignTicket")
      let userName = serviceNFT.getManager().getAccountName();

      // Get the transactions
      let transactionsToSign = await serviceNFT.getSignTicketTransactions(userName + "", ticketId);

      if(transactionsToSign.success == true){
        transactionsToSign = transactionsToSign.data
        // Sign the transactions
        let transactionResult = await serviceNFT.getManager().signTransactions(transactionsToSign.transactionsBody);
        
        // Adjust other parameters required for validation
        transactionsToSign.signatures = transactionResult.signatures;
        transactionsToSign.transactionId = transactionResult.transaction.id;
        // Add it here otherwise it dosen't seem to show up
        transactionsToSign.serializedTransaction = transactionResult.resolved.serializedTransaction

        // Send to the backend
        let response = await serviceNFT.validateSignTicket(transactionsToSign);
        console.log(response)

        getAssetsForUser(serviceNFT.getManager().getAccountName() + "").then((data) => setAssets(data))
      } else {
        console.log(transactionsToSign)
      }
    }

    function handleClearEvents(e: React.SyntheticEvent){
      setEvents([])
    }
    
    function handleChange(event: any) {
      setSearchUser(event.target.value);
    }

    function handleChangeSearchEventId(event:any) {
      setSearchEventId(event.target.value);
    }

    function handleChangeTicketCategoryId(event: any) {
      setTicketCategoryId(event.target.value);
    }

    function handleGetCategoriesTicket(e: React.SyntheticEvent){
      appwrite.database.listDocuments('622111bde1ca95a94544',[
        Query.equal('eventId', searchEventId)
      ], 100).then((data) => setCategoryTickets(data.documents));
    }

    function handleClearCategoriesTicket(e: React.SyntheticEvent){
      setCategoryTickets([])
    }

    function handleChangeTicketId(event: any){
      setTicketId(event.target.value)
    }

    return (
        <div className="home">
            <button onClick={() => performTransactionCreateTicketBackend() }>Create Tickets</button>
            <br/>
            <label>
              Ticket Category ID:
              <input type="text" value={ticketCategoryId} onChange={handleChangeTicketCategoryId} />
            </label>
            <button onClick={(e) => handleEventBuyTickets() }>Buy 1 Ticket from Event</button>
            <br/>

            <label>
              AtomicAssets Ticket ID:
              <input type="text" value={ticketId} onChange={handleChangeTicketId} />
            </label>
            <button onClick={(e) => handleEventSignTicket(e) }>Sign 1 ticket</button>
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
            <button onClick={(e) => handleClearAssets(e)}>clear assets</button>
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
                  <th>Signed</th>
                  <th>Used</th>
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
                        <td>{element.mutable_serialized_data?.signed }</td>
                        <td>{element.mutable_serialized_data?.used }</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>

            <br/>
            <br/>
            <label>
              Your events
              {/* <input type="text" value={searchUser} onChange={handleChange} /> */}
            </label>
            <button onClick={(e) => handleGetEvents(e)}>get Your Events</button>
            <button onClick={(e) => handleClearEvents(e)}>clear events</button>
            <p>Status: {loading == true ? 'Loading...' : 'Done'}</p>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Location Name</th>
                  <th>Atomic Collection Name</th>
                </tr>
              </thead>
              <tbody>
                {
                  events.map((element: any, index:number) => {
                    return (
                      <tr key={element.$id}>
                        <td>{element.$id}</td>
                        <td>{element.name}</td>
                        <td>{element.locationName}</td>
                        <td>{element.atomicCollName}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>

            <br/>
            <br/>
            <label>
              Event Id:
              <input type="text" value={searchEventId} onChange={handleChangeSearchEventId} />
            </label>
            <button onClick={(e) => handleGetCategoriesTicket(e)}>get category Tickets</button>
            <button onClick={(e) => handleClearCategoriesTicket(e)}>clear category tickets</button>
            <p>Status: {loading == true ? 'Loading...' : 'Done'}</p>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Event Id</th>
                  <th>initialQuantity</th>
                  <th>remainingQuantity</th>
                  <th>atomicTemplateId</th>
                </tr>
              </thead>
              <tbody>
                {
                  categoryTickets.map((element: any, index:number) => {
                    return (
                      <tr key={element.$id}>
                        <td>{element.$id}</td>
                        <td>{element.name}</td>
                        <td>{element.price}</td>
                        <td>{element.eventId}</td>
                        <td>{element.initialQuantity}</td>
                        <td>{element.remainingQuantity }</td>
                        <td>{element.atomicTemplateId }</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>

            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    );
  }
  
  export default AnchorTests;