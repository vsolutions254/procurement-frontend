import { fetchWarehouses } from "@/lib/redux/features/merchants/merchantSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Select } from "@mantine/core";
import React, { useEffect, SetStateAction, Dispatch } from "react";

interface FormData {
  product_name: string;
  category_id: string;
  categories: string[];
  suppliers: string[];
  base_price: number;
  description: string;
  specifications: string;
  service_terms: string;
  tax_status: string;
  tax_type: string;
  tax_method: string;
  tax_value_type: string;
  tax_value: number;
  min_stock: number;
  max_stock: number;
  warehouse_id?: string;
}

interface WarehousesSelectProps {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
}

const WarehousesSelect = ({ formData, setFormData }: WarehousesSelectProps) => {
  const dispatch = useAppDispatch();
  const { warehouses } = useAppSelector((state) => state.merchants);

  useEffect(() => {
    dispatch(fetchWarehouses());
  }, [dispatch]);

  return (
    <Select
      label="Warehouse"
      placeholder="Select warehouse"
      data={warehouses.map((warehouse) => ({
        value: warehouse.id.toString(),
        label: warehouse.name,
      }))}
      value={formData.warehouse_id}
      onChange={(value) =>
        setFormData({
          ...formData,
          warehouse_id: value || "",
        })
      }
      searchable
      required
    />
  );
};

export default WarehousesSelect;
