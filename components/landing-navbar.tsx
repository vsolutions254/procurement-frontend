"use client";

import {
  Group,
  Text,
  UnstyledButton,
  Avatar,
  Menu,
  rem,
  Button,
  CheckIcon,
  Burger,
  Drawer,
  Stack,
} from "@mantine/core";
import {
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconHelp,
  IconBell,
} from "@tabler/icons-react";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { fetchUser, logout } from "@/lib/redux/features/auth/authSlice";
import { getInitials } from "@/lib/utils/helpers";

import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export function LandingNavbar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user } = useAppSelector((state: RootState) => state.auth) as {
    user: User | null;
    loading: boolean;
  };

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      notifications.show({
        title: "Success",
        message: "Logged out Successfully",
        color: "green",
        autoClose: 5000,
        withCloseButton: true,
        icon: <CheckIcon size={16} />,
        position: "bottom-right",
      });
      router.push("/auth/login");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
        withCloseButton: true,
        icon: <CheckIcon size={16} />,
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      <Group
        h={60}
        px="md"
        justify="space-between"
        style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
      >
        <Group></Group>

        {/* Desktop Navigation */}
        <Group gap="md" visibleFrom="sm">
          <ThemeToggle />

          {user ? (
            <>
              <UnstyledButton>
                <IconHelp size={20} stroke={1.5} />
              </UnstyledButton>
              <UnstyledButton>
                <IconBell size={20} stroke={1.5} />
              </UnstyledButton>

              <Menu shadow="md" width={260}>
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap={7}>
                      <Avatar size={32} radius="xl" color="cyan">
                        {getInitials(
                          user.company_name ??
                            (user.first_name || "") + (user.last_name || ""),
                        )}
                      </Avatar>
                      <IconChevronDown size={16} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <Text size="xs" c="dimmed" fw={400}>
                      {user.email}
                    </Text>
                  </Menu.Label>
                  <Menu.Divider />

                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item
                    component={Link}
                    href="/application/profile"
                    leftSection={
                      <IconUser style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    href="/application/master-settings"
                    leftSection={
                      <IconSettings
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={
                      <IconLogout style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={handleLogout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          ) : (
            <Group gap="sm">
              <Button component={Link} href="/auth/login" variant="subtle">
                Login
              </Button>
              <Button component={Link} href="/auth/register">
                Sign Up
              </Button>
            </Group>
          )}
        </Group>

        {/* Mobile Burger */}
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </Group>

      {/* Mobile Drawer */}
      <Drawer opened={opened} onClose={close} position="right" size="xs">
        <Stack gap="md" p="md">
          <ThemeToggle />

          {user ? (
            <>
              <Group>
                <Avatar size={32} radius="xl" color="cyan">
                  {getInitials(
                    user.company_name ??
                      (user.first_name || "") + (user.last_name || ""),
                  )}
                </Avatar>
                <Text size="sm">{user.email}</Text>
              </Group>

              <Button
                component={Link}
                href="/application/profile"
                variant="subtle"
                leftSection={<IconUser size={16} />}
                onClick={close}
              >
                Profile
              </Button>

              <Button
                component={Link}
                href="/application/master-settings"
                variant="subtle"
                leftSection={<IconSettings size={16} />}
                onClick={close}
              >
                Settings
              </Button>

              <Button
                variant="subtle"
                leftSection={<IconHelp size={16} />}
                onClick={close}
              >
                Help
              </Button>

              <Button
                variant="subtle"
                leftSection={<IconBell size={16} />}
                onClick={close}
              >
                Notifications
              </Button>

              <Button
                color="red"
                variant="subtle"
                leftSection={<IconLogout size={16} />}
                onClick={() => {
                  handleLogout();
                  close();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                href="/auth/login"
                variant="subtle"
                onClick={close}
              >
                Login
              </Button>
              <Button component={Link} href="/auth/register" onClick={close}>
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </>
  );
}
