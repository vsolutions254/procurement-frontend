import { fetchCategories } from "@/lib/redux/features/products/categories/categoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Category } from "@/types/category";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  Table,
  Title,
} from "@mantine/core";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import CategoriesTableSkeleton from "./skeletons/categories-table-skeleton";

const CategoriesTable = ({
  setCategoryModalOpen,
  handleDeleteCategory,
}: {
  setCategoryModalOpen: (open: boolean) => void;
  handleDeleteCategory: (category: Category) => void;
}) => {
  const dispatch = useAppDispatch();
  const { categories, categoriesLoading, pagination } = useAppSelector(
    (state) => state.product_categories,
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchCategories(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (categoriesLoading) return <CategoriesTableSkeleton />;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={4}>Product Categories</Title>
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
            <Table.Th>Items Count</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {categories.map((category) => (
            <Table.Tr key={category.id}>
              <Table.Td>{category.name}</Table.Td>
              <Table.Td>
                <Badge variant="light" size="sm">
                  {category.products.length ?? 0}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon variant="subtle" color="blue">
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {pagination.lastPage > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            value={currentPage}
            onChange={handlePageChange}
            total={pagination.lastPage}
          />
        </Group>
      )}
    </Card>
  );
};

export default CategoriesTable;
