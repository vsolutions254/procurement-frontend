type ProductsState = {
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  product: Product;
  productLoading: boolean;
  productError: string | null;
  pagination: {
    currentPage: number;
    total: number;
    last_page: number;
  };
};
