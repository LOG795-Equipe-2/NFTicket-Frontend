import { AppwriteException, Models, Query } from 'appwrite';
import anchorBrowserManager, { AnchorBrowserManager } from '../utils/AnchorBrowserManager';

import appwrite from "../utils/AppwriteInstance"

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
    private readonly ON_OAUTH_SUCCESS: string = "http://localhost:3000";

    /**
     * The account of the currently logged-in User
     * @property
     */
    account: Models.User<Models.Preferences> | undefined = undefined;

    session: Models.Session | undefined = undefined;

    /**
     * checks if a User was already connected on this device when creating the Service
     * @constructor
     */
    constructor() { this.checkForSession(); }

    /**
     * checks if a there is currently a User session on this device, if yes it puts it in the account property
     * @returns void
     */
    private async checkForSession(): Promise<void> {
        try {
            this.account = await appwrite.account.get();
            this.session = await appwrite.account.getSession('current');
            const hasRestoredSession = await anchorBrowserManager.restoreSession();

            if(!hasRestoredSession)
                this.tryLoadAnchorLinkSession();
        } catch (e) {
            // This means that no user was connected to this device
            console.log("Error checking for already existing sesion. - " + e);
        }
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
    logout(session = 'current'): void {
        appwrite.account.deleteSession(session);
        this.account = undefined;
        anchorBrowserManager.logout();
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
     * Will attempt to load the AnchorLink session infos from the backend
     * @returns void
     */
    async tryLoadAnchorLinkSession() {
        if(!this.session)
            return;
        
        const appwriteSessionInfo = this.buildAppwriteSessionInfo(this.session);

        try {
            const sessions = await appwrite.database.listDocuments<AnchorInfoDocument>(this.ANCHORINFO_COLLECTION_ID, [Query.equal("appwriteSessionInfo", appwriteSessionInfo)])

            if(sessions.documents.length == 1)
                this.restoreAnchorLinkSessions(sessions.documents[0])
        } catch (e: any) {
            console.error(`error while fetching AnchorLink Sessions; ${(e as AppwriteException).message}`)
        }
    }

    /**
     * Puts the data from the AnchorInfoDocument into the localStorage so that AnchorLink can use it to restore the session
     * @param anchorInfo The data that will be put into localStorage
     */
    restoreAnchorLinkSessions(anchorInfo: AnchorInfoDocument) {
        window.localStorage.clear();
        anchorInfo.channelsInfo.forEach((ci: string) => {
            let ciSplit = ci.split(this.SEPARATOR);
            window.localStorage.setItem(ciSplit[0], ciSplit[1]);
        })

        let siInfo = anchorInfo.sessionsInfo.split(this.SEPARATOR);
        window.localStorage.setItem(siInfo[0], siInfo[1]);

        anchorBrowserManager.restoreSession();
        console.log("done!")
    }
    
}

export default new AuthService();