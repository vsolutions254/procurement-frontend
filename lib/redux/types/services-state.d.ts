import { Product } from "@/types/product";

type ServicesState = {
  services: Service[];
  servicesLoading: boolean;
  servicesError: string | null;
  service: Service | null;
  serviceLoading: boolean;
  serviceError: string | null;
  pagination: {
    currentPage: number;
    total: number;
    last_page: number;
  };
};
