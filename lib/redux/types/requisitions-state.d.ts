type RequisitionsState = {
  requisitions: Requisition[];
  requisitionsLoading: boolean;
  requisitionsError: string | null;
  requisition: Requisition | null;
  requisitionLoading: boolean;
  requisitionError: string | null;
};
