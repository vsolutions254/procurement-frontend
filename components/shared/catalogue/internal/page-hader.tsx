import { Button, Group, Menu, Text, Title } from "@mantine/core";
import {
  IconChevronDown,
  IconPackage,
  IconPlane,
  IconPlus,
} from "@tabler/icons-react";
import React from "react";

const InternalCatalogPageHeader = () => {
  return (
    <Group justify="space-between">
      <div>
        <Title order={2} mb="xs">
          Internal Catalog
        </Title>
        <Text c="dimmed" size="sm">
          Browse and manage internal procurement catalog items
        </Text>
      </div>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button
            leftSection={<IconPlus size={16} />}
            rightSection={<IconChevronDown size={16} />}
          >
            Add New Item
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconPackage size={16} />}
            component="a"
            href="/application/catalogue/internal/new?type=inventory"
          >
            Inventory Item
          </Menu.Item>
          <Menu.Item
            leftSection={<IconPlane size={16} />}
            component="a"
            href="/application/catalogue/internal/new?type=service"
          >
            Service
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

export default InternalCatalogPageHeader;
