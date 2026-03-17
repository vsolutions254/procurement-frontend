type ProductCartState = {
  products: CartProduct[];
  productsLoading: boolean;
  productsError: string | null;
  productDetails: Record<number, Product>;
  productDetailsLoading: Record<number, boolean>;
};
