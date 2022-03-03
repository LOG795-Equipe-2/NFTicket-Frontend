import Ticket from "./TicketCategory";

export default interface Event {
    id: string;
    locationName: string;
    locationAddress: string;
    locationCity?: string;
    name: string;
    description: string;
    image: string;
    ticketCategories: Ticket[];
    dateTime: Date;
}