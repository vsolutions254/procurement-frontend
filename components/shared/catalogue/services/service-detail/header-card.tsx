import { categoryIcons } from "@/lib/utils/component-constants";
import { Badge, Box, Card, Group, Text, ThemeIcon } from "@mantine/core";
import { IconBriefcase } from "@tabler/icons-react";
import React from "react";
import { formatCurrency } from "../utils/constants";

const HeaderCard = ({
  category,
  color,
  service_name,
  service_id,
  service_created_at,
  primary_supplier_name,
  base_price,
  tax_amount,
  total_price,
}: {
  category: Category;
  color: string;
  service_name: string;
  service_created_at: string;
  primary_supplier_name: string;
  service_id: number;
  base_price: number;
  tax_amount: number;
  total_price: number;
}) => {
  return (
    <Card withBorder radius="md" padding="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
        <Group gap="md" align="flex-start" wrap="nowrap">
          <ThemeIcon size={52} radius="md" variant="light" color={color}>
            {categoryIcons[category.name as any] ?? <IconBriefcase size={26} />}
          </ThemeIcon>
          <Box>
            <Group gap="xs" mb={4} wrap="wrap">
              <Text size="xl" fw={700} lh={1.2}>
                {service_name}
              </Text>
              <Badge variant="light" color={color} size="sm">
                {category.name}
              </Badge>
            </Group>
            <Group gap="xs" wrap="wrap">
              <Text size="xs" c="dimmed">
                #{service_id}
              </Text>
              <Text size="xs" c="dimmed">
                ·
              </Text>
              <Text size="xs" c="dimmed">
                Added{" "}
                {new Date(service_created_at).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
              {primary_supplier_name && (
                <>
                  <Text size="xs" c="dimmed">
                    ·
                  </Text>
                  <Text size="xs" c="dimmed">
                    Primary: {primary_supplier_name}
                  </Text>
                </>
              )}
            </Group>
          </Box>
        </Group>

        <Box ta={{ base: "left", sm: "right" }}>
          <Text size="xs" c="dimmed" mb={2}>
            Base price
          </Text>
          <Text size="xl" fw={700} c="cyan.6">
            {formatCurrency(base_price)}
          </Text>
          {tax_amount > 0 && (
            <Text size="xs" c="dimmed">
              + {formatCurrency(tax_amount)} tax → {formatCurrency(total_price)}{" "}
              total
            </Text>
          )}
        </Box>
      </Group>
    </Card>
  );
};

export default HeaderCard;
