import { ActionIcon, Button, Group, Loader, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

const CreateItemPageHeader = ({
  isLoading,
  handleSubmit,
}: {
  isLoading: boolean;
  handleSubmit: () => void;
}) => {
  const router = useRouter();

  return (
    <Group justify="space-between">
      <Group>
        <ActionIcon variant="subtle" size="lg" onClick={() => router.back()}>
          <IconArrowLeft size={20} />
        </ActionIcon>
        <div>
          <Title order={2}>Add New Internal Catalog Item</Title>
          <Text c="dimmed" size="sm">
            Create a new item in the internal procurement catalog
          </Text>
        </div>
      </Group>
      <Group>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          leftSection={
            isLoading ? <Loader size={16} /> : <IconDeviceFloppy size={16} />
          }
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Item"}
        </Button>
      </Group>
    </Group>
  );
};

export default CreateItemPageHeader;
