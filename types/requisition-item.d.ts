type RequisitionItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
  description?: string;
  isNew?: boolean;
  addToCatalogue?: boolean;
  custom_values?: CustomFieldValue[];
};
