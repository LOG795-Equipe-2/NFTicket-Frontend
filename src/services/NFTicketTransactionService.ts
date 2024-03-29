import { newEventData } from '../interfaces/Event';
import TicketCategory, { TicketCategoryModel, TicketCategoryTransaction } from '../interfaces/TicketCategory';
import { AnchorBrowserManager } from '../utils/AnchorBrowserManager';
import AuthServiceSingleton from '../services/AuthService';
import appwrite from '../utils/AppwriteInstance';

/**
 * To send the data as JSON.stringify without error
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
 */
 const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key:any, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

/**
 * Frontend class service to send and validate transactions
 * 
 */
export class NFTicketTransactionService {
    urlApi: string;
    urlTransactionsRoute = "/transactions";
    urlTransactionsValidateRoute = "/validate";
    urlTransactionsActionsRoute = "/actions";
    urlTransactionsUtilityRoute = "/utility";
    urlAtomicAssetsRoutes = "/atomic-assets";
    urlAppwriteRoute = "/appwrite";

    constructor(urlApi: string){
        this.urlApi = urlApi;
    }

    getManager(): AnchorBrowserManager {
        return AuthServiceSingleton.getWalletManager() as AnchorBrowserManager;
    }

    /**
     * Fetch the backend to get the transactions to sign to create a ticket.
     * Throws error if unauthorized or if backend has an error. 
     *
     * @param tickets 
     * @param nbTickets 
     * @returns 
     */
    async createTickets(tickets: TicketCategoryTransaction[], nbTickets: number = 1): Promise<any> {
        const options = {
            method: 'POST',
            body: JSON.stringify({ tickets: tickets }),
            headers: {
                'Content-Type': 'application/json',
                ...await AuthServiceSingleton.createJwtHeader()
            }
        }
        let queryString = '?userName=' + this.getManager().getAccountName()
        
        let transactionToSign = await fetch(this.urlApi + this.urlTransactionsRoute + this.urlTransactionsActionsRoute + '/createTickets' + queryString, options)
        .then((response) => {
            if(response.status >= 200 && response.status < 300){
                return response.json()
            } else {
                throw Error(response.statusText)
            }
        })
        return transactionToSign
    }

    async validateTicket(transactionObject: any) : Promise<any> {
        const options = {
            method: 'POST',
            body: JSON.stringify(transactionObject, getCircularReplacer()),
            headers: {
                'Content-Type': 'application/json',
                ...await AuthServiceSingleton.createJwtHeader()
            }
        }

        let response = await fetch(this.urlApi + this.urlTransactionsRoute + this.urlTransactionsValidateRoute + '/createTickets', options)
        .then(async (response) => {
            let responseJson = await response.json()
            if(response.status >= 200 && response.status < 300){
                return responseJson
            } else {
                throw Error(responseJson.error + " : " + responseJson.message)
            }
        })
        return response
    }

