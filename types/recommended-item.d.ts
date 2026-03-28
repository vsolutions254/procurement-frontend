type RecommendedItem = {
  id: number;
  company: User;
  recommender: User;
  name: string;
  price: number;
  reason?: string;
  description?: string;
  specifications?: string;
  product?: Product;
  service?: Service;
  product_category?: ProductCategory;
  service_category?: ServiceCategory;
  type?: "product" | "service";
};
