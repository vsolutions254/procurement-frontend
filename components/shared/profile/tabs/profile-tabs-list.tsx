import { Tabs } from "@mantine/core";
import {
  IconBell,
  IconPackage,
  IconSettings,
  IconShield,
  IconUser,
} from "@tabler/icons-react";
import React from "react";

const ProfileTabsList = () => {
  return (
    <Tabs.List>
      <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
        Profile
      </Tabs.Tab>
      <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
        Settings
      </Tabs.Tab>
      <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
        Notifications
      </Tabs.Tab>
      <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
        Security
      </Tabs.Tab>
      <Tabs.Tab value="recommended" leftSection={<IconPackage size={16} />}>
        Recommended Items
      </Tabs.Tab>
    </Tabs.List>
  );
};

export default ProfileTabsList;
