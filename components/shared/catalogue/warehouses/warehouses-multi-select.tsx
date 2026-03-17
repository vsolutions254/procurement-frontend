import { fetchWarehouses } from "@/lib/redux/features/merchants/merchantSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { MultiSelect } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React, { useEffect } from "react";

interface WarehousesMultiSelectProps {
  form: UseFormReturnType<CreateProductFormData>;
}

const WarehousesMultiSelect = ({ form }: WarehousesMultiSelectProps) => {
  const dispatch = useAppDispatch();
  const { warehouses } = useAppSelector((state) => state.merchants);

  useEffect(() => {
    dispatch(fetchWarehouses());
  }, [dispatch]);

  return (
    <MultiSelect
      label="Warehouses"
      placeholder="Select warehouses"
      data={warehouses.map((warehouse) => ({
        value: warehouse.id.toString(),
        label: warehouse.name,
      }))}
      key={form.key("warehouses")}
      {...form.getInputProps("warehouses")}
      searchable
      required
    />
  );
};

export default WarehousesMultiSelect;
