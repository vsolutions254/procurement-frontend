import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Stack,
  Tabs,
  Text,
  Badge,
  Paper,
  ActionIcon,
} from "@mantine/core";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import CartHeader from "./cart-header";
import { IconArrowRight, IconPackage, IconPlane, IconSparkles, IconPlus } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import ProductsTab from "./products/products-tab";
import ServicesTab from "./services/services-tab";
import { getCartProducts } from "@/lib/redux/features/products/cart/cartSlice";
import { formatCurrency } from "@/components/shared/catalogue/services/utils/constants";

const CartItems = ({
  totalItems,
  setEditModalOpen,
  setSelectedItem,
  subtotal,
  tax,
  setProceedModalOpen,
  total,
}: {
  totalItems: number;
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setProceedModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedItem: Dispatch<SetStateAction<CartService | null>>;
  subtotal: number;
  tax: number;
  total: number;
}) => {
  const [activeTab, setActiveTab] = useState<string | null>("products");
  const dispatch = useAppDispatch();

  const { products } = useAppSelector((state) => state.products_cart);
  const { services } = useAppSelector((state) => state.services_cart);

  useEffect(() => {
    dispatch(getCartProducts());
  }, [dispatch]);

  const recommendedItems = [
    { id: "REC-001", name: "Wireless Keyboard", category: "IT Equipment", price: 4500 },
    { id: "REC-002", name: "USB-C Hub", category: "IT Equipment", price: 3200 },
    { id: "REC-003", name: "Desk Organizer Set", category: "Office Supplies", price: 1800 },
    { id: "REC-004", name: "Monitor Stand", category: "Furniture", price: 6500 },
    { id: "REC-005", name: "Ergonomic Mouse Pad", category: "Office Supplies", price: 950 },
  ];

  return (
    <Grid gutter="lg">
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <CartHeader total_items={totalItems} />
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="products" leftSection={<IconPackage size={16} />}>
                Products ({products.length})
              </Tabs.Tab>
              <Tabs.Tab value="services" leftSection={<IconPlane size={16} />}>
                Services ({services.length})
              </Tabs.Tab>
              <Tabs.Tab value="recommended" leftSection={<IconSparkles size={16} />}>
                Recommended
              </Tabs.Tab>
            </Tabs.List>

            <ProductsTab />

            <ServicesTab
              setEditModalOpen={setEditModalOpen}
              setSelectedItem={setSelectedItem}
            />

            <Tabs.Panel value="recommended" pt="md">
              <Stack gap="sm">
                {recommendedItems.map((item) => (
                  <Paper key={item.id} p="sm" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text size="sm" fw={500}>{item.name}</Text>
                        <Group gap="xs" mt={2}>
                          <Badge size="xs" variant="light">{item.category}</Badge>
                          <Text size="xs" c="dimmed">{item.id}</Text>
                        </Group>
                      </div>
                      <Group gap="sm">
                        <Text size="sm" fw={600} c="cyan">{formatCurrency(item.price)}</Text>
                        <ActionIcon variant="light" size="sm">
                          <IconPlus size={14} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack gap="md">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text fw={600} size="lg" mb="md">
              Order Summary
            </Text>

            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm">Subtotal</Text>
                <Text size="sm" fw={500}>
                  {formatCurrency(subtotal)}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Tax</Text>
                <Text size="sm" fw={500}>
                  {formatCurrency(tax)}
                </Text>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text size="md" fw={600}>
                  Total
                </Text>
                <Text size="lg" fw={700} c="cyan">
                  {formatCurrency(total)}
                </Text>
              </Group>
            </Stack>

            <Button
              leftSection={<IconArrowRight size={16} />}
              variant="filled"
              fullWidth
              size="lg"
              mt="xl"
              onClick={() => {
                setProceedModalOpen(true);
              }}
            >
              Proceed to Requisition
            </Button>
          </Card>

          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Text size="sm" fw={600} mb="xs">
              Need Help?
            </Text>
            <Text size="xs" c="dimmed" mb="md">
              Contact procurement support for assistance with your request.
            </Text>
            <Button variant="light" size="xs" fullWidth>
              Contact Support
            </Button>
          </Card>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default CartItems;
