import { useAppSelector } from "@/lib/redux/hooks";
import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Select,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconBuilding,
  IconCalendar,
  IconEdit,
  IconMail,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import React, { Dispatch, SetStateAction } from "react";
import ProfileAvatar from "./profile-avatar";

const ProfileTab = ({
  handleProfilePicUpload,
  uploadLoading,
  editMode,
  setEditMode,
  editUser,
  setEditUser,
  handleEdit,
  editLoading,
}: {
  handleProfilePicUpload: () => void;
  uploadLoading: boolean;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  editUser: User | null;
  setEditUser: Dispatch<SetStateAction<User | null>>;
  handleEdit: (e: React.FormEvent) => void;
  editLoading: boolean;
}) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Tabs.Panel value="profile" pt="md">
      <Grid gutter="lg">
        <ProfileAvatar
          uploadLoading={uploadLoading}
          handleProfilePicUpload={handleProfilePicUpload}
        />

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Personal Information</Title>
              <ActionIcon
                variant="subtle"
                onClick={() => setEditMode(!editMode)}
              >
                <IconEdit size={16} />
              </ActionIcon>
            </Group>

            <form onSubmit={handleEdit}>
              <Grid gutter="md">
                {user?.roles?.[0]?.name !== "MERCHANT" && (
                  <>
                    <Grid.Col span={6}>
                      <TextInput
                        label="First Name"
                        value={editUser?.first_name || ""}
                        onChange={(e) =>
                          setEditUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  first_name: e.target.value,
                                }
                              : null,
                          )
                        }
                        disabled={!editMode}
                        leftSection={<IconUser size={16} />}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Last Name"
                        value={editUser?.last_name || ""}
                        onChange={(e) =>
                          setEditUser((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  last_name: e.target.value,
                                }
                              : null,
                          )
                        }
                        disabled={!editMode}
                      />
                    </Grid.Col>
                  </>
                )}
                <Grid.Col span={6}>
                  <TextInput
                    label="Email"
                    value={editUser?.email || ""}
                    onChange={(e) =>
                      setEditUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              email: e.target.value,
                            }
                          : null,
                      )
                    }
                    disabled={!editMode}
                    leftSection={<IconMail size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Phone"
                    value={editUser?.phone || ""}
                    onChange={(e) =>
                      setEditUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              phone: e.target.value,
                            }
                          : null,
                      )
                    }
                    disabled={!editMode}
                    leftSection={<IconPhone size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Role"
                    value={user?.roles?.[0]?.name || ""}
                    data={[
                      "MERCHANT",
                      "SUPPLIER",
                      "CATALOGUEADMIN",
                      "FINANCE",
                      "PRODUREMENT",
                      "APPROVER",
                      "USER",
                    ]}
                    disabled
                    leftSection={<IconBuilding size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Location"
                    value={editUser?.address || ""}
                    onChange={(e) =>
                      setEditUser((prev) =>
                        prev
                          ? {
                              ...prev,
                              address: e.target.value,
                            }
                          : null,
                      )
                    }
                    disabled={!editMode}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Employee ID"
                    value={user?.user_code || ""}
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Join Date"
                    value={
                      user?.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : ""
                    }
                    disabled
                    leftSection={<IconCalendar size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="User Name"
                    value={user?.user_name || ""}
                    disabled
                    leftSection={<IconUser size={16} />}
                  />
                </Grid.Col>
              </Grid>

              {editMode && (
                <Group justify="flex-end" mt="md">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditMode(false);
                      setEditUser({ ...user! });
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={editLoading}>
                    Save Changes
                  </Button>
                </Group>
              )}
            </form>
          </Card>
        </Grid.Col>
      </Grid>
    </Tabs.Panel>
  );
};

export default ProfileTab;
