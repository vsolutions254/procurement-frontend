"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { categoryColors } from "@/lib/utils/constants";
import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Card,
  Code,
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
  IconBriefcase,
  IconClipboardList,
  IconFileDescription,
  IconForms,
  IconInfoCircle,
  IconReceipt,
  IconUsers,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { getService } from "@/lib/redux/features/services/servicesSlice";
import {
  computeTax,
  computeTotal,
  formatCurrency,
  taxStatusColor,
  taxStatusLabel,
} from "@/components/shared/catalogue/services/utils/constants";
import BreadCrumbs from "@/components/shared/catalogue/services/service-detail/bread-crumbs";
import HeaderCard from "@/components/shared/catalogue/services/service-detail/header-card";
import StatCards from "@/components/shared/catalogue/services/service-detail/stat-cards";
import FieldRow from "@/components/shared/catalogue/services/service-detail/field-row";
import { getInitials } from "@/lib/utils/helpers";

// ── Custom field type maps ────────────────────────────────────────────────────

const fieldTypeLabel: Record<CustomFieldType, string> = {
  text: "Text",
  textarea: "Long text",
  number: "Number",
  currency: "Currency",
  date: "Date",
  time: "Time",
  datetime: "Date & time",
  select: "Dropdown",
  multiselect: "Multi-select",
  boolean: "Yes / No",
  richtext: "Rich text",
};

const fieldTypeColor: Record<CustomFieldType, string> = {
  text: "blue",
  textarea: "gray",
  number: "violet",
  currency: "green",
  date: "orange",
  time: "orange",
  datetime: "orange",
  select: "cyan",
  multiselect: "teal",
  boolean: "pink",
  richtext: "indigo",
};

// ── Custom field row ──────────────────────────────────────────────────────────

