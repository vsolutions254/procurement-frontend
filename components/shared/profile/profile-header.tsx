import { Group, Text, Title } from "@mantine/core";
import React from "react";

const ProfileHeader = () => {
  return (
    <Group justify="space-between">
      <div>
        <Title order={2} mb="xs">
          My Profile
        </Title>
        <Text c="dimmed" size="sm">
          Manage your account settings and preferences
        </Text>
      </div>
    </Group>
  );
};

export default ProfileHeader;
