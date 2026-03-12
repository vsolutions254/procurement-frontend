type Service = {
  id: number;
  category: Category;
  name: string;
  description?: string;
  base_price: number;
  specifications?: string;
  service_terms?: string;
  sellable: Sellable;
};
