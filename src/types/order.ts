interface CompanyData {
    name: string;
    avatar: string;
    bus_image: string;
  }
  
  interface PaymentData {
    status: string;
    status_code: string;
    invoice_id: number;
    gateway?: string;
    invoice_url?: string;
    data: {
      notes: string;
    };
  }
  interface location {
    id:string;
    name:string;
    name_en:string;
    name_ar:string;

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
  export interface TrainOrder {
  id: number;
  number: string;
  gateway_order_id: string;
  trip_id: number;
  station_from: {
    id: string;
    name: string;
  };
  station_to: {
    id: string;
    name: string;
  };
  tickets: {
    id: string;
    train_name: string;
    train_type: string;
    seat_no: string;
    coach_name: string;
    coach_class: string;
  }[];
  train: {
    id: number;
    name: string;
  };
  national_id: string;
  seats_no: number;
  status: string;
  status_code: string;
  gateway_id: string;
  can_be_cancel: boolean;
  is_confirmed: boolean;
  invoice_url: string;
  can_review: boolean;
  payment_data: {
    status: string;
    status_code: string;
    invoice_id: number;
    gateway: string;
    invoice_url: string;
    data: {
      notes: string;
    };
  };
  date: string; // format: "YYYY-MM-DD"
  date_time: string; // format: "YYYY-MM-DD HH:MM AM/PM"
  payment_url: string;
  cancel_url: string;
  original_tickets_totals: string; // currency formatted string
  discount: string;
  wallet_discount: string;
  tickets_totals_after_discount: string;
  payment_fees: string;
  total: string;
}

interface BusData {
  id: number | null;
  name: string | null;
  type: string | null;
  seats_number: number | null;
  license_plate: string | null;
  vin: string | null;
  mileage: number | null;
  engine_hours: number | null;
  model: string | null;
  year: number | null;
  color: string | null;
  notes: string | null;
  status: string | null;
  featured_image: string | null;
  images: string[] | null;
}
export interface PrivateOrder {
  id: number;
  date: string;
  date_time: string;
  status: string;
  status_code: string;
  payment_status: string;
  payment_status_code: string;
  rounded: boolean;
  return_date: string | null;
  payment_data: PaymentData;
  from_location: location | null;
  to_location: location | null;
  bus: BusData;
  address: string | null;
  from_address: string | null;
  to_address: string | null;
  can_pay: boolean;
  can_be_cancel: boolean;
  company: string | null;
  trip_id: number;
  trip_type: string; // "Private"
  payment_url: string;
  cancel_url: string;
  original_tickets_totals: string;
  discount: string;
  tickets_totals: string;
  payment_fees_percentage: string;
  payment_fees_value: string;
  total: string;
}