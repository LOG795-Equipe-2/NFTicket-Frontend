import AnchorBrowserManager from '../utils/AnchorBrowserManager';

export class Ticket {
    asset_id:string | null = null
    name:string
    date:string
    hour:string
    rowNo:string
    seatNo:string

    locationName:string
    eventName:string

    constructor(name:string, date:string, hour:string, rowNo:string, seatNo:string, locationName:string, eventName:string){
        this.name = name;
        this.date = date
        this.hour = hour
        this.rowNo = rowNo;
        this.seatNo = seatNo;
        this.locationName = locationName;
        this.eventName = eventName
    }

    getSchemaName(){
        return "ticket"
    }

    returnPropertiesAsAttributeMap(): any{
        return [
            {"name": "name", "type": "string" },
            {"name": "date", "type": "string"},
            {"name": "hour", "type": "string"},
            {"name": "locationName", "type": "string"},
            {"name": "eventName", "type": "string"},
            {"name": "rowNo", "type": "string"},
            {"name": "seatNo", "type": "string"}
        ]
    }

    toJSON(): any{
        return {
            "name": this.name,
            "date": this.date,
            "hour": this.hour,
            "rowNo": this.rowNo,
            "seatNo": this.seatNo,
            "locationName": this.locationName,
            "eventName": this.eventName
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