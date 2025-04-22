interface CompanyData {
    name: string;
    avatar: string;
    bus_image: string;
  }
  
  interface PaymentData {
    status: string;
    status_code: string;
    invoice_id: number;
    gateway: string;
    invoice_url: string;
    data: {
      notes: string;
    };
  }
  
  interface Station {
    id: number;
    city_id: number;
    city_name: string;
    arrival_at: string;
    name: string;
    latitude: string;
    longitude: string;
    price: number;
    original_price: number;
    final_price: number;
  }
  
  interface Ticket {
    id: number;
    seat_number: string;
    price: string;
  }
  
  export interface Rate {
    comment?:string
    id?:number
    rating:number
  }
  export interface Order {
    number: string;
    id: number;
    trip_id: number;
    gateway_order_id: number;
    company_data: CompanyData;
    status: string;
    status_code: string;
    gateway_id: string;
    company_name: string;
    category: string;
    can_be_cancel: boolean;
    trip_type: string;
    is_confirmed: boolean;
    review?: Rate;
    can_review: boolean;
    payment_data: PaymentData;
    station_from: Station;
    station_to: Station;
    tickets: Ticket[];
    date: string;
    date_time: string;
    payment_url: string;
    cancel_url: string;
    original_tickets_totals: string;
    discount: string;
    wallet_discount: string;
    tickets_totals_after_discount: string;
    payment_fees: string;
    total: string;
  }
  