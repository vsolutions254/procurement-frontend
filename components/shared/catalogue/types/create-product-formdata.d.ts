type CreateProductFormData = {
  category_id: string;
  base_price: number;
  product_name: string;
  categories: string[];
  suppliers?: string[];
  description: string;
  specifications: string;
  service_terms: string;
  tax_status: string;
  tax_type: string;
  tax_method: string;
  tax_value_type: string;
  tax_value: number;
};
