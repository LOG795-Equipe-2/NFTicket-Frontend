import { Models, Query } from 'appwrite';
import { AppwriteException } from 'appwrite'
import { AnchorBrowserManager } from '../utils/AnchorBrowserManager';
import { WalletManagerInterface } from '../utils/WalletManagerInterface';

import appwrite from "../utils/AppwriteInstance"
import { AppwriteJWT } from '../interfaces/Appwrite';

export enum OauthProvider {
    GOOGLE = "google",
    DISCORD = "discord"
}

interface AnchorInfoDocument extends Models.Document {
    channelsInfo: string[];
    sessionsInfo: string;
    appwriteSessionInfo: string;
}

/**
 * To Use this class in a Component use the useContext Hook
 * @example const appwrite = React.useContext<AppwriteManager>(AppwriteContext);
 * @classdesc Class used for interacting with the appwrite API
 */
export class AuthService {

    private readonly SEPARATOR: string = " ---- ";
    private readonly ANCHORINFO_COLLECTION_ID: string = "621fcb8641b53f76bc95";
    private readonly ON_OAUTH_SUCCESS: string = this.urlApi;

    private walletManager: WalletManagerInterface;

    /**
     * The account of the currently logged-in User
     * @property
     */
    account: Models.User<Models.Preferences> | undefined = undefined;

    session: Models.Session | undefined = undefined;

    jwt: AppwriteJWT | undefined = undefined;

    /**
     * checks if a User was already connected on this device when creating the Service
     * @constructor
     */
    constructor(private urlApi: string) { 
        this.walletManager = new AnchorBrowserManager(
            process.env.CHAIN_ID || '5d5bbe6bb403e5ca8b087d382946807246b4dee094c7f5961e2bebd88f8c9c51', 
            process.env.REACT_APP_NODE_URL || 'http://eos1.anthonybrochu.com:8888/', 
            process.env.APP_NAME || 'NFTicket');
    }

    listeners: any[] = [];

    /**
     * checks if a there is currently a User session on this device, if yes it puts it in the account property
     * @returns void
     */
    async checkForSession(): Promise<boolean> {
        try {
            this.account = await appwrite.account.get();
            this.session = await appwrite.account.getSession('current');
        } catch(e){
            console.log("Error checking for already existing session (User might not be logged in). - " + e);
            this.listeners.forEach(l => l.call());
            return false;
        }

        try{
            const hasRestoredSession = await this.walletManager.restoreSession();

            if(!hasRestoredSession){
                let sessionLocalStorage = await this.getAnchorLinkSessionLocalStorage();
                if(sessionLocalStorage != null){
                    await this.restoreAnchorLinkSessions(sessionLocalStorage)
                    console.log("restored session from backend Local storage.")
                } else {
                    console.log("Did not restore session, nothing was saved in Appwrite.");
                }
            } else
                console.log("restored session from Anchor directly.")
        } catch (e) {  
            // This means that no user was connected to this device
            console.log("Error checking for already existing session. - " + e);
        }
        this.listeners.forEach(l => l.call());
        return true;
    }

    /**
     * Will build a String that will be recognizable if the same user connects to the the website through the same device
     * @param session An appwrite user sesison
     * @returns A string representing a user session
     */
    private buildAppwriteSessionInfo(session: Models.Session) {
        return `${session.deviceName} - ${session.clientCode} - ${session.userId}`
    }

    /**
     * Calls the login method for the wallet manager
     */
    async loginWallet(): Promise<boolean> {
        let success = await this.walletManager.login();
        if(success){
            this.saveAnchorLinkInfosForCurrentSession();
            return true;
        }
        return false;
    }

    /**
     * Calls the login method for the wallet manager
     */
     async logoutWallet(): Promise<boolean> {
        let success = await this.walletManager.logout();
        if(success){
            await this.deleteAnchorLinkInfosForCurrentSession();
            return true;
        }
        return false;
    }

    /**
     * Checks if the user is logged in within
     */
    isWalletLoggedIn(): boolean {
        return this.walletManager.isUserLogged();
    }

    /**
     * Login a User using the Oauth protocol
     * !! Be careful !! this will redirect the User to the login page of the provider
     * //TODO Need to change the redirect to the appropriate host
     * @param provider The Oauth provider, currently accepted: ["Google"]
     * @returns void
     */
    loginWithOauth(provider: OauthProvider): void { appwrite.account.createOAuth2Session(provider, this.ON_OAUTH_SUCCESS) }

    /**
     * Delete the current session of a User, will also delete any Anchor Data that was used to save sessions
     * @returns void
     */
    async logout(session = 'current'): Promise<void> {
        await appwrite.account.deleteSession(session);
        this.account = undefined;
        this.walletManager.logout();
        window.localStorage.clear();
    }

    /**
     * checks if a User is currently logged-in
     * @returns boolean
     */
    isLoggedIn(): boolean { return !(this.account == null) }

    /**
     * Saves the current anchorlink session info on the Backend so that it can be restored if the use reconnects on the same device
     * @returns void
     */
    async saveAnchorLinkInfosForCurrentSession() {
        if(!this.session)
            return;

        let sessionsInfo: string = "";
        let channelsInfo: string[] = [];

        for(let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);

            if(key?.startsWith("anchor-link-")) {
                if(key.endsWith("list"))
                    sessionsInfo = key + this.SEPARATOR + window.localStorage.getItem(key)
                else
                    channelsInfo.push(key + this.SEPARATOR + window.localStorage.getItem(key))
            }
        }

