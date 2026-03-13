"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { categoryColors } from "@/lib/utils/constants";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconEye,
  IconGrid3x3,
  IconList,
  IconBriefcase,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ServiceGridCard from "./service-grid-card";
import { categoryIcons } from "@/lib/utils/component-constants";

interface ServicesViewProps {
  onView?: (id: number) => void;
}

function getSupplierName(supplier: any): string {
  return (
    supplier?.supplier_trading_name ||
    supplier?.company_name ||
    (supplier?.first_name && supplier?.last_name
      ? `${supplier.first_name} ${supplier.last_name}`
      : null) ||
    "No supplier"
  );
}

function taxStatusColor(status: string) {
  if (status === "taxable") return "green";
  if (status === "exempt") return "orange";
  if (status === "zero_rated") return "blue";
  return "gray";
}

function taxStatusLabel(status: string) {
  if (!status) return "No status";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const ServicesView = ({ onView }: ServicesViewProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const { services } = useAppSelector((state) => state.services);

  const handleView = (id: number) => {
    if (onView) {
      onView(id);
    } else {
      router.push(`/application/catalogue/services/${id}`);
    }
  };

  return (
    <Grid.Col span={{ base: 12, md: 9 }}>
      <Stack gap="md">
        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Text size="sm" c="dimmed">
            {services.length} service{services.length !== 1 ? "s" : ""}
          </Text>
          <Group gap={4}>
            <Button
              variant={viewMode === "grid" ? "filled" : "subtle"}
              size="xs"
              leftSection={<IconGrid3x3 size={14} />}
              onClick={() => setViewMode("grid")}
              radius="md"
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "filled" : "subtle"}
              size="xs"
              leftSection={<IconList size={14} />}
              onClick={() => setViewMode("list")}
              radius="md"
            >
              List
            </Button>
          </Group>
        </Group>

        {/* ── Grid View ── */}
        {viewMode === "grid" && (
          <>
            {services.length === 0 ? (
              <EmptyState />
            ) : (
              <Grid gutter="md">
                {services.map((service) => (
                  <Grid.Col key={service.id} span={{ base: 12, sm: 6, lg: 4 }}>
                    <ServiceGridCard service={service} onView={handleView} />
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* ── List / Table View ── */}
        {viewMode === "list" && (
          <Card shadow="xs" radius="md" withBorder padding={0}>
            {services.length === 0 ? (
              <Box p="xl">
                <EmptyState />
              </Box>
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
                        Service
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                        Category
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                        Supplier
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                        Price
                      </Text>
                    </Table.Th>
                    <Table.Th>
                      <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                        Tax
                      </Text>
                    </Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {services.map((service) => {
                    const color =
                      categoryColors[service.category?.name] ?? "gray";
                    const primarySupplier = service.sellable?.suppliers?.[0];
                    const taxStatus = service.sellable?.tax_status;
                    // tax rate comes from the eager-loaded Tax model, or falls
                    // back to the inline tax_value on the Sellable pivot
                    const taxRate =
                      service.sellable?.tax?.rate ??
                      service.sellable?.tax_value;

                    return (
                      <Table.Tr key={service.id}>
                        {/* Service */}
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            <ThemeIcon
                              size={32}
                              radius="md"
                              variant="light"
                              color={color}
                              style={{ flexShrink: 0 }}
                            >
                              {categoryIcons[service.category?.name] ?? (
                                <IconBriefcase size={15} />
                              )}
                            </ThemeIcon>
                            <Box>
                              <Text size="sm" fw={600} lineClamp={1}>
                                {service.name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                #{service.id}
                              </Text>
                            </Box>
                          </Group>
                        </Table.Td>

                        {/* Category */}
                        <Table.Td>
                          {service.category?.name ? (
                            <Badge variant="light" color={color} size="sm">
                              {service.category.name}
                            </Badge>
                          ) : (
                            <Text size="xs" c="dimmed" fs="italic">
                              No category
                            </Text>
                          )}
                        </Table.Td>

                        {/* Supplier */}
                        <Table.Td>
                          {primarySupplier ? (
                            <Text size="sm" c="dimmed" lineClamp={1}>
                              {getSupplierName(primarySupplier)}
                            </Text>
                          ) : (
                            <Text size="xs" c="dimmed" fs="italic">
                              No supplier
                            </Text>
                          )}
                        </Table.Td>

                        {/* Price */}
                        <Table.Td>
                          {service.base_price != null ? (
                            <Text size="sm" fw={700} c="cyan.6">
                              {Number(service.base_price).toLocaleString(
                                "en-KE",
                                { minimumFractionDigits: 2 },
                              )}
                            </Text>
                          ) : (
                            <Text size="xs" c="dimmed" fs="italic">
                              No price
                            </Text>
                          )}
                        </Table.Td>

                        {/* Tax */}
                        <Table.Td>
                          {taxStatus ? (
                            <Stack gap={2}>
                              <Badge
                                variant="light"
                                color={taxStatusColor(taxStatus)}
                                size="xs"
                              >
                                {taxStatusLabel(taxStatus)}
                              </Badge>
                              {taxRate != null ? (
                                <Text size="xs" c="dimmed">
                                  {service.sellable?.tax_value_type === "fixed"
                                    ? `KES ${taxRate}`
                                    : `${taxRate}%`}
                                </Text>
                              ) : (
                                <Text size="xs" c="dimmed" fs="italic">
                                  No tax rate
                                </Text>
                              )}
                            </Stack>
                          ) : (
                            <Text size="xs" c="dimmed" fs="italic">
                              No tax info
                            </Text>
                          )}
                        </Table.Td>

                        {/* Actions */}
                        <Table.Td>
                          <Tooltip label="View details" withArrow>
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={() => handleView(service.id)}
                            >
                              <IconEye size={15} />
                            </ActionIcon>
                          </Tooltip>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        )}
      </Stack>
    </Grid.Col>
  );
};

function EmptyState() {
  return (
    <Stack align="center" py="xl" gap="xs">
      <ThemeIcon size={48} radius="xl" variant="light" color="gray">
        <IconBriefcase size={24} />
      </ThemeIcon>
      <Text fw={600} size="sm">
        No services found
      </Text>
      <Text size="xs" c="dimmed">
        Try adjusting your search or filters
      </Text>
    </Stack>
  );
}

export default ServicesView;
