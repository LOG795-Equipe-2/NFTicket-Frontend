import { Models } from "appwrite";

export default interface TicketCategory {
  type: string;
  price: number;
  amount: number;
  styling: Styling;
}

export interface TicketCategoryModel extends Models.Document {
  type: string;
  price: number;
  amount: number;
  stylingId: string;
  eventId: string;
  initialQuantity: number;
  remainingQuantity: number;
}

export interface Styling {
  useBorder: boolean,
  primaryColor: string,
  secondaryColor: string,
  backgroundColor: string,
  backgroundImage: string
}