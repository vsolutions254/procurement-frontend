export type CategoriesState = {
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  category: Category;
  categoryLoading: boolean;
  categoryError: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
};
