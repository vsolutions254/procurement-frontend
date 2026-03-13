import { ActionIcon, Anchor, Breadcrumbs, Group, Text } from "@mantine/core";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

const BreadCrumbs = ({ service_name }: { service_name: string }) => {
  const router = useRouter();
  return (
    <Group gap={4} align="center">
      <ActionIcon
        variant="subtle"
        size="sm"
        onClick={() => router.back()}
        aria-label="Back"
      >
        <IconArrowLeft size={16} />
      </ActionIcon>
      <Breadcrumbs
        separator={<IconChevronRight size={14} />}
        separatorMargin={4}
      >
        <Anchor
          size="sm"
          c="dimmed"
          onClick={() => router.push("/application/catalogue/internal")}
        >
          Services
        </Anchor>
        <Text size="sm" c="dimmed" lineClamp={1}>
          {service_name}
        </Text>
      </Breadcrumbs>
    </Group>
  );
};

export default BreadCrumbs;
