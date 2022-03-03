import Ticket from "./TicketCategory";

export default interface Event {
    locationName: string,
    locationAddress: string;
    locationCity?: string;
    name: string,
    description: string,
    image: string,
    ticketCategories: Ticket[]
}