        const appwriteSessionInfo = this.buildAppwriteSessionInfo(this.session)

        const data = {
            appwriteSessionInfo,
            channelsInfo,
            sessionsInfo
        }

        try {
            const existingSessions = await appwrite.database.listDocuments<AnchorInfoDocument>(this.ANCHORINFO_COLLECTION_ID, [Query.equal("appwriteSessionInfo", appwriteSessionInfo)]);
            
            if(existingSessions.documents.length == 1) {
                appwrite.database.updateDocument(this.ANCHORINFO_COLLECTION_ID, existingSessions.documents[0].$id, data)
            } else {
                appwrite.database.createDocument(this.ANCHORINFO_COLLECTION_ID, "unique()", data);
            }
            
        } catch (e: any) {
            console.error("Error while adding/updating new anchor session infos")
            throw new Error((e as AppwriteException).message)
        }
        
    }
    /**
     * Returns a header containing an appwrite JWT
     * @returns A header that can be appended to a request to be identified by the back-end
     */
    async createJwtHeader(): Promise<{ "nfticket-appwrite-jwt": string }> {
        // Current Jwt stil valid
        if(this.jwt && this.jwt.invalidAt.getTime() > new Date().getTime()) {
            return { "nfticket-appwrite-jwt": this.jwt.jwt };
        }

        // Current Jwt expired, need to create a new one
        const jwtModel = await appwrite.account.createJWT();

        this.jwt = {
            jwt: jwtModel.jwt,
            // jwt expires in 15m so we ask for a new jwt after 14m to be safe
            invalidAt: new Date(new Date().getTime() + 14 * 60000)
        }

        return { "nfticket-appwrite-jwt": this.jwt.jwt };
    }
    /**
     * Saves the current anchorlink session info on the Backend so that it can be restored if the use reconnects on the same device
     * @returns void
     */
     async deleteAnchorLinkInfosForCurrentSession() {
        if(!this.session)
            return;

        const appwriteSessionInfo = this.buildAppwriteSessionInfo(this.session)

        try {
            const existingSessions = await appwrite.database.listDocuments<AnchorInfoDocument>(this.ANCHORINFO_COLLECTION_ID, [Query.equal("appwriteSessionInfo", appwriteSessionInfo)]);
            
            if(existingSessions.documents.length == 1) {
                appwrite.database.deleteDocument(this.ANCHORINFO_COLLECTION_ID, existingSessions.documents[0].$id)
            }
            
        } catch (e: any) {
            console.error("Error while adding/updating new anchor session infos")
            throw new Error((e as AppwriteException).message)
        }
    }

    /**
     * Will attempt to load the AnchorLink session infos from the backend
     * @returns void
     */
    async getAnchorLinkSessionLocalStorage(): Promise<AnchorInfoDocument | null> {
        if(!this.session)
            return null;
        
        const appwriteSessionInfo = this.buildAppwriteSessionInfo(this.session);

        try {
            const sessions = await appwrite.database.listDocuments<AnchorInfoDocument>(this.ANCHORINFO_COLLECTION_ID, [Query.equal("appwriteSessionInfo", appwriteSessionInfo)])

            if(sessions.documents.length == 1)
                return sessions.documents[0]
            else
                return null;
        } catch (e: any) {
            console.error(`error while fetching AnchorLink Sessions; ${(e as AppwriteException).message}`)
            throw e;
        }
    }

    /**
     * Puts the data from the AnchorInfoDocument into the localStorage so that AnchorLink can use it to restore the session
     * @param anchorInfo The data that will be put into localStorage
     */
    async restoreAnchorLinkSessions(anchorInfo: AnchorInfoDocument): Promise<boolean> {
        window.localStorage.clear();
        anchorInfo.channelsInfo.forEach((ci: string) => {
            let ciSplit = ci.split(this.SEPARATOR);
            window.localStorage.setItem(ciSplit[0], ciSplit[1]);
        })

        let siInfo = anchorInfo.sessionsInfo.split(this.SEPARATOR);
        window.localStorage.setItem(siInfo[0], siInfo[1]);

        return await this.walletManager.restoreSession();
    }

    /**
     * Logins the user with a email/password
     * @param email 
     * @param password 
     * @returns true if the login was successful, false otherwise
     */
    async loginWithPassword(email: string, password: string): Promise<boolean> {
        this.session = await appwrite.account.createSession(email, password);
        await this.checkForSession();
        return this.session !== undefined;
    }

    /**
     * Create a new user from an email/password combination
     * @param email 
     * @param password 
     * @param firstName 
     * @param lastName 
     * @returns True if the user creation was successful, false otherwise
     */
    async createAccount(email: string, password: string, firstName: string, lastName: string): Promise<boolean> {
        const name: string = `${firstName} ${lastName}`;
        if(name.length > 128)
            return false
        
        const user = await appwrite.account.create("unique()", email, password, name);
        return await this.loginWithPassword(email, password);
    }

    changePassword(currentPassword: string, newPassword: string) {
        return appwrite.account.updatePassword(newPassword, currentPassword);     
    }
    
    
}

export default new AuthService(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000');