import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import {
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Tabs,
  Title,
} from "@mantine/core";
import React from "react";

const ApprovalLimitsSettings = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  return (
    <Tabs.Panel value="approvals" pt="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          Approval Limits
        </Title>
        <Stack gap="md">
          <NumberInput
            label="Manager Approval Limit (KES)"
            thousandSeparator=","
          />
          <NumberInput
            label="Director Approval Limit (KES)"
            thousandSeparator=","
          />
          <NumberInput label="CEO Approval Limit (KES)" thousandSeparator="," />
          <Group justify="flex-end">
            <Button>Save Changes</Button>
          </Group>
        </Stack>
      </Card>
    </Tabs.Panel>
  );
};

export default ApprovalLimitsSettings;
