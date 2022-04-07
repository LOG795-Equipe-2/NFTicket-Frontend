import Ticket from "./TicketCategory";
import { Models } from "appwrite";

export default interface Event {
    id: string;
    locationName: string;
    locationAddress: string;
    locationCity?: string;
    name: string;
    description: string;
    image: Blob | string;
    ticketCategories: Ticket[];
    dateTime: Date;
    collName?: string
}

export interface EventModel extends Models.Document {
    locationName: string,
    locationAddress: string;
    locationCity: string;
    name: string,
    description: string,
    imageId: string,
    userCreatorId: string,
    eventTime: string,
    atomicCollName: string,
}