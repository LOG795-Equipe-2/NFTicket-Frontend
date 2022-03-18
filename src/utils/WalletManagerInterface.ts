/**
 * Defines a default interface for managing the wallet logic.
 * 
 */
export interface WalletManagerInterface {
    isUserLogged: () => boolean;
    getAccountName: () => any;
    performTransactions: (actions: any[]) => void;
    restoreSession: () => Promise<boolean>;
    login: () => Promise<boolean>;
    logout: () => Promise<boolean>;
}