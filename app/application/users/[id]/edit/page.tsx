"use client";

import {
  editUser,
  fetchUser,
} from "@/lib/redux/features/merchants/merchantSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

import {
  Card,
  Center,
  Text,
  Group,
  Button,
  Stack,
  Title,
  TextInput,
  Select,
  Grid,
  ActionIcon,
  Checkbox,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const dispatch = useAppDispatch();

  const { user, userLoading, userError } = useAppSelector(
    (state) => state.merchants,
  );

  const [formData, setFormData] = useState<typeof user | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchUser(parseInt(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const roles = [
    { value: "USER", label: "User" },
    { value: "APPROVER", label: "Approver" },
    { value: "PROCUREMENT", label: "Procurement" },
    { value: "FINANCE", label: "Finance" },
    { value: "CATALOGUEADMIN", label: "Catalogue Admin" },
    { value: "SUPPLIER", label: "Supplier" },
  ];

  const handleRoleChange = (roleName: string, checked: boolean) => {
    if (!formData) return;
    if (checked) {
      const newRole: Role = {
        id: Date.now(),
        name: roleName,
        permissions: [],
      };
      setFormData({
        ...formData,
        roles: [...(formData?.roles || []), newRole],
      });
    } else {
      setFormData({
        ...formData,
        roles: (formData?.roles || []).filter((r: Role) => r.name !== roleName),
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: parseInt(id),
        first_name: formData?.first_name || "",
        last_name: formData?.last_name || "",
        email: formData?.email || "",
        phone: formData?.phone || "",
        roles:
          formData?.roles?.map((role: Role) => ({
            id: role.id,
            name: role.name,
            permissions: role.permissions,
          })) || [],
      };
      const result = await dispatch(editUser(payload));
      if (editUser.fulfilled.match(result)) {
        notifications.show({
          title: "Success",
          message: "User Edited Successfully",
          color: "green",
        });
        router.push(`/application/users/${id}`);
      } else {
        const errorMessage =
          (typeof result.payload === "string" ? result.payload : null) ||
          result.error?.message ||
          "Failed to update user";
        notifications.show({
          title: "Error",
          message: errorMessage,
          color: "red",
        });
      }
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to update user";
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading && !formData)
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );

  if (userError) return <div>Error: {userError}</div>;

  if (!formData)
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );

  return (
    <Stack gap="lg">
      <Group>
        <ActionIcon variant="subtle" size="lg" onClick={() => router.back()}>
          <IconArrowLeft size={20} />
        </ActionIcon>
        <div>
          <Title order={2}>Edit User</Title>
          <Text c="dimmed" size="sm">
            Update user information and roles
          </Text>
        </div>
      </Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={4}>User Information</Title>

          <Grid gutter="md">
            <Grid.Col span={6}>
              <TextInput
                label="First Name"
                value={formData?.first_name || ""}
                onChange={(e) =>
                  formData &&
                  setFormData({ ...formData, first_name: e.target.value })
                }
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Last Name"
                value={formData?.last_name || ""}
                onChange={(e) =>
                  formData &&
                  setFormData({ ...formData, last_name: e.target.value })
                }
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Email Address"
                value={formData?.email || ""}
                onChange={(e) =>
                  formData &&
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Phone Number"
                value={formData?.phone || ""}
                onChange={(e) =>
                  formData &&
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Primary Role"
                data={roles}
                value={formData?.roles?.[0]?.name || ""}
                onChange={(value) => {
                  if (value && formData) {
                    const newRole: Role = {
                      id: Date.now(),
                      name: value,
                      permissions: [],
                    };
                    setFormData({ ...formData, roles: [newRole] });
                  }
                }}
                required
              />
            </Grid.Col>
          </Grid>

          <Title order={4} mt="lg">
            Assign Roles
          </Title>
          <Text size="sm" c="dimmed" mb="md">
            Select one or more roles for this user
          </Text>
          <Grid gutter="md">
            {roles.map((role) => (
              <Grid.Col key={role.value} span={6}>
                <Checkbox
                  label={role.label}
                  checked={(formData?.roles || []).some(
                    (r: Role) => r.name === role.value,
                  )}
                  onChange={(e) =>
                    handleRoleChange(role.value, e.currentTarget.checked)
                  }
                />
              </Grid.Col>
            ))}
          </Grid>

          <Group justify="flex-end" mt="xl">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Update User
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
}
