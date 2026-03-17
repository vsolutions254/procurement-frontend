import { Group, Paper, Skeleton, Stack } from "@mantine/core";
import React from "react";

const ServiceViewSkeleton = () => {
  return (
    <Paper p="md" withBorder>
      <Stack gap="xs">
        <div>
          <Skeleton height={14} width="45%" mb={6} />
          <Skeleton height={11} width="30%" mb={4} />
          <Skeleton height={11} width="35%" />
        </div>

        <Group justify="space-between" align="flex-end" mt={4}>
          <Group gap="md">
            {["Quantity", "Unit Price", "Total"].map((label) => (
              <div key={label}>
                <Skeleton height={10} width={55} mb={6} />
                <Skeleton height={14} width={70} />
              </div>
            ))}
          </Group>
          <Skeleton width={32} height={32} radius="sm" />
        </Group>
      </Stack>
    </Paper>
  );
};

export default ServiceViewSkeleton;
