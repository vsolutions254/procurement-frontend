export type SuppliersState = {
  suppliers: User[];
  suppliersLoading: boolean;
  suppliersError: string | null;
  supplier: User;
  supplierLoading: boolean;
  supplierError: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
};
