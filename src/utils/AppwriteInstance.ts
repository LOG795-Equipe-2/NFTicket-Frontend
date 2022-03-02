import { Appwrite } from 'appwrite';

const appwrite = new Appwrite();

appwrite
    .setEndpoint("https://appwrite.lurent.ca/v1")
    .setProject("61fdaf9f85273");

export default appwrite;