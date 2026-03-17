import { fetchCategories } from "@/lib/redux/features/products/categories/categoriesSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  Accordion,
  Card,
  MultiSelect,
  RangeSlider,
  Stack,
  Text,
} from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
import React, { useEffect } from "react";

const ECommerceFilters = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCategories(1));
  }, [dispatch]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
      <Text fw={600} size="lg" mb="md">
        Filters
      </Text>

      <Accordion variant="contained">
        <Accordion.Item value="base_price">
          <Accordion.Control icon={<IconFilter size={16} />}>
            Price
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <RangeSlider
                min={0}
                max={200000}
                step={5000}
                defaultValue={[0, 200000]}
                marks={[
                  { value: 0, label: "KES 0" },
                  { value: 200000, label: "KES 200K" },
                ]}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="supplier">
          <Accordion.Control icon={<IconFilter size={16} />}>
            Supplier
          </Accordion.Control>
          <Accordion.Panel>
            <MultiSelect
              data={["Office Pro Ltd", "Tech Solutions Inc", "Supplies Direct"]}
              placeholder="Select suppliers"
              searchable
              clearable
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};

export default ECommerceFilters;
