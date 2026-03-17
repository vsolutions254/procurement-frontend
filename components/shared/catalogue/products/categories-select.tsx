import {
  fetchCategories,
  searchCategories,
  createCategory,
} from "@/lib/redux/features/products/categories/categoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Grid,
  NumberInput,
  Select,
  Group,
  Button,
  Modal,
  TextInput,
  Stack,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { UseFormReturnType } from "@mantine/form";

interface CategoriesSelectProps {
  form: UseFormReturnType<CreateProductFormData>;
}

const CategoriesSelect = ({ form }: CategoriesSelectProps) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.product_categories);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories(1));
  }, [dispatch]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setCreating(true);
    try {
      const result = await dispatch(
        createCategory({
          name: newCategoryName,
          description: "",
          image: null,
        }),
      ).unwrap();

      form.setFieldValue("category_id", result.id.toString());

      notifications.show({
        title: "Success",
        message: `Category "${result.name}" created successfully`,
        color: "green",
      });

      setNewCategoryName("");
      setModalOpen(false);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to create category. Please try again.",
        color: "red",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewCategoryName("");
  };

  return (
    <>
      <Grid gutter="md">
        <Grid.Col span={6}>
          <Group align="end" gap="xs">
            <div style={{ flex: 1 }}>
              <Select
                label="Category"
                placeholder="Select category"
                data={(categories || []).map((category) => ({
                  value: category.id.toString(),
                  label: category.name,
                }))}
                key={form.key("category_id")}
                {...form.getInputProps("category_id")}
                searchable
                onSearchChange={(query) => {
                  if (query) {
                    dispatch(searchCategories(query));
                  } else {
                    dispatch(fetchCategories(1));
                  }
                }}
                required
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setModalOpen(true)}
            >
              +
            </Button>
          </Group>
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Price (KES)"
            placeholder="0"
            key={form.key("base_price")}
            {...form.getInputProps("base_price")}
            min={0}
            prefix="KES "
            thousandSeparator=","
            required
          />
        </Grid.Col>
      </Grid>

      <Modal
        opened={modalOpen}
        onClose={handleCloseModal}
        title="Create New Category"
        size="sm"
      >
        <Stack gap="md">
          <TextInput
            label="Category Name"
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
            required
          />
          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
              loading={creating}
            >
              Create
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default CategoriesSelect;