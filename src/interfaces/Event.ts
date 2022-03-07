import Ticket from "./TicketCategory";
import { Models } from "appwrite";

export default interface Event {
    locationName: string,
    locationAddress: string;
    locationCity?: string;
    name: string,
    description: string,
    image: Blob,
    ticketCategories: Ticket[],
}

export interface EventModel extends Models.Document {
    locationName: string,
    locationAddress: string;
    locationCity: string;
    name: string,
    description: string,
    imageId: string,
    userCreatorId: string,
    eventTime: string
}