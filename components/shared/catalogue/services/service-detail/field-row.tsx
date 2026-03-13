import { Box, Text } from "@mantine/core";

export default function FieldRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Box>
      <Text size="xs" c="dimmed" mb={2}>
        {label}
      </Text>
    <Text size="sm" component="div">
        {value ?? "—"}
      </Text>
    </Box>
  );
}
