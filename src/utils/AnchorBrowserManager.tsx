/**
 * 
 * A manager for Anchor Browser, which can be stored in the state to keep the session.
 * 
 * Implementation details can be found here : 
 * https://github.com/greymass/anchor-link
 * https://github.com/greymass/anchor-link-browser-transport/tree/master#basic-usage
 * 
 * Author: Anthony Brochu
 */

import AnchorLink, { LinkSession } from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
const { RpcError } = require('eosjs');

export class AnchorBrowserManager{
    link: AnchorLink;
    appName: string;
    /**
     * Session object, if null it means that the user is not logged in.
     */
    session?: LinkSession | null;

    /**
     * Initialize the Anchor Link
     * @param chainId Id of the blockchain, which can be retreived from the api /v1/chain/get_info
     * @param nodeUrl URL of the node
     * @param appName The name of the app that will be displayed and use throughout the manager usage.
     */    
    constructor(chainId:string, nodeUrl:string, appName:string){
        const transport = new AnchorLinkBrowserTransport({
            // Whether or not we display message.
            requestStatus: false,
        })
        this.link = new AnchorLink({transport, chains: [
          {
              chainId: chainId,
              nodeUrl: nodeUrl
          }
        ]});
        this.appName = appName;
    }

    isUserLogged(){
        return this.session !== null && typeof(this.session) !== "undefined";
    }

    getAccountName(){
        return this.session?.auth.actor
    }

    /**
     * Login using the browser popup.
     * Error or cancellation can be managed
     */
    async login() {
        // Perform the login, which returns the users identity
        await this.link.login(this.appName).then((identity) => {
          // Save the session within your application for future use
          this.session = identity.session
          console.log(`Logged in as ${this.session.auth}`)
        }).catch((err) => {
          // User has cancelled log in.
        });
    }

    /**
     * Allows to restore the session if there was one.
     * @returns Promise of a boolean that will tell if the session was able to be restored or not.
     */
    async restoreSession():Promise<Boolean>{
        return this.link.restoreSession(this.appName).then((result) => {
            this.session = result
            if (this.isUserLogged()) {
                return true;
            }
            return false;
        });
    }

    async logout() {
        if(this.isUserLogged()){
            this.link.removeSession(this.appName, this.session!.auth, this.session!.chainId);
            this.session = undefined;
        } else {
            throw new Error("User is not logged in");
        }
    }

    /**
     * Perform a transaction in the browser.
     * Ask for the user to log in and sign the transaction in the Anchor wallet.
     * The function will validate the authorization for the user with the session auth.
     */
     async performTransactions(actions:any[]) {
        if(this.isUserLogged()){
            actions.forEach((element) => {
                element.authorization = [this.session!.auth]
            })
            await this.session!.transact({ actions }).then(({transaction}) => {
                console.log(`transation broadcast! Id: ${transaction.id}`);
            }).catch((err) => {
                console.log(err);
                console.log(err.response);
                console.log(err.response.data)
                if (err instanceof RpcError)
                  console.log(JSON.stringify(err.json, null, 2));
      
                throw err;
             });
            
        } else {
            throw new Error("User is not logged in");
        }
    }
    
} export default AnchorBrowserManager