export default interface TicketCategory {
  type: string;
  price: number;
  initialAmount: number;
  styling: {
    useBorder: boolean,
    primaryColor: string,
    secondaryColor: string,
    backgroundColor: string,
    backgroundImage: string
  };
  remainingAmount?: number;
  id?: string;
}