import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { currencies } from "@/lib/utils/constants";
import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import React from "react";

const GeneralSettings = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  return (
    <Tabs.Panel value="general" pt="md">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          General Configuration
        </Title>
        <Stack gap="md">
          <Group grow>
            <TextInput label="Company Name" defaultValue={user?.user_name} />
            <Select
              label="Default Currency"
              data={currencies}
              defaultValue={user?.settings.currency}
            />
          </Group>
          <Group justify="flex-end">
            <Button>Save Changes</Button>
          </Group>
        </Stack>
      </Card>
    </Tabs.Panel>
  );
};

export default GeneralSettings;
