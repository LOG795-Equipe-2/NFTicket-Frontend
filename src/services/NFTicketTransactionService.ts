import Event from '../interfaces/Event';
import { TicketCategoryTransaction } from '../interfaces/TicketCategory';
import { AnchorBrowserManager } from '../utils/AnchorBrowserManager';
import AuthServiceSingleton from '../services/AuthService';

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
 * Call init() to intialize the class properly.
 */
export class NFTicketTransactionService {
    urlApi: string;
    urlTransactionsRoute = "/transactions";
    urlTransactionsValidateRoute = "/validate";
    urlTransactionsActionsRoute = "/actions";
    urlTransactionsUtilityRoute = "/utility";
    urlAtomicAssetsRoutes = "/atomic-assets";
    urlAppwriteRoute = "/appwrite";
    manager: AnchorBrowserManager | null = null;

    constructor(urlApi: string){
        this.urlApi = urlApi;
    }

    async init() {
        let chainId = ''
        let blockchainUrl = ''
        let appName = ''

        const options = {
            headers: await AuthServiceSingleton.createJwtHeader()
        }

        await fetch(this.urlApi + this.urlTransactionsRoute + this.urlTransactionsUtilityRoute + '/init', options)
        // TODO: HTTP Error management if error
        .then(response => response.json())
        .then(response => {
            // Receive chainId, server , and appName
            chainId = response.data.chainId
            blockchainUrl = response.data.blockchainUrl
            appName = response.data.appName
        });

        this.manager = new AnchorBrowserManager(chainId, blockchainUrl, appName)
        await this.manager.restoreSession();
    }

    getManager(): AnchorBrowserManager {
        return this.manager as AnchorBrowserManager;
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

    createTicketCategoryTransactionsFromEvent(event: Event): TicketCategoryTransaction[] {
        const tickets: TicketCategoryTransaction[] = [];

        event.ticketCategories.forEach(tc => {
            tickets.push(new TicketCategoryTransaction(event.name, event.locationName, event.dateTime.toString(), tc.price, tc.type, tc.initialAmount));
        })
        
        return tickets;
    }

    async signTicket(userName: string, ticketId: string): Promise<any>{
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
        const tickets = await fetch(this.urlApi + this.urlAppwriteRoute  + '/tickets?asset-ids=' + encodeURIComponent(JSON.stringify(assetIds))).then(response => response.json());
        return tickets;
    }
}

const NFTicketTransactionServiceInstance = new NFTicketTransactionService(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000');
// NFTicketTransactionServiceInstance.init();

export default NFTicketTransactionServiceInstance;