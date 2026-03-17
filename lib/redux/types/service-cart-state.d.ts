type RawCartService = {
  service_id: number;
  quantity: number;
  custom_values: CustomFieldValue[];
};

type ServiceCartState = {
  services: RawCartService[];
  servicesLoading: boolean;
  servicesError: string | null;
  serviceDetails: Record<number, service_fields>;
  serviceDetailsLoading: Record<number, boolean>;
};
