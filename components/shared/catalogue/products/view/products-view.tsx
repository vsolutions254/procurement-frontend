import { useAppSelector } from "@/lib/redux/hooks";
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
import { IconGrid3x3, IconList } from "@tabler/icons-react";
import React from "react";
import ProductGridView from "./grid-view";
import ProductTableView from "./table-view";

interface ProductsViewProps {
  activeTab: string;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  pagination: { last_page: number };
}

const ProductsView = ({
  activeTab,
  viewMode,
  setViewMode,
  pagination,
}: ProductsViewProps) => {
  const { products, productsLoading } = useAppSelector(
    (state) => state.products,
  );

  return (
    <Grid.Col span={{ base: 12, md: 9 }}>
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {productsLoading
              ? "Loading..."
              : `Showing ${products.length} items`}
          </Text>
          <Group gap="xs">
            <Button
              variant={viewMode === "grid" ? "filled" : "subtle"}
              size="xs"
              leftSection={<IconGrid3x3 size={14} />}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "filled" : "subtle"}
              size="xs"
              leftSection={<IconList size={14} />}
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
          </Group>
        </Group>

        {productsLoading ? (
          <Center py="xl">
            <Loader size="md" />
          </Center>
        ) : viewMode === "grid" ? (
          <ProductGridView activeTab={activeTab} />
        ) : (
          <ProductTableView activeTab={activeTab} />
        )}

        <Group justify="center" mt="xl">
          <Pagination total={pagination.last_page} />
        </Group>
      </Stack>
    </Grid.Col>
  );
};

export default ProductsView;
