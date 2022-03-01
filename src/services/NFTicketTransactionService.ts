import AnchorBrowserManager from '../utils/AnchorBrowserManager';

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


}

export default NFTicketTransactionService;