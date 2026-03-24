import { useAppSelector } from "@/lib/redux/hooks";
import {
  Avatar,
  Badge,
  Button,
  Card,
  FileInput,
  Grid,
  Stack,
  Text,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import React, { useState } from "react";

const ProfileAvatar = ({
  uploadLoading,
  handleProfilePicUpload,
}: {
  handleProfilePicUpload: () => void;
  uploadLoading: boolean;
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  return (
    <Grid.Col span={{ base: 12, md: 4 }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="md">
          <Avatar
            size={120}
            radius="xl"
            color="cyan"
            src={
              user?.avatar
                ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/storage/${user.avatar}`
                : null
            }
          >
            {user?.company_name
              ? user.company_name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
              : `${user?.first_name?.[0] || ""}${
                  user?.last_name?.[0] || ""
                }`.toUpperCase()}
          </Avatar>
          <div style={{ textAlign: "center" }}>
            <Text fw={600} size="lg">
              {user?.company_name ||
                `${user?.first_name || ""} ${user?.last_name || ""}`}
            </Text>
            <Badge variant="light" mt="xs">
              {user?.roles?.[0]?.name}
            </Badge>
          </div>
          <FileInput
            placeholder="Select photo"
            leftSection={<IconUpload size={16} />}
            accept="image/*"
            size="xs"
            value={profilePic}
            onChange={setProfilePic}
          />
          {profilePic && (
            <Button
              size="xs"
              onClick={handleProfilePicUpload}
              loading={uploadLoading}
              leftSection={<IconUpload size={14} />}
            >
              Upload Photo
            </Button>
          )}
        </Stack>
      </Card>
    </Grid.Col>
  );
};

export default ProfileAvatar;
