"use client";

import { ContentContainer } from "@/components/layout/content-container";
import { getProduct } from "@/lib/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { categoryColors } from "@/lib/utils/constants";
import { getInitials, resolveImageUrl } from "@/lib/utils/helpers";
import {
  Anchor,
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Grid,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
  TypographyStylesProvider,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconBox,
  IconClipboardList,
  IconFileDescription,
  IconInfoCircle,
  IconPackage,
  IconReceipt,
  IconUsers,
} from "@tabler/icons-react";
import { use, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  computeTax,
  computeTotal,
  formatCurrency,
  taxStatusColor,
  taxStatusLabel,
} from "@/components/shared/catalogue/services/utils/constants";

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        <Text size="sm" fw={500} component="div">
          {value}
        </Text>
      </Group>
      <Divider />
    </>
  );
}

interface CatalogueItemProps {
  params: Promise<{ item_id: string }>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CatalogueItem({ params }: CatalogueItemProps) {
  const router = useRouter();
  const { item_id } = use(params);
  const dispatch = useAppDispatch();

  const { product, productLoading, productError } = useAppSelector(
    (state) => state.products,
  );

  useEffect(() => {
    dispatch(getProduct(parseInt(item_id)));
  }, [dispatch, item_id]);

  if (productLoading) {
    return (
      <ContentContainer>
        <Stack gap="md" p="md">
          <Skeleton height={28} width={240} radius="md" />
          <Skeleton height={100} radius="md" />
          <SimpleGrid cols={{ base: 2, sm: 4 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={72} radius="md" />
            ))}
          </SimpleGrid>
          <Skeleton height={320} radius="md" />
        </Stack>
      </ContentContainer>
    );
  }

  if (!product || productError) {
    return (
      <ContentContainer>
        <Stack align="center" justify="center" h={300} gap="xs">
          <ThemeIcon size={52} radius="xl" variant="light" color="gray">
            <IconBox size={26} />
          </ThemeIcon>
          <Text fw={600}>Product not found</Text>
          <Text fw={300}>{productError ?? "Something went wrong"}</Text>
          <Anchor size="sm" onClick={() => router.back()}>
            Go back
          </Anchor>
        </Stack>
      </ContentContainer>
    );
  }

  // ── Derived ──────────────────────────────────────────────────────────────

  const suppliers: User[] = Array.isArray(product.suppliers)
    ? product.suppliers
    : [];

  const categoryName: string =
    typeof product.category === "object" && product.category !== null
      ? (product.category as { name: string }).name
      : String(product.category ?? "");

  const color = categoryColors[product.category?.name ?? ""] ?? "blue";
  const imageUrl = resolveImageUrl(product.image);
  const taxAmount = product.sellable ? computeTax(product) : 0;
  const totalPrice = product.sellable
    ? computeTotal(product)
    : Number(product.base_price);
  const isInclusive = product.sellable?.tax_type === "inclusive";
  const basePrice = Number(product.base_price);
  const preTaxAmount = isInclusive ? basePrice - taxAmount : basePrice;

