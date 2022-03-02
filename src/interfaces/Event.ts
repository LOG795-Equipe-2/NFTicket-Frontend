import Ticket from "./Ticket";

export default interface Event {
    id: string,
    name: string,
    description: string,
    image: string,
    tickets: Ticket[]
}