import { AnchorBrowserManager } from '../utils/AnchorBrowserManager';

export class Ticket {
    asset_id:string | null = null

    eventName:string
    locationName:string
    originalDateTime:string
    originalPrice:number
    categoryName:string

    constructor(eventName:string, locationName:string, originalDateTime:string, originalPrice:number, categoryName:string){
        this.eventName = eventName
        this.locationName = locationName
        this.originalDateTime = originalDateTime
        this.originalPrice = originalPrice
        this.categoryName = categoryName
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
            "categoryName": this.categoryName
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

    async createTicket(ticket: Ticket): Promise<any> {
        let data = ticket.toJSON()
        let queryString = '?userName=' + this.getManager().getAccountName()
        let i = 1
        for(let k in data) { 
            queryString += (i == 0 ? "?" : "&") + k + "=" + data[k] 
            i++
        }
        
        let transactionToSign;
        await fetch(this.urlApi + '/nfticket-transaction/createTickets' + queryString)
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

    async createTicketAndValidate(ticket:Ticket) {
        let transactionObject = await this.createTicket(ticket)
        transactionObject.transactionId = await this.getManager().performTransactions(transactionObject.transactionsBody)
        return await this.validateTicket(transactionObject);
    }


}

export default NFTicketTransactionService;