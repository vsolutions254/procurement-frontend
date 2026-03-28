type CreateServiceFormData = {
  service_name: string;
  description: string;
  base_price: number;
  category_id: number;
  supplier_ids?: string[];
  tax_status: string;
  tax_type: string;
  tax_method: string;
  tax_value_type: string;
  tax_value: number;
  specifications: string;
  service_terms: string;
};
