import { Box, Group, Paper, Text, ThemeIcon } from "@mantine/core";

export default function StatCard({
  icon,
  label,
  value,
  color = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group gap="sm" wrap="nowrap">
        <ThemeIcon size={38} radius="md" variant="light" color={color}>
          {icon}
        </ThemeIcon>
        <Box>
          <Text size="xs" c="dimmed" mb={2}>
            {label}
          </Text>
          <Text size="sm" fw={600} component="div">
            {value}
          </Text>
        </Box>
      </Group>
    </Paper>
  );
}
