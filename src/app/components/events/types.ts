export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  address: {
    id: number;
    name: string;
    city: string;
    street: string;
    postCode: string;
  };
  availableTickets: number;
  ticketPrice: number;
  adult: boolean;
}

export interface EventFormData {
  name: string;
  description: string;
  date: string;
  address: {
    name: string;
    city: string;
    street: string;
    postCode: string;
  };
  availableTickets: string;
  ticketPrice: string;
  adult: boolean;
} 