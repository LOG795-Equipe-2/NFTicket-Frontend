import Ticket from "./TicketCategory";

export default interface Event {
    location: string,
    name: string,
    description: string,
    image: string,
    ticketCategories: Ticket[]
}