function CustomFieldRow({ field }: { field: CustomField }) {
  const hasOptions = field.type === "select" || field.type === "multiselect";
  const hasMinMax = field.type === "number" || field.type === "currency";

  return (
    <Card withBorder radius="md" padding="md">
      <Group justify="space-between" mb={field.help_text ? 4 : 0} wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <Text size="sm" fw={600}>
            {field.label}
          </Text>
          {field.required && (
            <Badge size="xs" variant="filled" color="red">
              Required
            </Badge>
          )}
        </Group>
        <Badge
          size="xs"
          variant="light"
          color={fieldTypeColor[field.type] ?? "gray"}
        >
          {fieldTypeLabel[field.type] ?? field.type}
        </Badge>
      </Group>

      {field.help_text && (
        <Text size="xs" c="dimmed" mb="xs">
          {field.help_text}
        </Text>
      )}

      {field.placeholder && (
        <Group gap="xs" mt="xs">
          <Text size="xs" c="dimmed">
            Placeholder:
          </Text>
          <Code fz="xs">{field.placeholder}</Code>
        </Group>
      )}

      {field.prefix && (
        <Group gap="xs" mt="xs">
          <Text size="xs" c="dimmed">
            Prefix:
          </Text>
          <Code fz="xs">{field.prefix}</Code>
        </Group>
      )}

      {hasMinMax && (field.min != null || field.max != null) && (
        <Group gap="md" mt="xs">
          {field.min != null && (
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                Min:
              </Text>
              <Code fz="xs">{field.min}</Code>
            </Group>
          )}
          {field.max != null && (
            <Group gap="xs">
              <Text size="xs" c="dimmed">
                Max:
              </Text>
              <Code fz="xs">{field.max}</Code>
            </Group>
          )}
        </Group>
      )}

      {hasOptions && field.options && field.options.length > 0 && (
        <Box mt="xs">
          <Text size="xs" c="dimmed" mb={4}>
            Options:
          </Text>
          <Group gap="xs">
            {field.options.map((opt, i) => (
              <Badge key={i} size="xs" variant="outline" color="gray">
                {opt}
              </Badge>
            ))}
          </Group>
        </Box>
      )}
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.service_id);
  const dispatch = useAppDispatch();

  const { service, serviceLoading, serviceError } = useAppSelector(
    (state) => state.services,
  );

  useEffect(() => {
    dispatch(getService(id));
  }, [dispatch, id]);

  if (serviceLoading) {
    return (
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
    );
  }

  if (!service || serviceError) {
    return (
      <Stack align="center" justify="center" h={300} gap="xs">
        <ThemeIcon size={52} radius="xl" variant="light" color="gray">
          <IconBriefcase size={26} />
        </ThemeIcon>
        <Text fw={600}>Service not found</Text>
        <Text fw={300}>{serviceError ?? "Something Went Wrong"}</Text>
        <Anchor size="sm" onClick={() => router.back()}>
          Go back
        </Anchor>
      </Stack>
    );
  }

  const color = categoryColors[service.category?.name] ?? "blue";
  const taxAmount = computeTax(service);
  const totalPrice = computeTotal(service);
  const primarySupplier = service.sellable.suppliers[0];
  const customFields: CustomField[] = service.category?.custom_fields ?? [];
  const isInclusive = service.sellable.tax_type === "inclusive";
  const basePrice = Number(service.base_price);
  const preTaxAmount = isInclusive ? basePrice - taxAmount : basePrice;

  return (
    <Stack gap="lg" p={{ base: "sm", md: "xl" }}>
      <BreadCrumbs service_name={service.name} />

      <HeaderCard
        category={service.category as unknown as Category}
        color={color}
        service_name={service.name}
        service_id={service.id}
        service_created_at={service.created_at}
        primary_supplier_name={service.sellable.suppliers[0]?.company_name}
        base_price={service.base_price}
        tax_amount={taxAmount}
        total_price={totalPrice}
      />

      <StatCards
        suppliers_count={service.sellable.suppliers.length}
        tax_amount={taxAmount}
        tax_status={service.sellable.tax_status}
        total_price={totalPrice}
      />

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview" variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<IconInfoCircle size={14} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="suppliers" leftSection={<IconUsers size={14} />}>
            Suppliers ({service.sellable.suppliers.length})
          </Tabs.Tab>
          {service.specifications && (
            <Tabs.Tab
              value="specs"
              leftSection={<IconClipboardList size={14} />}
            >
              Specifications
            </Tabs.Tab>
          )}
          {customFields.length > 0 && (
            <Tabs.Tab value="fields" leftSection={<IconForms size={14} />}>
              Custom fields ({customFields.length})
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
              <Card withBorder radius="md" padding="lg" h="100%">
                <Group gap="xs" mb="md">
                  <IconFileDescription size={16} />
                  <Text size="sm" fw={600}>
                    Description
                  </Text>
                </Group>
                <Text
                  size="sm"
                  c={service.description ? "inherit" : "dimmed"}
                  lh={1.7}
                >
                  {service.description ?? "No description provided."}
                </Text>

                {service.service_terms && (
                  <>
                    <Divider my="md" />
                    <Group gap="xs" mb="md">
                      <IconFileDescription size={16} />
                      <Text size="sm" fw={600}>
                        Service terms
                      </Text>
                    </Group>
                    <TypographyStylesProvider>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: service.service_terms,
                        }}
                      />
                    </TypographyStylesProvider>
                  </>
                )}
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder radius="md" padding="lg" h="100%">
                <Text size="sm" fw={600} mb="md">
                  Details
                </Text>
                <Stack gap="md">
                  <FieldRow label="Service ID" value={`#${service.id}`} />
                  <FieldRow
                    label="Category"
                    value={
                      <Badge variant="light" color={color} size="sm">
                        {service.category.name}
                      </Badge>
                    }
                  />
                  <FieldRow
                    label="Created"
                    value={new Date(service.created_at).toLocaleDateString(
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
                    value={new Date(service.updated_at).toLocaleDateString(
                      "en-KE",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  />
                  {primarySupplier && (
                    <FieldRow
                      label="Primary supplier"
                      value={primarySupplier.company_name}
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
            {service.sellable.suppliers.length === 0 ? (
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
                    <Table.Th>
                      <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                        Payment terms
                      </Text>
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {service.sellable.suppliers.map(
                    (supplier: User, index: number) => (
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
                        <Table.Td>
                          {supplier.payment_terms ? (
                            <TypographyStylesProvider>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: supplier.payment_terms,
                                }}
                              />
                            </TypographyStylesProvider>
                          ) : (
                            <Text size="sm" c="dimmed">
                              —
                            </Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ),
                  )}
                </Table.Tbody>
              </Table>
            )}
          </Card>
        </Tabs.Panel>

        {/* ── Specifications ── */}
        {service.specifications && (
          <Tabs.Panel value="specs" pt="md">
            <Card withBorder radius="md" padding={0}>
              <Group gap="xs" m="md">
                <IconFileDescription size={16} />
                <Text size="sm" fw={600}>
                  Specifications
                </Text>
              </Group>
              <TypographyStylesProvider>
                <div
                  style={{ padding: "12px" }}
                  dangerouslySetInnerHTML={{ __html: service.specifications }}
                />
              </TypographyStylesProvider>
            </Card>
          </Tabs.Panel>
        )}

        {/* ── Custom fields ── */}
        {customFields.length > 0 && (
          <Tabs.Panel value="fields" pt="md">
            <Stack gap="sm">
              <Text size="xs" c="dimmed">
                These fields are defined by the{" "}
                <Text span fw={600} c="inherit">
                  {service.category.name}
                </Text>{" "}
                category and apply to all services within it.
              </Text>
              {customFields.map((field) => (
                <CustomFieldRow key={field.id} field={field} />
              ))}
            </Stack>
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
                <Stack gap="md">
                  <FieldRow
                    label="Tax status"
                    value={
                      <Badge
                        variant="light"
                        color={taxStatusColor(service.sellable.tax_status)}
                        size="sm"
                      >
                        {taxStatusLabel(service.sellable.tax_status)}
                      </Badge>
                    }
                  />
                  {service.sellable.tax_type && (
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
                  {service.sellable.tax && (
                    <>
                      <FieldRow
                        label="Tax name"
                        value={service.sellable.tax.name}
                      />
                      <FieldRow
                        label="Tax code"
                        value={service.sellable.tax.code}
                      />
                      <FieldRow
                        label="Tax rate type"
                        value={service.sellable.tax.type}
                      />
                      <FieldRow
                        label="Rate"
                        value={`${service.sellable.tax.rate}%`}
                      />
                    </>
                  )}
                  {!service.sellable.tax &&
                    service.sellable.tax_value != null && (
                      <>
                        <FieldRow
                          label="Value type"
                          value={
                            service.sellable.tax_value_type === "percentage"
                              ? "Percentage"
                              : "Fixed amount"
                          }
                        />
                        <FieldRow
                          label="Tax value"
                          value={
                            service.sellable.tax_value_type === "percentage"
                              ? `${service.sellable.tax_value}%`
                              : formatCurrency(service.sellable.tax_value)
                          }
                        />
                      </>
                    )}
                </Stack>
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
                      {service.sellable.tax_value_type === "percentage" &&
                        service.sellable.tax_value != null &&
                        ` (${service.sellable.tax_value}%)`}
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
  );
}
