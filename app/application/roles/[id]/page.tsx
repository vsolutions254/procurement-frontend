"use client";

import { use, useEffect, useState } from "react";
import {
  Container,
  Title,
  Paper,
  TextInput,
  Button,
  Group,
  Stack,
  Grid,
  LoadingOverlay,
  Checkbox,
  Tabs,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchPermissions,
  fetchRole,
} from "@/lib/redux/features/merchants/merchantSlice";

export default function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const dispatch = useAppDispatch();
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);

  const { role, roleLoading, permissions, permissionsLoading } = useAppSelector(
    (state) => state.merchants,
  );

  useEffect(() => {
    setMounted(true);
    dispatch(fetchRole(parseInt(id)));
    dispatch(fetchPermissions());
  }, [dispatch, id]);

  if (!mounted || roleLoading || permissionsLoading)
    return <LoadingOverlay visible />;
  if (!role || !role.id) return <div>Role not found</div>;

  const selectedPermissions =
    role.permissions?.map((permission: Permission) => permission.id) || [];

  return (
    <Container size="lg">
      <Group mb="xl">
        <Button
          component={Link}
          href="/application/roles"
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
        >
          Back to Roles
        </Button>
      </Group>

      <Stack gap="lg">
        <Paper p="md">
          <Title order={4} mb="md">
            Basic Information
          </Title>
          <Grid>
            <Grid.Col span={6}>
              <TextInput label="Role Name" value={role?.name || ""} disabled />
            </Grid.Col>
          </Grid>
        </Paper>

        <Paper p="md">
          <Group justify="space-between" mb="md">
            <Title order={4}>Permissions</Title>
          </Group>

          <Tabs defaultValue={Object.keys(permissions)[0]}>
            <Tabs.List>
              {Object.keys(permissions).map((groupName) => (
                <Tabs.Tab key={groupName} value={groupName}>
                  {groupName}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {Object.entries(permissions).map(
              ([groupName, groupPermissions]) => (
                <Tabs.Panel key={groupName} value={groupName} pt="md">
                  <Grid>
                    {groupPermissions.map((permission) => (
                      <Grid.Col span={4} key={permission.id}>
                        <Checkbox
                          label={permission.name}
                          value={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          readOnly
                        />
                      </Grid.Col>
                    ))}
                  </Grid>
                </Tabs.Panel>
              ),
            )}
          </Tabs>
        </Paper>
      </Stack>
    </Container>
  );
}
