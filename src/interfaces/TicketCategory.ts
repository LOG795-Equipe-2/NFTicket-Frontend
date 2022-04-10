import { Models } from "appwrite";

export default interface TicketCategory {
  name: string;
  price: number;
  styling: Styling;
  initialAmount: number;
  remainingAmount?: number;
  id?: string;
  atomicTemplateId?: number;
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

export class TicketCategoryTransaction {
  eventName:string
  locationName:string
  originalDateTime:string
  originalPrice:number
  categoryName:string
  numberOfTickets:number

  constructor(eventName:string, locationName:string, originalDateTime:string, originalPrice:number, categoryName:string, numberOfTickets:number){
      this.eventName = eventName
      this.locationName = locationName
      this.originalDateTime = originalDateTime
      this.originalPrice = originalPrice
      this.categoryName = categoryName
      this.numberOfTickets = numberOfTickets
  }

  getSchemaName(){
      return "ticket"
  }

  returnPropertiesAsAttributeMap(): any{
      return [
          { "name": "eventName", "type": "string" },
          { "name": "locationName", "type": "string" },
          { "name": "originalDateTime", "type": "string" },
          { "name": "originalPrice", "type": "float" },
          { "name": "categoryName", "type": "string" }
      ]
  }

  toJSON(): any{
      return {
          "eventName": this.eventName,
          "locationName": this.locationName,
          "originalDateTime": this.originalDateTime,
          "originalPrice": this.originalPrice,
          "categoryName": this.categoryName,
          "numberOfTickets": this.numberOfTickets
      }
  }
}