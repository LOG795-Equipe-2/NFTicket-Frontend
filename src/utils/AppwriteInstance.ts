import { Appwrite } from 'appwrite';

const appwrite = new Appwrite();

appwrite
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://appwrite.lurent.ca/v1")
    .setProject(process.env.APPWRITE_PROJECTID || "61fdaf9f85273");

export default appwrite;