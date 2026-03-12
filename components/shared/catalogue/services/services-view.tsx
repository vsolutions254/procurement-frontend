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
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconEye,
  IconGrid3x3,
  IconList,
  IconSearch,
  IconBriefcase,
} from "@tabler/icons-react";
import React, { useState } from "react";
import ServiceGridCard from "./service-grid-card";
import { categoryIcons } from "@/lib/utils/component-constants";

interface ServicesViewProps {
  onView?: (id: number) => void;
}

const ServicesView = ({ onView }: ServicesViewProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const { services } = useAppSelector((state) => state.services);

  const handleView = (id: number) => {
    onView?.(id);
  };

  return (
    <Grid.Col span={{ base: 12, md: 9 }}>
      <Stack gap="md">
        {/* ── Toolbar ── */}
        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Group gap="sm" style={{ flex: 1, minWidth: 200 }}>
            <TextInput
              placeholder="Search services..."
              leftSection={<IconSearch size={15} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              radius="md"
              size="sm"
              style={{ flex: 1 }}
            />
            <Select
              placeholder="All categories"
              data={[
                "All",
                "Travel",
                "Transport",
                "Professional Services",
                "Consulting",
              ]}
              value={category}
              onChange={setCategory}
              clearable
              radius="md"
              size="sm"
              w={180}
            />
          </Group>

          <Group gap={4}>
            <Text size="sm" c="dimmed" mr={4}>
              {services.length} service{services.length !== 1 ? "s" : ""}
            </Text>
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
                        Status
                      </Text>
                    </Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {services.map((service) => {
                    const color = categoryColors[service.category] ?? "gray";
                    return (
                      <Table.Tr key={service.id}>
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            <ThemeIcon
                              size={32}
                              radius="md"
                              variant="light"
                              color={color}
                              style={{ flexShrink: 0 }}
                            >
                              {categoryIcons[service.category] ?? (
                                <IconBriefcase size={15} />
                              )}
                            </ThemeIcon>
                            <Box>
                              <Text size="sm" fw={600} lineClamp={1}>
                                {service.name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {service.id}
                              </Text>
                            </Box>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant="light" color={color} size="sm">
                            {service.category.name}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">
                            {service.sellable.suppliers[0].name}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={700} c="cyan.6">
                            {service.base_price}
                          </Text>
                        </Table.Td>
                        <Table.Td></Table.Td>
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
