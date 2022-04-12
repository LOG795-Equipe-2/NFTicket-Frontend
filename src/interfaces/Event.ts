import TicketCategory from "./TicketCategory";
import { Models } from "appwrite";

export interface newEventData {
    $id: string;
    locationName: string;
    locationAddress: string;
    locationCity?: string;
    name: string;
    description: string;
    image: Blob | string;
    ticketCategories: TicketCategory[];
    dateTime: Date;
    collName?: string
}

export interface Event {
    $id: string;
    name: string;
    locationName: string;
    locationCity: string;
    locationAddress: string;
    description: string;
    imageUrl: string;
    eventTime: Date;
    ticketCategories: TicketCategory[];
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