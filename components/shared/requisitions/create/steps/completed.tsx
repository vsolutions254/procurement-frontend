import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconCheck, IconPrinter } from "@tabler/icons-react";
import React from "react";

const RequisitionCreated = () => {
  return (
    <Stack align="center" gap="md" py="xl">
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "var(--mantine-color-green-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconCheck size={40} color="white" />
      </div>
      <Title order={3}>Requisition Submitted!</Title>
      <Text c="dimmed" ta="center" maw={500}>
        Your requisition has been submitted successfully and is now pending
        approval from your line manager.
      </Text>
      <Button
        leftSection={<IconPrinter size={18} />}
        variant="light"
        onClick={() => window.print()}
      >
        Print Requisition
      </Button>
      <Group gap="md" mt="md">
        <Button variant="light" component="a" href="/application/requisitions">
          View My Requisitions
        </Button>
        <Button variant="filled" component="a" href="/catalogue">
          Back to Catalogue
        </Button>
      </Group>
    </Stack>
  );
};

export default RequisitionCreated;
