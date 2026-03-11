"use client";

import { ContentContainer } from "@/components/layout/content-container";
import { fetchCategories } from "@/lib/redux/features/products/categories/categoriesSlice";
import { getProducts } from "@/lib/redux/features/products/productsSlice";
import { fetchServiceCategories } from "@/lib/redux/features/services/categories/serviceCategoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { nonTangibleCatalogueItems } from "@/lib/utils/constants";
import {
  TextInput,
  Select,
  Grid,
  Card,
  Text,
  Group,
  Badge,
  Button,
  Stack,
  Title,
  Paper,
  Image,
  ActionIcon,
  Pagination,
  MultiSelect,
  RangeSlider,
  Accordion,
  Table,
  Tabs,
} from "@mantine/core";
import {
  IconSearch,
  IconShoppingCart,
  IconHeart,
  IconEye,
  IconFilter,
  IconGrid3x3,
  IconList,
  IconPlane,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuppliersCatalogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<string | null>("inventory");

  const dispatch = useAppDispatch();

  const { products } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.product_categories);
  const { categories: serviceCategories } = useAppSelector(
    (state) => state.service_categories,
  );

  useEffect(() => {
    dispatch(getProducts({ page: 1 }));
    dispatch(fetchCategories(1));
    dispatch(fetchServiceCategories(1));
  }, [dispatch]);

  const currentItems =
    activeTab === "inventory" ? products : nonTangibleCatalogueItems;
  const currentCategories =
    activeTab === "inventory" ? categories : serviceCategories;

  return (
    <ContentContainer>
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2} mb="xs">
              Suppliers Catalog
            </Title>
            <Text c="dimmed" size="sm">
              Browse items from external suppliers and service providers
            </Text>
          </div>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="inventory" leftSection={<IconGrid3x3 size={16} />}>
              Products ({products.length})
            </Tabs.Tab>
            <Tabs.Tab value="services" leftSection={<IconPlane size={16} />}>
              Services ({nonTangibleCatalogueItems.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="inventory" pt="md">
            <Paper p="md" withBorder>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    placeholder="Search supplier items, categories..."
                    leftSection={<IconSearch size={16} />}
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Select
                    placeholder="All Categories"
                    data={categories
                      .concat(serviceCategories)
                      .map((cat) => (typeof cat === "string" ? cat : cat.name))}
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
                      "Supplier A-Z",
                    ]}
                    size="md"
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="services" pt="md">
            <Paper p="md" withBorder>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    placeholder="Search supplier services, categories..."
                    leftSection={<IconSearch size={16} />}
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Select
                    placeholder="All Categories"
                    data={categories
                      .concat(serviceCategories)
                      .map((cat) => (typeof cat === "string" ? cat : cat.name))}
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
                      "Supplier A-Z",
                    ]}
                    size="md"
                  />
                </Grid.Col>
              </Grid>
            </Paper>
          </Tabs.Panel>
        </Tabs>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Text fw={600} size="lg" mb="md">
                Filters
              </Text>

              <Accordion variant="contained">
                <Accordion.Item value="supplier">
                  <Accordion.Control icon={<IconFilter size={16} />}>
                    Supplier
                  </Accordion.Control>
                  <Accordion.Panel>
                    <MultiSelect
                      data={[
                        "Office Pro Ltd",
                        "Tech Solutions Inc",
                        "Supplies Direct",
                        "Kenya Airways",
                        "Serena Hotels",
                        "Avis Kenya",
                      ]}
                      placeholder="Select suppliers"
                      searchable
                      clearable
                    />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="category">
                  <Accordion.Control icon={<IconFilter size={16} />}>
                    Category
                  </Accordion.Control>
                  <Accordion.Panel>
                    <MultiSelect
                      data={currentCategories
                        .slice(1)
                        .map((cat) =>
                          typeof cat === "string" ? cat : cat.name,
                        )}
                      placeholder="Select categories"
                      searchable
                      clearable
                    />
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="price">
                  <Accordion.Control icon={<IconFilter size={16} />}>
                    Price Range
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

                <Accordion.Item value="availability">
                  <Accordion.Control icon={<IconFilter size={16} />}>
                    Availability
                  </Accordion.Control>
                  <Accordion.Panel>
                    <MultiSelect
                      data={["Available", "Out of Stock"]}
                      placeholder="Select availability"
                      clearable
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 9 }}>
            <Stack gap="md">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Showing {currentItems.length} supplier items
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

              {viewMode === "grid" ? (
                <Grid gutter="md">
                  {currentItems.map((item) => (
                    <Grid.Col key={item.id} span={{ base: 12, sm: 6, lg: 4 }}>
                      <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        h="100%"
                      >
                        {activeTab === "inventory" ? (
                          <Card.Section style={{ position: "relative" }}>
                            <Image
                              src={
                                ("image" in item ? item.image : null) ||
                                "/placeholder.svg"
                              }
                              height={180}
                              alt={item.name}
                            />
                            <Group
                              gap="xs"
                              style={{ position: "absolute", top: 8, right: 8 }}
                            >
                              <ActionIcon
                                variant="filled"
                                color="blue"
                                size="sm"
                              >
                                <Link
                                  href={`/application/catalogue/${item.id}`}
                                >
                                  <IconEye size={16} />
                                </Link>
                              </ActionIcon>
                            </Group>
                          </Card.Section>
                        ) : (
                          <Card.Section
                            p="md"
                            style={{
                              minHeight: 120,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            <Link
                              href={`/application/cart/non-tangible/${item.id}`}
                              style={{ textDecoration: "none" }}
                            >
                              <Group>
                                <IconPlane size={32} color="#228be6" />
                                <Text size="sm" c="blue" fw={500}>
                                  View service details
                                </Text>
                              </Group>
                            </Link>
                          </Card.Section>
                        )}
                        <Stack gap="xs" mt="md">
                          <Group justify="space-between" align="flex-start">
                            <div style={{ flex: 1 }}>
                              <Text fw={600} size="sm" lineClamp={2}>
                                {item.name}
                              </Text>
                              <Text size="xs" c="dimmed" mt={4}>
                                {item.id}
                              </Text>
                            </div>
                            <ActionIcon variant="subtle" color="gray">
                              <IconHeart size={18} />
                            </ActionIcon>
                          </Group>
                          <Text size="xs" c="dimmed" lineClamp={2}>
                            {item.description}
                          </Text>
                          <Group justify="space-between" mt="xs">
                            <div>
                              <Text size="xs" c="dimmed">
                                Supplier
                              </Text>
                              <Text size="xs" fw={500}>
                                {item.supplier}
                              </Text>
                            </div>
                            <Text size="lg" fw={700} c="cyan">
                              {item.price}
                            </Text>
                          </Group>
                          <Button
                            leftSection={<IconShoppingCart size={16} />}
                            variant="filled"
                            fullWidth
                            disabled={!item.inStock}
                            mt="md"
                          >
                            Request Quote
                          </Button>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              ) : (
                <Table highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Item</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Supplier</Table.Th>
                      <Table.Th>Price</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {currentItems.map((item) => (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <div>
                            <Text fw={500} size="sm">
                              {item.name}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {item.id}
                            </Text>
                            <Text size="xs" c="dimmed" lineClamp={1}>
                              {item.description}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light" size="sm">
                            {item.category}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{item.supplier}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={600} c="cyan">
                            {item.price}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color={item.inStock ? "green" : "red"}
                          >
                            {item.inStock ? "Available" : "Out of Stock"}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <ActionIcon variant="subtle" color="blue">
                              <Link
                                href={
                                  activeTab === "inventory"
                                    ? `/application/catalogue/${item.id}`
                                    : `/application/cart/non-tangible/${item.id}`
                                }
                              >
                                <IconEye size={16} />
                              </Link>
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="gray">
                              <IconHeart size={16} />
                            </ActionIcon>
                            <Button
                              size="xs"
                              leftSection={<IconShoppingCart size={14} />}
                              disabled={!item.inStock}
                            >
                              Request Quote
                            </Button>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}

              <Group justify="center" mt="xl">
                <Pagination total={10} />
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </ContentContainer>
  );
}
