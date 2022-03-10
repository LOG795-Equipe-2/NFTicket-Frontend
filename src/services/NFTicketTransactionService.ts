import { AnchorBrowserManager } from '../utils/AnchorBrowserManager';

export class TicketNFT {
    asset_id:string | null = null

    eventName:string
    locationName:string
    originalDateTime:string
    originalPrice:number
    categoryName:string
    numberOfTickets:number

    constructor(eventName:string, locationName:string, originalDateTime:string, originalPrice:number, categoryName:string, numberOfTickets:number){
        this.eventName = eventName
        this.locationName = locationName
        this.originalDateTime = originalDateTime
        this.originalPrice = originalPrice
        this.categoryName = categoryName
        this.numberOfTickets = numberOfTickets
    }

    getSchemaName(){
        return "ticket"
    }

    returnPropertiesAsAttributeMap(): any{
        return [
            { "name": "eventName", "type": "string" },
            { "name": "locationName", "type": "string" },
            { "name": "originalDateTime", "type": "string" },
            { "name": "originalPrice", "type": "float" },
            { "name": "categoryName", "type": "string" }
        ]
    }

    toJSON(): any{
        return {
            "eventName": this.eventName,
            "locationName": this.locationName,
            "originalDateTime": this.originalDateTime,
            "originalPrice": this.originalPrice,
            "categoryName": this.categoryName,
            "numberOfTickets": this.numberOfTickets
        }
    }
}


/**
 * Frontend class service to send and validate transactions
 * 
 * Call init() to intialize the class properly.
 */
class NFTicketTransactionService {
    urlApi: string;
    manager: AnchorBrowserManager | null = null;

    constructor(urlApi: string){
        this.urlApi = urlApi;
    }

    async init() {
        let chainId = ''
        let blockchainUrl = ''
        let appName = ''

        await fetch(this.urlApi + '/nfticket-transaction/init')
        // TODO: HTTP Error management if error
        .then(response => response.json())
        .then(data => {
            // Receive chainId, server , and appName
            chainId = data.chainId
            blockchainUrl = data.blockchainUrl
            appName = data.appName
        });

        this.manager = new AnchorBrowserManager(chainId, blockchainUrl, appName)
    }

    getManager(): AnchorBrowserManager {
        return this.manager as AnchorBrowserManager;
    }

    async createTickets(tickets: TicketNFT[], nbTickets: number = 1): Promise<any> {
        const options = {
            method: 'POST',
            body: JSON.stringify(tickets),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let queryString = '?userName=' + this.getManager().getAccountName()
        
        let transactionToSign;
        await fetch(this.urlApi + '/nfticket-transaction/createTickets' + queryString, options)
        .then(response => response.json())
        .then(data => {
            // Receive chainId, server , and appName
            transactionToSign = data
        });
        return transactionToSign
    }

    async validateTicket(transactionObject: any){
        const options = {
            method: 'POST',
            body: JSON.stringify(transactionObject),
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let response
        await fetch(this.urlApi + '/nfticket-transaction/validateTransaction', options)
        .then(response => response.json())
        .then(data => {
            // Receive chainId, server , and appName
            response = data
        });

        return response
    }

    async createTicketsAndValidate(tickets:TicketNFT[], nbTickets: number = 1) {
        let transactionObject = await this.createTickets(tickets, nbTickets)
        transactionObject.transactionId = await this.getManager().performTransactions(transactionObject.transactionsBody)
        return await this.validateTicket(transactionObject);
    }


}

export default NFTicketTransactionService;