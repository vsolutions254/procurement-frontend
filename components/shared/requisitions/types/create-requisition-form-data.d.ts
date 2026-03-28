type CreateRequisitionFormData = {
  title: string;
  priority: "low" | "medium" | "high" | "urgent";
  cost_center_id?: number;
  project_id?: number;
  location_id?: number;
  justification?: string;
  custom_receiver_name?: string;
  custom_receiver_phone?: string;
  custom_receiver_email?: string;
  custom_delivery_point?: string;
  custom_delivery_address?: string;
  delivery_date: string;
  delivery_instructions?: string;
};
