import { fetchCategories } from "@/lib/redux/features/products/categories/categoriesSlice";
import { fetchServiceCategories } from "@/lib/redux/features/services/categories/serviceCategoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Grid, Paper, Select, Tabs, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useEffect } from "react";

const ServicesFilters = () => {
  const dispatch = useAppDispatch();
  const { categories = [] } = useAppSelector(
    (state) => state.product_categories,
  );
  const { categories: serviceCategories = [] } = useAppSelector(
    (state) => state.service_categories,
  );

  useEffect(() => {
    dispatch(fetchCategories(1));
    dispatch(fetchServiceCategories(1));
  }, [dispatch]);

  return (
    <Tabs.Panel value="services" pt="md">
      <Paper p="md" withBorder>
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Search services, suppliers, or categories..."
              leftSection={<IconSearch size={16} />}
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="All Categories"
              data={[
                ...categories.map((cat) => ({
                  value: `product_${cat.id}`,
                  label: cat.name,
                })),
                ...serviceCategories.map((cat) => ({
                  value: `service_${cat.id}`,
                  label: cat.name,
                })),
              ]}
              size="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Sort by"
              data={[
                "Relevance",
                "Price: Low to High",
                "Price: High to Low",
                "Name A-Z",
                "Name Z-A",
              ]}
              size="md"
            />
          </Grid.Col>
        </Grid>
      </Paper>
    </Tabs.Panel>
  );
};

export default ServicesFilters;
