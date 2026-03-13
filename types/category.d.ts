type Category = {
  id: number;
  name: string;
  description: string;
  image: string | File | null;
  products: Product[];
  services: Service[];
  services_count?: number;
  custom_fields?: CustomField[];
};
