import { fetchServiceCategories } from "@/lib/redux/features/services/categories/serviceCategoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Badge, Button, Card, Group, Table, Tabs, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React, { useEffect } from "react";

interface ServiceCategoriesTableProps {
  setCategoryModalOpen: (open: boolean) => void;
}

const ServiceCategoriesTable = ({
  setCategoryModalOpen,
}: ServiceCategoriesTableProps) => {
  const dispatch = useAppDispatch();
  const { categories, categoriesLoading, pagination } = useAppSelector(
    (state) => state.service_categories,
  );

  console.log("KATEGORIS", categories);

  useEffect(() => {
    dispatch(fetchServiceCategories(1));
  }, [dispatch]);

  return (
    <Tabs.Panel value="services" pt="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={4}>Service Categories</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            size="sm"
            onClick={() => setCategoryModalOpen(true)}
          >
            Add Category
          </Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Category Name</Table.Th>
              <Table.Th>Services Count</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {categories.map((category) => (
              <Table.Tr key={category.id}>
                <Table.Td>{category.name}</Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {category.services_count ?? category.services.length}
                  </Badge>
                </Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Tabs.Panel>
  );
};

export default ServiceCategoriesTable;
