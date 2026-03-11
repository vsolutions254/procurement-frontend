"use client";

import { getProducts } from "@/lib/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { nonTangibleCatalogueItems } from "@/lib/utils/constants";
import {
  Card,
  Text,
  Group,
  Button,
  Stack,
  Title,
  Badge,
  Table,
  TextInput,
  Select,
  ActionIcon,
  Modal,
  NumberInput,
  Tabs,
} from "@mantine/core";
import {
  IconSearch,
  IconEdit,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconPackage,
  IconFileText,
  IconEye,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

type InventoryItem = {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
};

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<string | null>("goods");
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts({ page: 1 }));
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "green";
      case "Low Stock":
        return "orange";
      case "Out of Stock":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Stock":
        return <IconCheck size={16} />;
      case "Low Stock":
        return <IconAlertTriangle size={16} />;
      case "Out of Stock":
        return <IconX size={16} />;
      default:
        return null;
    }
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={2} mb="xs">
          Inventory Management
        </Title>
        <Text c="dimmed" size="sm">
          Track and manage inventory levels for procurement decisions
        </Text>
      </div>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="goods" leftSection={<IconPackage size={16} />}>
            Inventory Items (Goods)
          </Tabs.Tab>
          <Tabs.Tab value="services" leftSection={<IconFileText size={16} />}>
            Services
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="goods">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Group gap="md">
                <TextInput
                  placeholder="Search items..."
                  leftSection={<IconSearch size={16} />}
                  w={300}
                />
                <Select
                  placeholder="Category"
                  data={["All", "Furniture", "IT Equipment", "Office Supplies"]}
                  w={150}
                />
                <Select
                  placeholder="Status"
                  data={["All", "In Stock", "Low Stock", "Out of Stock"]}
                  w={150}
                />
              </Group>
            </Group>

            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Item</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Current Stock</Table.Th>
                  <Table.Th>Min/Max</Table.Th>
                  <Table.Th>Unit Price</Table.Th>
                  <Table.Th>Warehouse</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {products.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <div>
                        <Text size="sm" fw={500}>
                          {item.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {item.id}
                        </Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{item.category.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {item.current_stock}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {item.min_stock ?? 0} / {item.max_stock ?? 0}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        KES {item.base_price.toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      {/* <Text size="sm">{item.location}</Text> */}Default
                      Warehouse
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={getStatusColor("In Stock")}
                        leftSection={getStatusIcon("In Stock")}
                      >
                        {"In Stock"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => {
                          setSelectedItem({
                            id: item.id.toString(),
                            name: item.name,
                            currentStock: 0,
                            minStock: 0,
                            maxStock: 0,
                          });
                          setEditModalOpened(true);
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="services">
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md" gap="md">
              <TextInput
                placeholder="Search services..."
                leftSection={<IconSearch size={16} />}
                style={{ flex: 1 }}
              />
              <Select
                placeholder="Category"
                data={[
                  "All",
                  "Travel",
                  "Transport",
                  "Professional Services",
                  "Consulting",
                ]}
                w={200}
              />
            </Group>

            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Service ID</Table.Th>
                  <Table.Th>Service Name</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Supplier</Table.Th>
                  <Table.Th>Base Price</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {nonTangibleCatalogueItems.map((service) => (
                  <Table.Tr key={service.id}>
                    <Table.Td>
                      <Text size="sm" fw={600}>
                        {service.id}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{service.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" size="sm">
                        {service.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{service.supplier}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={600}>
                        {service.price}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={service.inStock ? "green" : "red"}
                      >
                        {service.inStock ? "Available" : "Unavailable"}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon variant="subtle" color="blue">
                        <IconEye size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="Update Stock"
        size="md"
      >
        {selectedItem && (
          <Stack gap="md">
            <Text fw={500}>{selectedItem.name}</Text>
            <NumberInput
              label="Current Stock"
              value={selectedItem.currentStock}
              onChange={(value) =>
                setSelectedItem({
                  ...selectedItem,
                  currentStock: typeof value === "number" ? value : 0,
                })
              }
            />
            <Group grow>
              <NumberInput
                label="Min Stock"
                value={selectedItem.minStock}
                onChange={(value) =>
                  setSelectedItem({
                    ...selectedItem,
                    minStock: typeof value === "number" ? value : 0,
                  })
                }
              />
              <NumberInput
                label="Max Stock"
                value={selectedItem.maxStock}
                onChange={(value) =>
                  setSelectedItem({
                    ...selectedItem,
                    maxStock: typeof value === "number" ? value : 0,
                  })
                }
              />
            </Group>
            <Group justify="flex-end" mt="lg">
              <Button
                variant="outline"
                onClick={() => setEditModalOpened(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setEditModalOpened(false)}>
                Update Stock
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
