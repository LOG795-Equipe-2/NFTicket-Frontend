import Event from '../interfaces/Event';
import { TicketCategoryTransaction } from '../interfaces/TicketCategory';
import { AnchorBrowserManager } from '../utils/AnchorBrowserManager';

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
    urlTransactionsRoute = "/transactions"
    manager: AnchorBrowserManager | null = null;

    constructor(urlApi: string){
        this.urlApi = urlApi;
    }

    async init() {
        let chainId = ''
        let blockchainUrl = ''
        let appName = ''

        await fetch(this.urlApi + this.urlTransactionsRoute + '/init')
        // TODO: HTTP Error management if error
        .then(response => response.json())
        .then(response => {
            // Receive chainId, server , and appName
            chainId = response.data.chainId
            blockchainUrl = response.data.blockchainUrl
            appName = response.data.appName
        });

        this.manager = new AnchorBrowserManager(chainId, blockchainUrl, appName)
        this.manager.restoreSession();
    }

    getManager(): AnchorBrowserManager {
        return this.manager as AnchorBrowserManager;
    }

    async createTickets(tickets: TicketCategoryTransaction[], nbTickets: number = 1): Promise<any> {
        const options = {
            method: 'POST',
            body: JSON.stringify(tickets),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let queryString = '?userName=' + this.getManager().getAccountName()
        
        let transactionToSign;
        await fetch(this.urlApi + this.urlTransactionsRoute + '/createTickets' + queryString, options)
        .then(response => response.json())
        .then(data => {
            // Receive chainId, server , and appName
            transactionToSign = data
        });
        return transactionToSign
    }

    async getBuyTicketFromCategoryTransactions(ticketCategoryId: string): Promise<any> {
        let queryString = '?userName=' + this.getManager().getAccountName() + "&ticketCategoryId=" + ticketCategoryId
        
        let transactionToSign;
        await fetch(this.urlApi + '/transactions/buyTicketFromCategory' + queryString)
        .then(response => response.json())
        .then(data => {
            transactionToSign = data
        });
        return transactionToSign
    }

    async validateTicket(transactionObject: any) : Promise<any> {
        const options = {
            method: 'POST',
            body: JSON.stringify(transactionObject),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let response
        await fetch(this.urlApi + this.urlTransactionsRoute + '/validateTransaction', options)
        .then(response => response.json())
        .then(data => {
            response = data
        });

        return response
    }

    async createTicketsAndValidate(tickets:TicketCategoryTransaction[], nbTickets: number = 1): Promise<any> {
        let transactionObject = await this.createTickets(tickets, nbTickets)
        if(transactionObject.success != false){
            transactionObject = transactionObject.data
            transactionObject.transactionId = await this.getManager().performTransactions(transactionObject.transactionsBody)
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
                transactionObject.transactionId = await this.getManager().performTransactions(transactionObject.transactionsBody)
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
                'Content-Type': 'application/json'
            }
        }

        let response
        await fetch(this.urlApi + this.urlTransactionsRoute + '/validateTransaction', options)
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
        let queryString = '?userName=' + userName + '&assetId=' + ticketId
        let transactionsToSign = await fetch(this.urlApi + this.urlTransactionsRoute + '/signTicket' + queryString)
        .then(response => response.json())
        return transactionsToSign.data
    }

    async validateSignTicket(transactionsSigned: any) : Promise<any> {
        const options = {
            method: 'POST',
            body: JSON.stringify(transactionsSigned, getCircularReplacer()),
            headers: {
                'Content-Type': 'application/json'
            }
        }
  
        let response
        await fetch(this.urlApi + this.urlTransactionsRoute + '/validateTransaction', options)
            .then(response => response.json())
            .then(data => { response = data });

        return response
    }
}

const NFTicketTransactionServiceInstance = new NFTicketTransactionService('http://localhost:3000');
NFTicketTransactionServiceInstance.init();

export default NFTicketTransactionServiceInstance;