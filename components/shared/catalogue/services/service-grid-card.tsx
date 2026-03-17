import { categoryIcons } from "@/lib/utils/component-constants";
import { categoryColors } from "@/lib/utils/constants";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconBriefcase,
  IconEye,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react";

export default function ServiceGridCard({
  service,
  onView,
  onAddToCart,
  loading,
}: {
  service: Service;
  onView: (id: number) => void;
  onAddToCart?: (service: Service) => void;
  loading?: boolean;
}) {
  const color = categoryColors[service.category.name] ?? "gray";
  const icon = categoryIcons[service.category.name] ?? (
    <IconBriefcase size={16} />
  );

  return (
    <Card
      shadow="xs"
      radius="md"
      withBorder
      padding="lg"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "box-shadow 0.18s ease, transform 0.18s ease",
      }}
    >
      {/* Top row */}
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <ThemeIcon
          size={40}
          radius="md"
          variant="light"
          color={color}
          style={{ flexShrink: 0 }}
        >
          {icon}
        </ThemeIcon>
      </Group>

      {/* Name & ID */}
      <Box>
        <Text fw={600} size="sm" lineClamp={2} lh={1.4}>
          {service.name}
        </Text>
        <Text size="xs" c="dimmed" mt={2}>
          {service.id}
        </Text>
      </Box>

      <Divider />

      {/* Meta */}
      <Stack gap={6}>
        <Group gap={6}>
          <Badge variant="dot" color={color} size="xs">
            {service.category.name}
          </Badge>
        </Group>
        <Group gap={4}>
          <IconUser size={12} color="var(--mantine-color-dimmed)" />
          <Text size="xs" c="dimmed" lineClamp={1}>
            {service.sellable.suppliers[0].company_name}
          </Text>
        </Group>
      </Stack>

      {/* Footer */}
      <Group justify="space-between" align="center" mt="auto">
        <Text fw={700} size="md" c="cyan.6">
          {service.base_price}
        </Text>
        <Group gap="xs">
          <Tooltip label="View details" withArrow>
            <ActionIcon
              variant="light"
              color="blue"
              radius="md"
              onClick={() => onView(service.id)}
            >
              <IconEye size={15} />
            </ActionIcon>
          </Tooltip>
          {onAddToCart && (
            <Tooltip label="Add to cart" withArrow>
              <ActionIcon
                variant="filled"
                color="green"
                radius="md"
                loading={loading}
                onClick={() => onAddToCart(service)}
              >
                <IconShoppingCart size={15} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>
    </Card>
  );
}
