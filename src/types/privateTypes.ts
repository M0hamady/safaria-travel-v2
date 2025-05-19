export type Address = {
  id: string;
  city: string | null;
  name: string;
  phone: string;
  notes: string;
  whatsapp_share_link: string;
  map_location: {
    lat: number;
    lng: number;
    address_name: string;
  };
  value?: string; // Optional value used for selection (boarding/return)
};
