"use client";

import { ContentContainer } from "@/components/layout/content-container";
import { editUserReq, fetchUser } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";

import {
  Card,
  Text,
  Group,
  Button,
  Stack,
  Title,
  TextInput,
  Select,
  Grid,
  Badge,
  Divider,
  ActionIcon,
  Tabs,
  Switch,
} from "@mantine/core";
import { DocumentViewerModal } from "@/components/shared/document-viewer-modal";
import { DocumentEditDropzone } from "@/components/shared/document-edit-dropzone";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { notifications } from "@mantine/notifications";
import {
  IconSettings,
  IconBell,
  IconEdit,
  IconBuilding,
  IconMail,
  IconPhone,
  IconWorld,
  IconFileText,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AppSettings } from "@/types/app-settings";
import clientaxiosinstance from "@/lib/services/clientaxiosinstance";

export default function SupplierProfilePage() {
  const [activeTab, setActiveTab] = useState<string | null>("profile");
  const [settings, setSettings] = useState<AppSettings>({});

  const [editModes, setEditModes] = useState({
    profile: false,
    business: false,
    settings: false,
    notifications: false,
    documents: false,
  });

  const [userData, setUserData] = useState<User | null>(null);
  const [documentModal, setDocumentModal] = useState({
    open: false,
    url: "",
    title: "",
  });
  const [editingDocument, setEditingDocument] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const paymentTermsEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: editModes.business,
    immediatelyRender: false,
  });

  const toggleEditMode = (tab: string) => {
    setEditModes((prev) => ({
      ...prev,
      [tab]: !prev[tab as keyof typeof prev],
    }));
  };

  useEffect(() => {
    dispatch(fetchUser());
    const fetchSettings = async () => {
      await clientaxiosinstance.get("/sanctum/csrf-cookie");
      const response = await clientaxiosinstance.get("/api/settings");
      const settings = response.data;
      setSettings(settings);
    };
    fetchSettings().catch(() => {
      notifications.show({
        title: "Error",
        message: "Failed to load settings",
        color: "red",
      });
    });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  useEffect(() => {
    if (paymentTermsEditor) {
      paymentTermsEditor.setEditable(editModes.business);
    }
  }, [editModes.business, paymentTermsEditor]);

  useEffect(() => {
    if (paymentTermsEditor && user?.payment_terms) {
      paymentTermsEditor.commands.setContent(user.payment_terms);
    }
  }, [paymentTermsEditor, user?.payment_terms]);

  const handleSupplierUpdate = async (tab: string) => {
    if (!userData) return;
    try {
      const updatedData = { ...userData };
      if (tab === "business" && paymentTermsEditor) {
        updatedData.payment_terms = paymentTermsEditor.getHTML();
      }
      await dispatch(editUserReq(updatedData)).unwrap();
      toggleEditMode(tab);
      notifications.show({
        title: "Success",
        message: "Profile updated successfully",
        color: "green",
      });
    } catch (error: unknown) {
      let errorMessage = "Failed to update profile";
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
        position: "bottom-right",
      });
    }
  };

  return (
    <ContentContainer>
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={2} mb="xs">
              Supplier Profile
            </Title>
            <Text c="dimmed" size="sm">
              Manage your company profile and business information
            </Text>
          </div>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="profile" leftSection={<IconBuilding size={16} />}>
              Company Profile
            </Tabs.Tab>
            <Tabs.Tab value="business" leftSection={<IconFileText size={16} />}>
              Business Details
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
              Settings
            </Tabs.Tab>
            <Tabs.Tab
              value="notifications"
              leftSection={<IconBell size={16} />}
            >
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="documents" leftSection={<IconBell size={16} />}>
              Documents
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={4}>Company Information</Title>
                <ActionIcon
                  variant="subtle"
                  onClick={() => toggleEditMode("profile")}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Group>

              <Grid gutter="md">
                <Grid.Col span={6}>
                  <TextInput
                    label="Company Name"
                    value={userData?.company_name || ""}
                    onChange={(e) => {
                      if (userData) {
                        setUserData({
                          ...userData,
                          company_name: e.target.value,
                        });
                      }
                    }}
                    disabled={!editModes.profile}
                    leftSection={<IconBuilding size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Supplier Trading Name"
                    value={userData?.supplier_trading_name || ""}
                    onChange={(e) => {
                      if (userData) {
                        setUserData({
                          ...userData,
                          supplier_trading_name: e.target.value,
                        });
                      }
                    }}
                    disabled={!editModes.profile}
                    leftSection={<IconBuilding size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Email"
                    value={userData?.email || ""}
                    onChange={(e) => {
                      if (userData) {
                        setUserData({
                          ...userData,
                          email: e.target.value,
                        });
                      }
                    }}
                    disabled={!editModes.profile}
                    leftSection={<IconMail size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Phone"
                    value={userData?.phone || ""}
                    onChange={(e) => {
                      if (userData) {
                        setUserData({
                          ...userData,
                          phone: e.target.value,
                        });
                      }
                    }}
                    disabled={!editModes.profile}
                    leftSection={<IconPhone size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Website"
                    value={userData?.company_website || ""}
                    onChange={(e) => {
                      if (userData) {
                        setUserData({
                          ...userData,
                          company_website: e.target.value,
                        });
                      }
                    }}
                    disabled={!editModes.profile}
                    leftSection={<IconWorld size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    label="Address"
                    value={userData?.address || ""}
                    onChange={(e) => {
                      if (userData) {
                        setUserData({
                          ...userData,
                          address: e.target.value,
                        });
                      }
                    }}
                    disabled={!editModes.profile}
                  />
                </Grid.Col>
              </Grid>

              {editModes.profile && (
                <Group justify="flex-end" mt="md">
                  <Button
                    variant="outline"
                    onClick={() => toggleEditMode("profile")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleSupplierUpdate("profile")}>
                    Save Changes
                  </Button>
                </Group>
              )}
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="business" pt="md">
            <Grid gutter="lg">
              <Grid.Col span={12}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="md">
                    <Title order={4}>Legal Information</Title>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => toggleEditMode("business")}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Group>
                  <Grid gutter="md">
                    <Grid.Col span={6}>
                      <TextInput
                        label="Tax ID"
                        value={userData?.kra_pin || ""}
                        onChange={(e) => {
                          if (userData) {
                            setUserData({
                              ...userData,
                              kra_pin: e.target.value,
                            });
                          }
                        }}
                        disabled={!editModes.business}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Registration Number"
                        value={userData?.company_registration_no || ""}
                        disabled={!editModes.business}
                        onChange={(e) => {
                          if (userData) {
                            setUserData({
                              ...userData,
                              company_registration_no: e.target.value,
                            });
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Established Year"
                        value={userData?.company_registration_year || ""}
                        disabled={!editModes.business}
                        onChange={(e) => {
                          if (userData) {
                            setUserData({
                              ...userData,
                              company_registration_year: e.target.value,
                            });
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Bank Name"
                        value={userData?.bank_name || ""}
                        disabled={!editModes.business}
                        onChange={(e) => {
                          if (userData) {
                            setUserData({
                              ...userData,
                              bank_name: e.target.value,
                            });
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Bank Account Number"
                        value={userData?.bank_account_number || ""}
                        disabled={!editModes.business}
                        onChange={(e) => {
                          if (userData) {
                            setUserData({
                              ...userData,
                              bank_account_number: e.target.value,
                            });
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="SWIFT Code"
                        value={userData?.swift_code || ""}
                        disabled={!editModes.business}
                        onChange={(e) => {
                          if (userData) {
                            setUserData({
                              ...userData,
                              swift_code: e.target.value,
                            });
                          }
                        }}
                      />
                    </Grid.Col>
                  </Grid>
                </Card>
              </Grid.Col>

              <Grid.Col span={12}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={4} mb="md">
                    Terms & Conditions
                  </Title>
                  <Grid gutter="md">
                    <Grid.Col span={12}>
                      <Text size="sm" fw={500} mb="xs">
                        Payment Terms
                      </Text>
                      <RichTextEditor editor={paymentTermsEditor}>
                        <RichTextEditor.Toolbar>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                          </RichTextEditor.ControlsGroup>
                          <RichTextEditor.ControlsGroup>
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                          </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                        <RichTextEditor.Content />
                      </RichTextEditor>
                    </Grid.Col>
                  </Grid>
                </Card>
              </Grid.Col>
            </Grid>
            {editModes.business && (
              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => toggleEditMode("business")}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleSupplierUpdate("business")}>
                  Save Changes
                </Button>
              </Group>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={4}>Account Settings</Title>
                <ActionIcon
                  variant="subtle"
                  onClick={() => toggleEditMode("settings")}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Group>
              <Stack gap="md">
                <Select
                  label="Default Currency"
                  value={userData?.settings.currency || ""}
                  data={settings.currencies || []}
                  disabled={!editModes.settings}
                  onChange={(value) => {
                    if (userData && value) {
                      setUserData({
                        ...userData,
                        settings: {
                          ...userData.settings,
                          currency: value,
                        },
                      });
                    }
                  }}
                />
                <Select
                  label="Timezone"
                  value={userData?.settings.timezone || ""}
                  data={settings?.timezones || []}
                  disabled={!editModes.settings}
                  onChange={(value) => {
                    if (userData && value) {
                      setUserData({
                        ...userData,
                        settings: {
                          ...userData.settings,
                          timezone: value,
                        },
                      });
                    }
                  }}
                />
                <Select
                  label="Language"
                  value={userData?.settings.language || ""}
                  data={settings.languages || []}
                  disabled={!editModes.settings}
                  onChange={(value) => {
                    if (userData && value) {
                      setUserData({
                        ...userData,
                        settings: {
                          ...userData.settings,
                          language: value,
                        },
                      });
                    }
                  }}
                />
              </Stack>
              {editModes.settings && (
                <Group justify="flex-end" mt="md">
                  <Button
                    variant="outline"
                    onClick={() => toggleEditMode("settings")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleSupplierUpdate("settings")}>
                    Save Changes
                  </Button>
                </Group>
              )}
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="notifications" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={4}>Notification Preferences</Title>
                <ActionIcon
                  variant="subtle"
                  onClick={() => toggleEditMode("notifications")}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Configure how you want to receive notifications
              </Text>
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      New RFQ Notifications
                    </Text>
                    <Text size="xs" c="dimmed">
                      Get notified when new RFQs are available
                    </Text>
                  </div>
                  {editModes.notifications ? (
                    <Switch
                      checked={userData?.settings.new_rfq_notifications}
                      onChange={(event) => {
                        if (userData) {
                          const value = event.currentTarget.checked;

                          setUserData({
                            ...userData,
                            settings: {
                              ...userData.settings,
                              new_rfq_notifications: value,
                            },
                          });
                        }
                      }}
                    />
                  ) : (
                    <Badge
                      color={
                        userData?.settings.new_rfq_notifications
                          ? "green"
                          : "gray"
                      }
                    >
                      {userData?.settings.new_rfq_notifications
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  )}
                </Group>
                <Divider />
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      Order Updates
                    </Text>
                    <Text size="xs" c="dimmed">
                      Receive updates on purchase order status
                    </Text>
                  </div>
                  {editModes.notifications ? (
                    <Switch
                      checked={userData?.settings.order_updates}
                      onChange={(event) => {
                        if (userData) {
                          const value = event.currentTarget.checked;

                          setUserData({
                            ...userData,
                            settings: {
                              ...userData.settings,
                              order_updates: value,
                            },
                          });
                        }
                      }}
                    />
                  ) : (
                    <Badge
                      color={
                        userData?.settings.order_updates ? "green" : "gray"
                      }
                    >
                      {userData?.settings.order_updates
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  )}
                </Group>
                <Divider />
                <Group justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>
                      Payment Notifications
                    </Text>
                    <Text size="xs" c="dimmed">
                      Get notified about payment status
                    </Text>
                  </div>
                  {editModes.notifications ? (
                    <Switch
                      checked={userData?.settings.payment_notifications}
                      onChange={(event) => {
                        if (userData) {
                          const value = event.currentTarget.checked;

                          setUserData({
                            ...userData,
                            settings: {
                              ...userData.settings,
                              payment_notifications: value,
                            },
                          });
                        }
                      }}
                    />
                  ) : (
                    <Badge
                      color={
                        userData?.settings.payment_notifications
                          ? "green"
                          : "gray"
                      }
                    >
                      {userData?.settings.payment_notifications
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  )}
                </Group>
              </Stack>
              {editModes.notifications && (
                <Group justify="flex-end" mt="md">
                  <Button
                    variant="outline"
                    onClick={() => toggleEditMode("notifications")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleSupplierUpdate("notifications")}>
                    Save Changes
                  </Button>
                </Group>
              )}
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="documents" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={4}>Documents</Title>
                <ActionIcon
                  variant="subtle"
                  onClick={() => toggleEditMode("documents")}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Manage your company documents
              </Text>

              <Tabs defaultValue="legal">
                <Tabs.List>
                  <Tabs.Tab value="legal">Legal Documents</Tabs.Tab>
                  <Tabs.Tab value="financial">Financial Documents</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="legal" pt="md">
                  <Stack gap="md">
                    {editingDocument === "certificate_of_registration" ? (
                      <DocumentEditDropzone
                        documentKey="certificate_of_registration"
                        documentName="Certificate of Registration"
                        onCancel={() => setEditingDocument(null)}
                      />
                    ) : (
                      <Group justify="space-between">
                        <Group
                          style={{
                            cursor: userData?.certificate_of_registration
                              ? "pointer"
                              : "default",
                            flex: 1,
                          }}
                          onClick={() => {
                            if (userData?.certificate_of_registration) {
                              setDocumentModal({
                                open: true,
                                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/documents/${userData.certificate_of_registration}`,
                                title: "Certificate of Registration",
                              });
                            }
                          }}
                        >
                          <div>
                            <Text size="sm" fw={500}>
                              Certificate of Registration
                            </Text>
                            {userData?.certificate_of_registration ? (
                              <Text size="xs" c="dimmed">
                                Click to view document
                              </Text>
                            ) : (
                              <Text size="xs" c="dimmed">
                                Upload your business license document
                              </Text>
                            )}
                          </div>
                        </Group>
                        <Group gap="xs">
                          {userData?.certificate_of_registration ? (
                            <Badge color="green">Uploaded</Badge>
                          ) : (
                            <Badge color="gray">Not Uploaded</Badge>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              setEditingDocument("certificate_of_registration")
                            }
                          >
                            {userData?.certificate_of_registration
                              ? "Replace"
                              : "Upload"}
                          </Button>
                        </Group>
                      </Group>
                    )}
                    <Divider />
                    {editingDocument === "code_of_conduct" ? (
                      <DocumentEditDropzone
                        documentKey="code_of_conduct"
                        documentName="Code of Conduct"
                        onCancel={() => setEditingDocument(null)}
                      />
                    ) : (
                      <Group justify="space-between">
                        <Group
                          style={{
                            cursor: userData?.code_of_conduct
                              ? "pointer"
                              : "default",
                            flex: 1,
                          }}
                          onClick={() => {
                            if (userData?.code_of_conduct) {
                              setDocumentModal({
                                open: true,
                                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents/${userData.code_of_conduct}`,
                                title: "Code of Conduct",
                              });
                            }
                          }}
                        >
                          <div>
                            <Text size="sm" fw={500}>
                              Code of Conduct
                            </Text>
                            {userData?.code_of_conduct ? (
                              <Text size="xs" c="dimmed">
                                Click to view document
                              </Text>
                            ) : (
                              <Text size="xs" c="dimmed">
                                Upload your code of conduct
                              </Text>
                            )}
                          </div>
                        </Group>
                        <Group gap="xs">
                          {userData?.code_of_conduct ? (
                            <Badge color="green">Uploaded</Badge>
                          ) : (
                            <Badge color="gray">Not Uploaded</Badge>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              setEditingDocument("code_of_conduct")
                            }
                          >
                            {userData?.code_of_conduct ? "Replace" : "Upload"}
                          </Button>
                        </Group>
                      </Group>
                    )}
                    <Divider />
                    {editingDocument === "vendor_verification_form" ? (
                      <DocumentEditDropzone
                        documentKey="vendor_verification_form"
                        documentName="Vendor Verification Form"
                        onCancel={() => setEditingDocument(null)}
                      />
                    ) : (
                      <Group justify="space-between">
                        <Group
                          style={{
                            cursor: userData?.vendor_verification_form
                              ? "pointer"
                              : "default",
                            flex: 1,
                          }}
                          onClick={() => {
                            if (userData?.vendor_verification_form) {
                              setDocumentModal({
                                open: true,
                                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents/${userData.vendor_verification_form}`,
                                title: "Vendor Verification Form",
                              });
                            }
                          }}
                        >
                          <div>
                            <Text size="sm" fw={500}>
                              Vendor Verification Form
                            </Text>
                            {userData?.vendor_verification_form ? (
                              <Text size="xs" c="dimmed">
                                Click to view document
                              </Text>
                            ) : (
                              <Text size="xs" c="dimmed">
                                Upload your vendor verification form
                              </Text>
                            )}
                          </div>
                        </Group>
                        <Group gap="xs">
                          {userData?.vendor_verification_form ? (
                            <Badge color="green">Uploaded</Badge>
                          ) : (
                            <Badge color="gray">Not Uploaded</Badge>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              setEditingDocument("vendor_verification_form")
                            }
                          >
                            {userData?.vendor_verification_form
                              ? "Replace"
                              : "Upload"}
                          </Button>
                        </Group>
                      </Group>
                    )}
                    <Divider />
                    {editingDocument === "organisation_structure" ? (
                      <DocumentEditDropzone
                        documentKey="organisation_structure"
                        documentName="Organisation Structure"
                        onCancel={() => setEditingDocument(null)}
                      />
                    ) : (
                      <Group justify="space-between">
                        <Group
                          style={{
                            cursor: userData?.organisation_structure
                              ? "pointer"
                              : "default",
                            flex: 1,
                          }}
                          onClick={() => {
                            if (userData?.organisation_structure) {
                              setDocumentModal({
                                open: true,
                                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents/${userData.organisation_structure}`,
                                title: "Organisation Structure",
                              });
                            }
                          }}
                        >
                          <div>
                            <Text size="sm" fw={500}>
                              Organisation Structure
                            </Text>
                            {userData?.organisation_structure ? (
                              <Text size="xs" c="dimmed">
                                Click to view document
                              </Text>
                            ) : (
                              <Text size="xs" c="dimmed">
                                Upload your organisation structure
                              </Text>
                            )}
                          </div>
                        </Group>
                        <Group gap="xs">
                          {userData?.organisation_structure ? (
                            <Badge color="green">Uploaded</Badge>
                          ) : (
                            <Badge color="gray">Not Uploaded</Badge>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              setEditingDocument("organisation_structure")
                            }
                          >
                            {userData?.organisation_structure
                              ? "Replace"
                              : "Upload"}
                          </Button>
                        </Group>
                      </Group>
                    )}
                  </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="financial" pt="md">
                  <Stack gap="md">
                    {editingDocument === "bank_letter" ? (
                      <DocumentEditDropzone
                        documentKey="bank_letter"
                        documentName="Bank Letter"
                        onCancel={() => setEditingDocument(null)}
                      />
                    ) : (
                      <Group justify="space-between">
                        <Group
                          style={{
                            cursor: userData?.bank_letter
                              ? "pointer"
                              : "default",
                            flex: 1,
                          }}
                          onClick={() => {
                            if (userData?.bank_letter) {
                              setDocumentModal({
                                open: true,
                                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents/${userData.bank_letter}`,
                                title: "Bank Letter",
                              });
                            }
                          }}
                        >
                          <div>
                            <Text size="sm" fw={500}>
                              Bank Letter
                            </Text>
                            {userData?.bank_letter ? (
                              <Text size="xs" c="dimmed">
                                Click to view document
                              </Text>
                            ) : (
                              <Text size="xs" c="dimmed">
                                Upload your bank letter
                              </Text>
                            )}
                          </div>
                        </Group>
                        <Group gap="xs">
                          {userData?.bank_letter ? (
                            <Badge color="green">Uploaded</Badge>
                          ) : (
                            <Badge color="gray">Not Uploaded</Badge>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setEditingDocument("bank_letter")}
                          >
                            {userData?.bank_letter ? "Replace" : "Upload"}
                          </Button>
                        </Group>
                      </Group>
                    )}
                    <Divider />
                    {editingDocument === "commercial_assessment_form" ? (
                      <DocumentEditDropzone
                        documentKey="commercial_assessment_form"
                        documentName="Commercial Assessment Form"
                        onCancel={() => setEditingDocument(null)}
                      />
                    ) : (
                      <Group justify="space-between">
                        <Group
                          style={{
                            cursor: userData?.commercial_assessment_form
                              ? "pointer"
                              : "default",
                            flex: 1,
                          }}
                          onClick={() => {
                            if (userData?.commercial_assessment_form) {
                              setDocumentModal({
                                open: true,
                                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents/${userData.commercial_assessment_form}`,
                                title: "Commercial Assessment Form",
                              });
                            }
                          }}
                        >
                          <div>
                            <Text size="sm" fw={500}>
                              Commercial Assessment Form
                            </Text>
                            {userData?.commercial_assessment_form ? (
                              <Text size="xs" c="dimmed">
                                Click to view document
                              </Text>
                            ) : (
                              <Text size="xs" c="dimmed">
                                Upload your commercial assessment form
                              </Text>
                            )}
                          </div>
                        </Group>
                        <Group gap="xs">
                          {userData?.commercial_assessment_form ? (
                            <Badge color="green">Uploaded</Badge>
                          ) : (
                            <Badge color="gray">Not Uploaded</Badge>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              setEditingDocument("commercial_assessment_form")
                            }
                          >
                            {userData?.commercial_assessment_form
                              ? "Replace"
                              : "Upload"}
                          </Button>
                        </Group>
                      </Group>
                    )}
                    <Divider />
                    {editingDocument === "vat_certificate" ? (
                      <DocumentEditDropzone
                        documentKey="vat_certificate"
                        documentName="VAT Certificate"
                        onCancel={() => setEditingDocument(null)}
                      />
                    ) : (
                      <Group justify="space-between">
                        <Group
                          style={{
                            cursor: userData?.vat_certificate
                              ? "pointer"
                              : "default",
                            flex: 1,
                          }}
                          onClick={() => {
                            if (userData?.vat_certificate) {
                              setDocumentModal({
                                open: true,
                                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents/${userData.vat_certificate}`,
                                title: "VAT Certificate",
                              });
                            }
                          }}
                        >
                          <div>
                            <Text size="sm" fw={500}>
                              VAT Certificate
                            </Text>
                            {userData?.vat_certificate ? (
                              <Text size="xs" c="dimmed">
                                Click to view document
                              </Text>
                            ) : (
                              <Text size="xs" c="dimmed">
                                Upload your VAT certificate
                              </Text>
                            )}
                          </div>
                        </Group>
                        <Group gap="xs">
                          {userData?.vat_certificate ? (
                            <Badge color="green">Uploaded</Badge>
                          ) : (
                            <Badge color="gray">Not Uploaded</Badge>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              setEditingDocument("vat_certificate")
                            }
                          >
                            {userData?.vat_certificate ? "Replace" : "Upload"}
                          </Button>
                        </Group>
                      </Group>
                    )}
                    <Divider />
                    {editingDocument === "annual_returns" ? (
                      <DocumentEditDropzone
                        documentKey="annual_returns"
                        documentName="Annual Returns"
                        onCancel={() => setEditingDocument(null)}
                      />
                    ) : (
                      <Group justify="space-between">
                        <Group
                          style={{
                            cursor: userData?.annual_returns
                              ? "pointer"
                              : "default",
                            flex: 1,
                          }}
                          onClick={() => {
                            if (userData?.annual_returns) {
                              setDocumentModal({
                                open: true,
                                url: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/documents/${userData.annual_returns}`,
                                title: "Annual Returns",
                              });
                            }
                          }}
                        >
                          <div>
                            <Text size="sm" fw={500}>
                              Annual Returns
                            </Text>
                            {userData?.annual_returns ? (
                              <Text size="xs" c="dimmed">
                                Click to view document
                              </Text>
                            ) : (
                              <Text size="xs" c="dimmed">
                                Upload your annual returns
                              </Text>
                            )}
                          </div>
                        </Group>
                        <Group gap="xs">
                          {userData?.annual_returns ? (
                            <Badge color="green">Uploaded</Badge>
                          ) : (
                            <Badge color="gray">Not Uploaded</Badge>
                          )}
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setEditingDocument("annual_returns")}
                          >
                            {userData?.annual_returns ? "Replace" : "Upload"}
                          </Button>
                        </Group>
                      </Group>
                    )}
                  </Stack>
                </Tabs.Panel>
              </Tabs>

              {editModes.documents && (
                <Group justify="flex-end" mt="md">
                  <Button
                    variant="outline"
                    onClick={() => toggleEditMode("documents")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => toggleEditMode("documents")}>
                    Save Changes
                  </Button>
                </Group>
              )}
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      <DocumentViewerModal
        opened={documentModal.open}
        onClose={() => setDocumentModal({ open: false, url: "", title: "" })}
        title={documentModal.title}
        url={documentModal.url}
      />
    </ContentContainer>
  );
}
