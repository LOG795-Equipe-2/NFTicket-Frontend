import Ticket from "./Ticket";

export default interface Event {
    location: string,
    name: string,
    description: string,
    image: string,
    tickets: Ticket[]
}