    async getBuyTicketFromCategoryTransactions(ticketCategoryId: string): Promise<any> {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...await AuthServiceSingleton.createJwtHeader()
            }
        }

        let queryString = '?userName=' + this.getManager().getAccountName() + "&ticketCategoryId=" + ticketCategoryId
        
        let transactionToSign;
        await fetch(this.urlApi + this.urlTransactionsRoute + this.urlTransactionsActionsRoute + '/buyTickets' + queryString, options)
        .then(response => response.json())
        .then(data => {
            transactionToSign = data
        });
        return transactionToSign
    }

    async createTicketsAndValidate(tickets:TicketCategoryTransaction[], nbTickets: number = 1): Promise<any> {
        let transactionObject = await this.createTickets(tickets, nbTickets)
        if(transactionObject.success != false){
            transactionObject = transactionObject.data
            let transactionResult = await this.getManager().signTransactions(transactionObject.transactionsBody)
            // Adjust other parameters required for validation
            transactionObject.signatures = transactionResult.signatures;
            transactionObject.transactionId = transactionResult.transaction.id;
            // Add it here otherwise it dosen't seem to show up
            transactionObject.serializedTransaction = transactionResult.resolved.serializedTransaction

        } else {
            throw new Error(transactionObject.errorMessage)
        }

        return await this.validateTicket(transactionObject);
    }

    async buyTicketFromCategory(ticketCategoryId: string){
        let transactionObject = await this.getBuyTicketFromCategoryTransactions(ticketCategoryId)
        if(transactionObject.success != false){
            transactionObject = transactionObject.data
            if(transactionObject.transactionsBody.length > 0){
                let transactionResult = await this.getManager().signTransactions(transactionObject.transactionsBody)
                transactionObject.transactionId = transactionResult.transaction.id
                transactionObject.signatures = transactionResult.signatures
                transactionObject.serializedTransaction = transactionResult.resolved.serializedTransaction
            } else {
                transactionObject.transactionId = "000000000000000"
                transactionObject.signatures = []
                transactionObject.serializedTransaction = []
            }
        } else {
            throw new Error(transactionObject.errorMessage)
        }
        return transactionObject
    }

    async validateBuyTicketFromCategory(transactionObject: any) : Promise<any> {
        const options = {
            method: 'POST',
            body: JSON.stringify(transactionObject),
            headers: {
                'Content-Type': 'application/json',
                ...await AuthServiceSingleton.createJwtHeader()
            }
        }

        let response
        await fetch(this.urlApi + this.urlTransactionsRoute + this.urlTransactionsValidateRoute + '/buyTickets', options)
        .then(response => response.json())
        .then(data => {
            response = data
        });

        return response
    }

    createTicketCategoryTransactionsFromEvent(event: newEventData): TicketCategoryTransaction[] {
        const tickets: TicketCategoryTransaction[] = [];

        event.ticketCategories.forEach(tc => {
            tickets.push(new TicketCategoryTransaction(event.name, event.locationName, event.dateTime.toString(), tc.price, tc.name, tc.initialQuantity));
        })
        
        return tickets;
    }

    async signTicket(userName: string, ticketId: string): Promise<any> {
        let transactionsToSign = await this.getSignTicketTransactions(userName + "", ticketId);

        if(transactionsToSign.success == true){
          transactionsToSign = transactionsToSign.data
          // Sign the transactions
          let transactionResult = await this.getManager().signTransactions(transactionsToSign.transactionsBody);
          
          // Adjust other parameters required for validation
          transactionsToSign.signatures = transactionResult.signatures;
          transactionsToSign.transactionId = transactionResult.transaction.id;
          // Add it here otherwise it dosen't seem to show up
          transactionsToSign.serializedTransaction = transactionResult.resolved.serializedTransaction
  
        } else {
            throw new Error(transactionsToSign.errorMessage)
        }
        return transactionsToSign;
    }

    async getSignTicketTransactions(userName: string, ticketId: string): Promise<any>{
        const options = {
            method: 'POST',
            body: '',
            headers: {
                'Content-Type': 'application/json',
                ...await AuthServiceSingleton.createJwtHeader()
            }
        }

        let queryString = '?userName=' + userName + '&assetId=' + ticketId
        let transactionsToSign = await fetch(this.urlApi + this.urlTransactionsRoute + this.urlTransactionsActionsRoute + '/signTicket' + queryString, options)
        .then(response => response.json())
        return transactionsToSign
    }

    async validateSignTicket(transactionsSigned: any) : Promise<any> {
        const options = {
            method: 'POST',
            body: JSON.stringify(transactionsSigned, getCircularReplacer()),
            headers: {
                'Content-Type': 'application/json',
                ...await AuthServiceSingleton.createJwtHeader()
            }
        }
  
        let response = await fetch(this.urlApi + this.urlTransactionsRoute + this.urlTransactionsValidateRoute + '/signTicket', options)
            .then(response => response.json());
        console.log(response);

        return response
    }

    async getAssetsForUser(userName: string): Promise<any> {
        const assets = await fetch(this.urlApi + this.urlAtomicAssetsRoutes + '/assets/' + userName).then(response => response.json());
        const assetIds = assets.data.rows.map((row: any) => {
            return row.asset_id;
        });
        const tickets = await fetch(this.urlApi + this.urlAppwriteRoute  + '/tickets?asset-ids=' + assetIds.join("&asset-ids=")).then(response => response.json());
        tickets.forEach(async (ticket: any) => {
            ticket.signed = assets.data.rows.find((row: any) => row.asset_id == ticket.assetId).mutable_serialized_data.signed;
            const backgroundImage = ticket.category.styling.backgroundImage;
            if (backgroundImage) {
                let image = await appwrite.storage.getFileView(backgroundImage);
                ticket.category.styling.backgroundImage = image;
            }
            const eventImage = ticket.event.imageId;
            if (eventImage) {
                let image = await appwrite.storage.getFileView(eventImage);
                ticket.event.imageUrl = image.href;
            }
        })
        return tickets;
    }
}

const NFTicketTransactionServiceInstance = new NFTicketTransactionService(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000');

export default NFTicketTransactionServiceInstance;