  return (
    <ContentContainer>
      <Stack gap="lg" p={{ base: "sm", md: "xl" }}>
        {/* ── Header ── */}
        <Group justify="space-between" align="center">
          <Group align="center" gap="sm">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="md"
              radius="md"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <IconArrowLeft size={18} />
            </ActionIcon>
            <Stack gap={2}>
              <Text size="xl" fw={700} lh={1.2}>
                {product.name}
              </Text>
              <Text size="xs" c="dimmed">
                {product.product_code}
              </Text>
            </Stack>
          </Group>
          <Badge variant="light" color={color} size="md">
            {categoryName}
          </Badge>
        </Group>

        {/* ── Stat cards ── */}
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
          <Card withBorder radius="md" p="md">
            <Text size="xs" c="dimmed" mb={4}>
              Base price
            </Text>
            <Text size="sm" fw={700}>
              {formatCurrency(basePrice)}
            </Text>
          </Card>

          <Card withBorder radius="md" p="md">
            <Text size="xs" c="dimmed" mb={4}>
              Total price
            </Text>
            <Text size="sm" fw={700}>
              {formatCurrency(totalPrice)}
            </Text>
          </Card>

          <Card withBorder radius="md" p="md">
            <Text size="xs" c="dimmed" mb={4}>
              Current stock
            </Text>
            <Text size="sm" fw={700}>
              {product.current_stock ?? 0} units
            </Text>
          </Card>

          <Card withBorder radius="md" p="md">
            <Text size="xs" c="dimmed" mb={4}>
              Suppliers
            </Text>
            <Text size="sm" fw={700}>
              {suppliers.length}
            </Text>
          </Card>
        </SimpleGrid>

        {/* ── Tabs ── */}
        <Tabs defaultValue="overview" variant="outline" radius="md">
          <Tabs.List>
            <Tabs.Tab
              value="overview"
              leftSection={<IconInfoCircle size={14} />}
            >
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="suppliers" leftSection={<IconUsers size={14} />}>
              Suppliers ({suppliers.length})
            </Tabs.Tab>
            {product.specifications && (
              <Tabs.Tab
                value="specs"
                leftSection={<IconClipboardList size={14} />}
              >
                Specifications
              </Tabs.Tab>
            )}
            <Tabs.Tab value="tax" leftSection={<IconReceipt size={14} />}>
              Tax & pricing
            </Tabs.Tab>
          </Tabs.List>

          {/* ── Overview ── */}
          <Tabs.Panel value="overview" pt="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="md">
                  <Card
                    withBorder
                    radius="md"
                    padding={0}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ position: "relative", width: "100%", height: 340 }}>
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </Card>

                  <Card withBorder radius="md" padding="lg">
                    <Group gap="xs" mb="md">
                      <IconFileDescription size={16} />
                      <Text size="sm" fw={600}>
                        Description
                      </Text>
                    </Group>
                    <Text
                      size="sm"
                      c={product.description ? "inherit" : "dimmed"}
                      lh={1.7}
                    >
                      {product.description ?? "No description provided."}
                    </Text>
                  </Card>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder radius="md" padding="lg" h="100%">
                  <Text size="sm" fw={600} mb="md">
                    Details
                  </Text>
                  <Stack gap="md">
                    <FieldRow label="Code" value={product.product_code} />
                    <FieldRow
                      label="Category"
                      value={
                        <Badge variant="light" color={color} size="sm">
                          {categoryName}
                        </Badge>
                      }
                    />
                    <FieldRow
                      label="Created"
                      value={new Date(product.created_at!).toLocaleDateString(
                        "en-KE",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    />
                    <FieldRow
                      label="Last updated"
                      value={new Date(product.updated_at!).toLocaleDateString(
                        "en-KE",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    />
                    {suppliers[0] && (
                      <FieldRow
                        label="Primary supplier"
                        value={suppliers[0].company_name}
                      />
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          {/* ── Suppliers ── */}
          <Tabs.Panel value="suppliers" pt="md">
            <Card withBorder radius="md" padding={0}>
              {suppliers.length === 0 ? (
                <Stack align="center" py="xl" gap="xs">
                  <ThemeIcon size={44} radius="xl" variant="light" color="gray">
                    <IconUsers size={22} />
                  </ThemeIcon>
                  <Text size="sm" fw={600}>
                    No suppliers linked
                  </Text>
                </Stack>
              ) : (
                <Table
                  highlightOnHover
                  verticalSpacing="sm"
                  horizontalSpacing="md"
                >
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>
                        <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                          Supplier
                        </Text>
                      </Table.Th>
                      <Table.Th>
                        <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                          Code
                        </Text>
                      </Table.Th>
                      <Table.Th>
                        <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                          Contact
                        </Text>
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {suppliers.map((supplier, index) => (
                      <Table.Tr key={supplier.id}>
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            <Avatar
                              size={34}
                              radius="xl"
                              color="blue"
                              variant="light"
                            >
                              {getInitials(supplier.company_name)}
                            </Avatar>
                            <Box>
                              <Group gap={6}>
                                <Text size="sm" fw={600} lineClamp={1}>
                                  {supplier.company_name}
                                </Text>
                                {index === 0 && (
                                  <Badge
                                    size="xs"
                                    variant="light"
                                    color="green"
                                  >
                                    Primary
                                  </Badge>
                                )}
                              </Group>
                              <Text size="xs" c="dimmed">
                                @{supplier.user_name}
                              </Text>
                            </Box>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">
                            {supplier.user_code}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Stack gap={2}>
                            <Text size="sm">{supplier.email}</Text>
                            {supplier.phone && (
                              <Text size="xs" c="dimmed">
                                {supplier.phone}
                              </Text>
                            )}
                          </Stack>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </Card>
          </Tabs.Panel>

          {/* ── Specifications ── */}
          {product.specifications && (
            <Tabs.Panel value="specs" pt="md">
              <Card withBorder radius="md" padding="lg">
                <Group gap="xs" mb="md">
                  <IconPackage size={16} />
                  <Text size="sm" fw={600}>
                    Specifications
                  </Text>
                </Group>
                <TypographyStylesProvider>
                  <div
                    dangerouslySetInnerHTML={{ __html: product.specifications }}
                  />
                </TypographyStylesProvider>
              </Card>
            </Tabs.Panel>
          )}

          {/* ── Tax & pricing ── */}
          <Tabs.Panel value="tax" pt="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder radius="md" padding="lg">
                  <Text size="sm" fw={600} mb="md">
                    Tax configuration
                  </Text>
                  {!product.sellable ? (
                    <Text size="sm" c="dimmed">
                      No tax information available.
                    </Text>
                  ) : (
                    <Stack gap="md">
                      <FieldRow
                        label="Tax status"
                        value={
                          <Badge
                            variant="light"
                            color={taxStatusColor(product.sellable.tax_status)}
                            size="sm"
                          >
                            {taxStatusLabel(product.sellable.tax_status)}
                          </Badge>
                        }
                      />
                      {product.sellable.tax_type && (
                        <FieldRow
                          label="Tax type"
                          value={
                            <Badge
                              variant="light"
                              color={isInclusive ? "teal" : "orange"}
                              size="sm"
                            >
                              {isInclusive ? "Inclusive" : "Exclusive"}
                            </Badge>
                          }
                        />
                      )}
                      {product.sellable.tax && (
                        <>
                          <FieldRow
                            label="Tax name"
                            value={product.sellable.tax.name}
                          />
                          <FieldRow
                            label="Tax code"
                            value={product.sellable.tax.code}
                          />
                          <FieldRow
                            label="Tax rate type"
                            value={product.sellable.tax.type}
                          />
                          <FieldRow
                            label="Rate"
                            value={`${product.sellable.tax.rate}%`}
                          />
                        </>
                      )}
                      {!product.sellable.tax &&
                        product.sellable.tax_value != null && (
                          <>
                            <FieldRow
                              label="Value type"
                              value={
                                product.sellable.tax_value_type === "percentage"
                                  ? "Percentage"
                                  : "Fixed amount"
                              }
                            />
                            <FieldRow
                              label="Tax value"
                              value={
                                product.sellable.tax_value_type === "percentage"
                                  ? `${product.sellable.tax_value}%`
                                  : formatCurrency(product.sellable.tax_value)
                              }
                            />
                          </>
                        )}
                    </Stack>
                  )}
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card withBorder radius="md" padding="lg">
                  <Text size="sm" fw={600} mb="md">
                    Price breakdown
                  </Text>
                  <Stack gap={0}>
                    <Group justify="space-between" py="xs">
                      <Text size="sm" c="dimmed">
                        Base price
                      </Text>
                      <Text size="sm">{formatCurrency(basePrice)}</Text>
                    </Group>
                    <Divider />
                    {isInclusive && (
                      <>
                        <Group justify="space-between" py="xs">
                          <Text size="sm" c="dimmed">
                            Amount before tax
                          </Text>
                          <Text size="sm">{formatCurrency(preTaxAmount)}</Text>
                        </Group>
                        <Divider />
                      </>
                    )}
                    <Group justify="space-between" py="xs">
                      <Text size="sm" c="dimmed">
                        Tax
                        {isInclusive && " (included in price)"}
                        {product.sellable?.tax_value_type === "percentage" &&
                          product.sellable?.tax_value != null &&
                          ` (${product.sellable.tax_value}%)`}
                      </Text>
                      <Text size="sm">
                        {taxAmount > 0 ? formatCurrency(taxAmount) : "—"}
                      </Text>
                    </Group>
                    <Divider />
                    <Group justify="space-between" py="xs">
                      <Text size="sm" fw={700}>
                        Total
                      </Text>
                      <Text size="sm" fw={700} c="cyan.6">
                        {formatCurrency(totalPrice)}
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </ContentContainer>
  );
}
