export default interface Ticket {
  type: string;
  price: number;
  amount: number;
  styling: {
    useBorder: boolean,
    primaryColor: string,
    secondaryColor: string,
    backgroundColor: string,
    backgroundImage: string
  };
}