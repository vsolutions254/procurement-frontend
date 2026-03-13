"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { fetchCategories } from "@/lib/redux/features/products/categories/categoriesSlice";
import { getProducts } from "@/lib/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Grid, Paper, Select, Tabs, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const ProductFilters = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.product_categories);

  useEffect(() => {
    dispatch(fetchCategories(1));
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      dispatch(getProducts({ search_term: debouncedSearchTerm }));
    }
  }, [debouncedSearchTerm, dispatch]);

  return (
    <Tabs.Panel value="inventory" pt="md">
      <Paper p="md" withBorder>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Search by product name, supplier name or category name"
              leftSection={<IconSearch size={16} />}
              size="md"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="All Categories"
              data={(categories ?? []).map((cat) => ({
                value: cat.id.toString(),
                label: cat.name,
              }))}
              onChange={(val) => {
                dispatch(getProducts({ category_id: parseInt(val!) }));
              }}
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Sort by"
              data={[
                { label: "Price: Low to High", value: "price_low_high" },
                { label: "Price: High to Low", value: "price_high_low" },
                { label: "Name A-Z", value: "name_asc" },
                { label: "Name Z-A", value: "name_desc" },
              ]}
              onChange={(val) => {
                dispatch(
                  getProducts({
                    sort_by: val as SortBy,
                  }),
                );
              }}
              size="md"
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Tabs.Panel>
  );
};

export default ProductFilters;
