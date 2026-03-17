type service_fields = {
  id: number;
  name: string;
  description?: string;
  base_price: number;
  specifications?: string;
  service_terms?: string;
  sellable: Sellable;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    custom_fields?: CustomField[];
  };
};

type Service = service_fields;
