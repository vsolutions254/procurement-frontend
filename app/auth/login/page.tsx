"use client";

import type React from "react";

import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Anchor,
  Stack,
  Divider,
  Box,
  Center,
  Loader,
} from "@mantine/core";
import { IconBuilding, IconMail, IconLock } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { fetchUser, login } from "@/lib/redux/features/auth/authSlice";
import { notifications } from "@mantine/notifications";
import clientaxiosinstance from "@/lib/services/clientaxiosinstance";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) {
    return (
      <Center
        style={{
          minHeight: "100vh",
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
        }}
      >
        <Loader size="lg" />
      </Center>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageLoading(true);
    try {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      await dispatch(login({ email, password })).unwrap();
      router.push("/");
      setPageLoading(false);
    } catch (error: unknown) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String((error as { message: string }).message);
      }
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
        withCloseButton: true,
        icon: <IconBuilding size={16} />,
        position: "bottom-right",
      });
      setPageLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor:
          "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
      }}
    >
      <Box style={{ position: "absolute", top: 20, right: 20 }}>
        <ThemeToggle />
      </Box>
      <Container size={420} py={80}>
        <Stack gap="lg">
          <div style={{ textAlign: "center" }}>
            <Title c="dimmed" order={1} mb="xs">
              Welcome Back
            </Title>
            <Text c="dimmed" size="sm">
              Sign in to your account
            </Text>
          </div>

          <Paper withBorder shadow="md" p={30} radius="md">
            <form onSubmit={handleLogin}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="john.doe@example.com"
                  leftSection={<IconMail size={16} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  c="dimmed"
                />

                <PasswordInput
                  c="dimmed"
                  label="Password"
                  placeholder="Your password"
                  leftSection={<IconLock size={16} />}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Group justify="space-between">
                  <Anchor
                    component={Link}
                    href="/auth/forgot-password"
                    size="sm"
                  >
                    Forgot password?
                  </Anchor>
                </Group>

                <Button fullWidth type="submit" loading={pageLoading}>
                  Sign In
                </Button>
              </Stack>
            </form>

            <Divider
              label="New to ProcurementHub?"
              labelPosition="center"
              my="lg"
            />

            <Stack gap="sm">
              <Button
                component={Link}
                href="/auth/register"
                variant="light"
                leftSection={<IconBuilding size={16} />}
                fullWidth
              >
                Register Your Company
              </Button>
              <Text size="xs" c="dimmed" ta="center">
                Contact your administrator to get employee access
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </div>
  );
}
