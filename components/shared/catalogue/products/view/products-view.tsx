import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Button,
  Center,
  Grid,
  Group,
  Loader,
  Pagination,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React from "react";
import ProductGridView from "./grid-view";
import ProductTableView from "./table-view";
import { addProductToCart } from "@/lib/redux/features/products/cart/cartSlice";

interface ProductsViewProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  pagination: { last_page: number };
}

const ProductsView = ({
  viewMode,
  setViewMode,
  pagination,
}: ProductsViewProps) => {
  const dispatch = useAppDispatch();
  const { productsLoading: productsDisplayLoading } = useAppSelector(
    (state) => state.products,
  );

  const handleAddProductToCart = async (item: CartProduct): Promise<void> => {
    try {
      await dispatch(addProductToCart(item)).unwrap();
      notifications.show({
        title: "Added to Cart",
        message: "Item added successfully",
        color: "green",
      });
    } catch (error: unknown) {
      notifications.show({
        title: "Cart Error",
        message: (error as { message?: string })?.message || "Failed to add item to cart",
        color: "red",
      });
    }
  };

  return (
    <Grid.Col span={{ base: 12, md: 9 }}>
      <Stack gap="md">
        {/* Header: Loading & View Mode */}
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {productsDisplayLoading ? <Loader size="xs" /> : `Showing products`}
          </Text>

          <Group gap="xs">
            <Button
              variant={viewMode === "grid" ? "filled" : "subtle"}
              size="xs"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "filled" : "subtle"}
              size="xs"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </Group>
        </Group>

        {/* Product List */}
        {productsDisplayLoading ? (
          <Center py="xl">
            <Loader size="md" />
          </Center>
        ) : viewMode === "grid" ? (
          <ProductGridView
            addProductToCart={handleAddProductToCart}
          />
        ) : (
          <ProductTableView
            addProductToCart={handleAddProductToCart}
          />
        )}

        {/* Pagination */}
        <Group justify="center" mt="xl">
          <Pagination total={pagination.last_page} />
        </Group>
      </Stack>
    </Grid.Col>
  );
};

export default ProductsView;
