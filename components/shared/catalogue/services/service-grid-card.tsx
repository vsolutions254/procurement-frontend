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
import { IconBriefcase, IconEye, IconUser } from "@tabler/icons-react";

export default function ServiceGridCard({
  service,
  onView,
}: {
  service: Service;
  onView: (id: number) => void;
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
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 6px 24px rgba(0,0,0,0.10)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        (e.currentTarget as HTMLDivElement).style.transform = "";
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
            {service.sellable.suppliers[0].name}
          </Text>
        </Group>
      </Stack>

      {/* Footer */}
      <Group justify="space-between" align="center" mt="auto">
        <Text fw={700} size="md" c="cyan.6">
          {service.base_price}
        </Text>
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
      </Group>
    </Card>
  );
}
