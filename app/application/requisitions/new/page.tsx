"use client";

import { cartItems, nonTangibleCartItems } from "@/lib/utils/constants";
import {
  Card,
  Text,
  Group,
  Button,
  Stack,
  Title,
  Divider,
  Grid,
  TextInput,
  Select,
  Textarea,
  Stepper,
  Table,
  Badge,
  Paper,
  Avatar,
  ActionIcon,
  NumberInput,
  Modal,
  Checkbox,
  Tabs,
  Loader,
  FileInput,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import {
  IconCheck,
  IconFileText,
  IconTrash,
  IconPlus,
  IconSearch,
  IconPackage,
  IconPlane,
} from "@tabler/icons-react";
import { useState } from "react";

export default function CheckoutPage() {
  const [active, setActive] = useState(0);
  const [selectedReceiver, setSelectedReceiver] = useState<string | null>(null);
  // For testing single service - uncomment one of these lines:
  // const [items, setItems] = useState([{ ...nonTangibleCartItems[0], price: 15000 }]); // Flight only
  // const [items, setItems] = useState([{ ...nonTangibleCartItems[1], price: 12000 }]); // Hotel only
  // const [items, setItems] = useState([{ ...nonTangibleCartItems[2], price: 8000 }]); // Car only

  // Normal state (comment out for testing):
  const [items, setItems] = useState([
    ...cartItems,
    ...nonTangibleCartItems.map((item) => ({
      ...item,
      price: typeof item.price === "number" ? item.price : 15000,
    })),
  ]);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [selectedCatalogueItem, setSelectedCatalogueItem] = useState<
    string | null
  >(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [viewingService, setViewingService] = useState<string | null>(null);
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    specifications: "",
    addToCatalogue: false,
  });

  const [modalAttachments, setModalAttachments] = useState<File[]>([]);

  const modalEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: newItemForm.specifications || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setNewItemForm((prev) => ({ ...prev, specifications: editor.getHTML() }));
    },
  });
  const [itemType, setItemType] = useState<string | null>("goods");
  const [useCustomDelivery, setUseCustomDelivery] = useState(false);

  const users = [
    {
      value: "john-smith",
      label: "John Smith",
      email: "john.smith@company.com",
      department: "IT",
      phone: "+254 700 123 456",
    },
    {
      value: "sarah-johnson",
      label: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      department: "HR",
      phone: "+254 700 234 567",
    },
    {
      value: "mike-davis",
      label: "Mike Davis",
      email: "mike.davis@company.com",
      department: "Operations",
      phone: "+254 700 345 678",
    },
  ];

  const projects = [
    { value: "PROJ-2025-001", label: "Digital Transformation Initiative" },
    { value: "PROJ-2025-002", label: "Office Modernization" },
    { value: "PROJ-2025-003", label: "Remote Work Setup" },
    { value: "PROJ-2025-004", label: "IT Infrastructure Upgrade" },
    { value: "PROJ-2025-005", label: "Employee Wellness Program" },
  ];

  const catalogueItems = [
    {
      value: "CAT-001",
      label: "Ergonomic Office Chair",
      price: 38999,
      category: "Furniture",
      image: "/ergonomic-office-chair.png",
      inStock: true,
    },
    {
      value: "CAT-002",
      label: "Laptop - Dell XPS 15",
      price: 194999,
      category: "IT Equipment",
      image: "/modern-laptop.png",
      inStock: true,
    },
    {
      value: "CAT-003",
      label: "Printer Paper (500 sheets)",
      price: 1689,
      category: "Office Supplies",
      image: "/printer-paper.jpg",
      inStock: true,
    },
    {
      value: "CAT-004",
      label: "Standing Desk",
      price: 77999,
      category: "Furniture",
      image: "/standing-desk-setup.png",
      inStock: false,
    },
    {
      value: "CAT-005",
      label: "Wireless Mouse",
      price: 3899,
      category: "IT Equipment",
      image: "/wireless-mouse.png",
      inStock: true,
    },
  ];

  const selectedUser = users.find((user) => user.value === selectedReceiver);

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const addItem = () => {
    if (selectedCatalogueItem === null) {
      // Adding new item
      if (newItemForm.name && newItemForm.category && newItemForm.price > 0) {
        const newItem = {
          id: `NEW-${Date.now()}`,
          name: newItemForm.name,
          quantity: itemQuantity,
          price: newItemForm.price,
          category: newItemForm.category,
          description: newItemForm.description,
          isNew: true,
          addToCatalogue: newItemForm.addToCatalogue,
        };
        setItems([...items, newItem]);
        setAddItemModalOpen(false);
        setSelectedCatalogueItem(null);
        setItemQuantity(1);
        setNewItemForm({
          name: "",
          category: "",
          price: 0,
          description: "",
          specifications: "",
          addToCatalogue: false,
        });
        setModalAttachments([]);
        setItemType("goods");
      }
    } else {
      // Adding from catalogue
      const catalogueItem = catalogueItems.find(
        (item) => item.value === selectedCatalogueItem,
      );
      if (catalogueItem) {
        const newItem = {
          id: catalogueItem.value,
          name: catalogueItem.label,
          quantity: itemQuantity,
          price: catalogueItem.price,
        };
        setItems([...items, newItem]);
        setAddItemModalOpen(false);
        setSelectedCatalogueItem(null);
        setItemQuantity(1);
      }
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <Stack gap="lg">
      <div>
        <Title order={2} mb="xs">
          Create Requisition
        </Title>
        <Text c="dimmed" size="sm">
          Complete the form to submit your requisition for approval
        </Text>
      </div>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Request Details" description="Basic information">
            <Stack gap="md" mt="xl">
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Requisition Title"
                    placeholder="e.g., Q1 Office Equipment"
                    required
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Priority"
                    placeholder="Select priority"
                    data={["Low", "Medium", "High", "Urgent"]}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Cost Center"
                    placeholder="Select cost center"
                    data={["Marketing", "IT", "Operations", "HR", "Finance"]}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Project (Optional)"
                    placeholder="Select a project"
                    data={projects}
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Textarea
                    label="Business Justification"
                    placeholder="Explain why these items are needed..."
                    rows={4}
                    required
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="Delivery Details"
            description="Shipping information"
          >
            <Stack gap="md" mt="xl">
              <Grid gutter="md">
                <Grid.Col span={12}>
                  <Checkbox
                    label="Use custom delivery information"
                    checked={useCustomDelivery}
                    onChange={(e) =>
                      setUseCustomDelivery(e.currentTarget.checked)
                    }
                  />
                </Grid.Col>
                {!useCustomDelivery && (
                  <>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Select
                        label="Delivery Location"
                        placeholder="Select location"
                        data={[
                          "Main Office - Building A",
                          "Main Office - Building B",
                          "Warehouse",
                          "Remote Office",
                        ]}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Requested Delivery Date"
                        type="date"
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Select
                        label="Receiver"
                        placeholder="Select receiver"
                        data={users.map((user) => ({
                          value: user.value,
                          label: user.label,
                        }))}
                        value={selectedReceiver}
                        onChange={setSelectedReceiver}
                        required
                      />
                    </Grid.Col>
                    {selectedUser && (
                      <Grid.Col span={12}>
                        <Card shadow="sm" padding="md" radius="md" withBorder>
                          <Group gap="md">
                            <Avatar size={40} radius="xl" color="cyan">
                              {selectedUser.label
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </Avatar>
                            <div style={{ flex: 1 }}>
                              <Text fw={500}>{selectedUser.label}</Text>
                              <Text size="sm" c="dimmed">
                                {selectedUser.department}
                              </Text>
                              <Text size="sm" c="dimmed">
                                {selectedUser.email}
                              </Text>
                              <Text size="sm" c="dimmed">
                                {selectedUser.phone}
                              </Text>
                            </div>
                          </Group>
                        </Card>
                      </Grid.Col>
                    )}
                    <Grid.Col span={12}>
                      <Textarea
                        label="Special Delivery Instructions (Optional)"
                        placeholder="Any special requirements..."
                        rows={3}
                      />
                    </Grid.Col>
                  </>
                )}
                {useCustomDelivery && (
                  <>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Receiver Name"
                        placeholder="Enter receiver name"
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Receiver Phone"
                        placeholder="Enter phone number"
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Receiver Email"
                        placeholder="Enter email address"
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Department/Office"
                        placeholder="Enter department or office"
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Textarea
                        label="Delivery Address"
                        placeholder="Enter complete delivery address"
                        rows={2}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Requested Delivery Date"
                        type="date"
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Textarea
                        label="Special Delivery Instructions (Optional)"
                        placeholder="Any special requirements..."
                        rows={3}
                      />
                    </Grid.Col>
                  </>
                )}
              </Grid>
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Review & Submit" description="Confirm details">
            <Stack gap="md" mt="xl">
              <Paper p="md" withBorder>
                <Text fw={600} mb="md">
                  Requisition Summary
                </Text>
                <Grid gutter="sm">
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">
                      Title
                    </Text>
                    <Text size="sm">Q1 Office Equipment</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">
                      Priority
                    </Text>
                    <Badge size="sm" color="orange">
                      High
                    </Badge>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">
                      Cost Center
                    </Text>
                    <Text size="sm">IT</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text size="xs" c="dimmed">
                      Delivery Location
                    </Text>
                    <Text size="sm">Main Office - Building A</Text>
                  </Grid.Col>
                </Grid>
              </Paper>

              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                  <Text fw={600}>Items ({items.length})</Text>
                  <Button
                    size="xs"
                    leftSection={<IconPlus size={14} />}
                    onClick={() => setAddItemModalOpen(true)}
                  >
                    Add Item
                  </Button>
                </Group>

                {viewingService &&
                  (() => {
                    const service = items.find(
                      (item) => item.id === viewingService,
                    );
                    if (!service) return null;
                    return (
                      <Paper
                        p="md"
                        withBorder
                        mb="md"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <Group justify="space-between" mb="md">
                          <Text fw={600}>Booking Details - {service.name}</Text>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setViewingService(null)}
                          >
                            Back to Items
                          </Button>
                        </Group>
                        {service.name.includes("Flight") && (
                          <Grid gutter="md">
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                From
                              </Text>
                              <Text size="sm" fw={500}>
                                Nairobi (NBO)
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                To
                              </Text>
                              <Text size="sm" fw={500}>
                                Mombasa (MBA)
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Departure
                              </Text>
                              <Text size="sm" fw={500}>
                                Jan 25, 2025 - 09:00 AM
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Return
                              </Text>
                              <Text size="sm" fw={500}>
                                Jan 27, 2025 - 06:00 PM
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Class
                              </Text>
                              <Badge size="sm" variant="light">
                                Business
                              </Badge>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Passengers
                              </Text>
                              <Text size="sm" fw={500}>
                                1 Adult
                              </Text>
                            </Grid.Col>
                          </Grid>
                        )}
                        {service.name.includes("Hotel") && (
                          <Grid gutter="md">
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Hotel
                              </Text>
                              <Text size="sm" fw={500}>
                                Serena Beach Resort
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Location
                              </Text>
                              <Text size="sm" fw={500}>
                                Mombasa, Kenya
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Check-in
                              </Text>
                              <Text size="sm" fw={500}>
                                Jan 25, 2025
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Check-out
                              </Text>
                              <Text size="sm" fw={500}>
                                Jan 28, 2025
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Room Type
                              </Text>
                              <Badge size="sm" variant="light">
                                Deluxe Ocean View
                              </Badge>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Guests
                              </Text>
                              <Text size="sm" fw={500}>
                                2 Adults
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={12}>
                              <Text size="xs" c="dimmed">
                                Duration
                              </Text>
                              <Text size="sm" fw={500}>
                                3 nights
                              </Text>
                            </Grid.Col>
                          </Grid>
                        )}
                        {service.name.includes("Car") && (
                          <Grid gutter="md">
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Vehicle
                              </Text>
                              <Text size="sm" fw={500}>
                                Toyota Camry
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Category
                              </Text>
                              <Badge size="sm" variant="light">
                                Mid-size
                              </Badge>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Pickup Date
                              </Text>
                              <Text size="sm" fw={500}>
                                Jan 25, 2025 - 09:00 AM
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Return Date
                              </Text>
                              <Text size="sm" fw={500}>
                                Jan 30, 2025 - 09:00 AM
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Pickup Location
                              </Text>
                              <Text size="sm" fw={500}>
                                Jomo Kenyatta Airport
                              </Text>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Text size="xs" c="dimmed">
                                Duration
                              </Text>
                              <Text size="sm" fw={500}>
                                5 days
                              </Text>
                            </Grid.Col>
                          </Grid>
                        )}
                      </Paper>
                    );
                  })()}
                {!viewingService && (
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Item</Table.Th>
                        <Table.Th>Quantity</Table.Th>
                        <Table.Th>Unit Price</Table.Th>
                        <Table.Th>Total</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {items.map((item) => (
                        <Table.Tr key={item.id}>
                          <Table.Td>
                            <div
                              style={{
                                cursor: item.id.startsWith("SRV-")
                                  ? "pointer"
                                  : "default",
                              }}
                              onClick={() =>
                                item.id.startsWith("SRV-") &&
                                setViewingService(item.id)
                              }
                            >
                              <Text size="sm" fw={500}>
                                {item.name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {item.id}
                              </Text>
                              {item.id.startsWith("SRV-") && (
                                <Badge
                                  size="xs"
                                  variant="light"
                                  color="blue"
                                  mt={2}
                                >
                                  Service - Click to view details
                                </Badge>
                              )}
                            </div>
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              value={item.quantity}
                              onChange={(value) =>
                                updateItemQuantity(
                                  item.id,
                                  typeof value === "number" ? value : 1,
                                )
                              }
                              min={1}
                              max={99}
                              size="xs"
                              w={80}
                            />
                          </Table.Td>
                          <Table.Td>KES {item.price.toLocaleString()}</Table.Td>
                          <Table.Td fw={600}>
                            KES {(item.price * item.quantity).toLocaleString()}
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              onClick={() => removeItem(item.id)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}

                {!viewingService && (
                  <>
                    <Divider my="md" />
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="sm">Subtotal</Text>
                        <Text size="sm" fw={500}>
                          KES {subtotal.toLocaleString()}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Tax (10%)</Text>
                        <Text size="sm" fw={500}>
                          KES {tax.toLocaleString()}
                        </Text>
                      </Group>
                      <Divider />
                      <Group justify="space-between">
                        <Text size="md" fw={600}>
                          Total
                        </Text>
                        <Text size="lg" fw={700} c="cyan">
                          KES {total.toLocaleString()}
                        </Text>
                      </Group>
                    </Stack>
                  </>
                )}
              </Card>
            </Stack>
          </Stepper.Step>

          <Stepper.Completed>
            <Stack align="center" gap="md" py="xl">
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "var(--mantine-color-green-6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={40} color="white" />
              </div>
              <Title order={3}>Requisition Submitted!</Title>
              <Text c="dimmed" ta="center" maw={500}>
                Your requisition has been submitted successfully and is now
                pending approval from your line manager.
              </Text>
              <Paper p="md" withBorder>
                <Group gap="xs">
                  <IconFileText size={20} />
                  <div>
                    <Text size="xs" c="dimmed">
                      Requisition ID
                    </Text>
                    <Text size="sm" fw={600}>
                      REQ-2025-001
                    </Text>
                  </div>
                </Group>
              </Paper>
              <Group gap="md" mt="md">
                <Button
                  variant="light"
                  component="a"
                  href="/application/requisitions"
                >
                  View My Requisitions
                </Button>
                <Button variant="filled" component="a" href="/catalogue">
                  Back to Catalogue
                </Button>
              </Group>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {active < 3 && (
          <Group justify="space-between" mt="xl">
            <Button
              variant="default"
              onClick={() => setActive(active - 1)}
              disabled={active === 0}
            >
              Back
            </Button>
            <Button onClick={() => setActive(active + 1)}>
              {active === 2 ? "Submit Requisition" : "Next Step"}
            </Button>
          </Group>
        )}
      </Card>

      <Modal
        opened={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        title="Add Item"
        size="xl"
        centered
      >
        <Tabs
          value={
            selectedCatalogueItem === null
              ? "new"
              : selectedCatalogueItem === "suppliers"
                ? "suppliers"
                : "internal"
          }
          onChange={(value) => {
            if (value === "new") setSelectedCatalogueItem(null);
            else if (value === "suppliers")
              setSelectedCatalogueItem("suppliers");
            else setSelectedCatalogueItem("existing");
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="new">Add New Item</Tabs.Tab>
            <Tabs.Tab value="internal">From Internal Catalog</Tabs.Tab>
            <Tabs.Tab value="suppliers">From Suppliers Catalog</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="new" pt="md">
            <Stack gap="md">
              <Tabs value={itemType} onChange={setItemType}>
                <Tabs.List>
                  <Tabs.Tab
                    value="goods"
                    leftSection={<IconPackage size={16} />}
                  >
                    Goods
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="services"
                    leftSection={<IconPlane size={16} />}
                  >
                    Services
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="goods" pt="md">
                  <Grid gutter="md">
                    <Grid.Col span={6}>
                      <TextInput
                        label="Item Name"
                        placeholder="Enter item name"
                        value={newItemForm.name}
                        onChange={(e) =>
                          setNewItemForm({
                            ...newItemForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Category"
                        placeholder="Select category"
                        data={["Furniture", "IT Equipment", "Office Supplies"]}
                        value={newItemForm.category}
                        onChange={(value) =>
                          setNewItemForm({
                            ...newItemForm,
                            category: value || "",
                          })
                        }
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Estimated Unit Price (KES)"
                        placeholder="0"
                        min={0}
                        thousandSeparator=","
                        value={newItemForm.price}
                        onChange={(value) =>
                          setNewItemForm({
                            ...newItemForm,
                            price: typeof value === "number" ? value : 0,
                          })
                        }
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Quantity"
                        value={itemQuantity}
                        onChange={(value) =>
                          setItemQuantity(typeof value === "number" ? value : 1)
                        }
                        min={1}
                        max={99}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Textarea
                        label="Description"
                        placeholder="Brief description of the item"
                        rows={2}
                        value={newItemForm.description}
                        onChange={(e) =>
                          setNewItemForm({
                            ...newItemForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <div>
                        <Text size="sm" fw={500} mb="xs">
                          Specifications
                        </Text>
                        {!modalEditor ? (
                          <Group justify="center" p="md">
                            <Loader size="sm" />
                            <Text size="sm" c="dimmed">
                              Loading editor...
                            </Text>
                          </Group>
                        ) : (
                          <RichTextEditor editor={modalEditor}>
                            <RichTextEditor.Toolbar>
                              <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.Italic />
                                <RichTextEditor.Underline />
                                <RichTextEditor.ClearFormatting />
                              </RichTextEditor.ControlsGroup>
                              <RichTextEditor.ControlsGroup>
                                <RichTextEditor.BulletList />
                                <RichTextEditor.OrderedList />
                              </RichTextEditor.ControlsGroup>
                              <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Control
                                  onClick={() =>
                                    document
                                      .getElementById("modal-attachment-input")
                                      ?.click()
                                  }
                                  aria-label="Insert attachment"
                                  title="Insert attachment"
                                >
                                  <IconPlus size={16} />
                                </RichTextEditor.Control>
                              </RichTextEditor.ControlsGroup>
                            </RichTextEditor.Toolbar>
                            <RichTextEditor.Content
                              style={{ minHeight: "120px" }}
                            />
                          </RichTextEditor>
                        )}
                        <FileInput
                          id="modal-attachment-input"
                          style={{ display: "none" }}
                          multiple
                          onChange={(files) => {
                            if (files) {
                              setModalAttachments([
                                ...modalAttachments,
                                ...files,
                              ]);
                              files.forEach((file) => {
                                const link = `<p><a href="#" data-file="${file.name}">${file.name}</a> (${(file.size / 1024).toFixed(1)} KB)</p>`;
                                modalEditor?.commands.insertContent(link);
                              });
                            }
                          }}
                        />
                        {modalAttachments.length > 0 && (
                          <div style={{ marginTop: "8px" }}>
                            <Text size="xs" c="dimmed">
                              Attachments ({modalAttachments.length}):
                            </Text>
                            {modalAttachments.map((file, index) => (
                              <Group key={index} gap="xs" mt="xs">
                                <Text size="xs">{file.name}</Text>
                                <Text size="xs" c="dimmed">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </Text>
                                <ActionIcon
                                  size="xs"
                                  color="red"
                                  variant="subtle"
                                  onClick={() =>
                                    setModalAttachments(
                                      modalAttachments.filter(
                                        (_, i) => i !== index,
                                      ),
                                    )
                                  }
                                >
                                  <IconTrash size={12} />
                                </ActionIcon>
                              </Group>
                            ))}
                          </div>
                        )}
                      </div>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Checkbox
                        label="Add this item to the catalogue for future use"
                        checked={newItemForm.addToCatalogue}
                        onChange={(e) =>
                          setNewItemForm({
                            ...newItemForm,
                            addToCatalogue: e.currentTarget.checked,
                          })
                        }
                      />
                    </Grid.Col>
                  </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="services" pt="md">
                  <Grid gutter="md">
                    <Grid.Col span={6}>
                      <TextInput
                        label="Service Name"
                        placeholder="Enter service name"
                        value={newItemForm.name}
                        onChange={(e) =>
                          setNewItemForm({
                            ...newItemForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Service Category"
                        placeholder="Select category"
                        data={[
                          "Flight",
                          "Hotel",
                          "Car Rental",
                          "Professional Services",
                          "Consulting",
                          "Training",
                        ]}
                        value={newItemForm.category}
                        onChange={(value) =>
                          setNewItemForm({
                            ...newItemForm,
                            category: value || "",
                          })
                        }
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Estimated Base Price (KES)"
                        placeholder="0"
                        min={0}
                        thousandSeparator=","
                        value={newItemForm.price}
                        onChange={(value) =>
                          setNewItemForm({
                            ...newItemForm,
                            price: typeof value === "number" ? value : 0,
                          })
                        }
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Quantity"
                        value={itemQuantity}
                        onChange={(value) =>
                          setItemQuantity(typeof value === "number" ? value : 1)
                        }
                        min={1}
                        max={99}
                        required
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Textarea
                        label="Service Description"
                        placeholder="Brief description of the service"
                        rows={2}
                        value={newItemForm.description}
                        onChange={(e) =>
                          setNewItemForm({
                            ...newItemForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </Grid.Col>

                    {/* Category-specific fields for services */}
                    {newItemForm.category === "Flight" && (
                      <>
                        <Grid.Col span={12}>
                          <Text size="sm" fw={500} c="blue">
                            Flight Details
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="From"
                            placeholder="Departure city"
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="To"
                            placeholder="Destination city"
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput label="Departure Date" type="date" />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Select
                            label="Class"
                            data={["Economy", "Business", "First"]}
                          />
                        </Grid.Col>
                      </>
                    )}

                    {newItemForm.category === "Hotel" && (
                      <>
                        <Grid.Col span={12}>
                          <Text size="sm" fw={500} c="blue">
                            Hotel Details
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Location"
                            placeholder="City, Country"
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Select
                            label="Room Type"
                            data={["Standard", "Deluxe", "Suite"]}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput label="Check-in Date" type="date" />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <NumberInput
                            label="Guests"
                            min={1}
                            max={8}
                            defaultValue={2}
                          />
                        </Grid.Col>
                      </>
                    )}

                    {newItemForm.category === "Car Rental" && (
                      <>
                        <Grid.Col span={12}>
                          <Text size="sm" fw={500} c="blue">
                            Car Rental Details
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Select
                            label="Car Type"
                            data={["Economy", "Mid-size", "SUV", "Luxury"]}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Pickup Location"
                            placeholder="Address"
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput label="Pickup Date" type="date" />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <TextInput label="Return Date" type="date" />
                        </Grid.Col>
                      </>
                    )}

                    <Grid.Col span={12}>
                      <div>
                        <Text size="sm" fw={500} mb="xs">
                          Service Requirements
                        </Text>
                        {!modalEditor ? (
                          <Group justify="center" p="md">
                            <Loader size="sm" />
                            <Text size="sm" c="dimmed">
                              Loading editor...
                            </Text>
                          </Group>
                        ) : (
                          <RichTextEditor editor={modalEditor}>
                            <RichTextEditor.Toolbar>
                              <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.Italic />
                                <RichTextEditor.Underline />
                                <RichTextEditor.ClearFormatting />
                              </RichTextEditor.ControlsGroup>
                              <RichTextEditor.ControlsGroup>
                                <RichTextEditor.BulletList />
                                <RichTextEditor.OrderedList />
                              </RichTextEditor.ControlsGroup>
                              <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Control
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        "modal-service-attachment-input",
                                      )
                                      ?.click()
                                  }
                                  aria-label="Insert attachment"
                                  title="Insert attachment"
                                >
                                  <IconPlus size={16} />
                                </RichTextEditor.Control>
                              </RichTextEditor.ControlsGroup>
                            </RichTextEditor.Toolbar>
                            <RichTextEditor.Content
                              style={{ minHeight: "100px" }}
                            />
                          </RichTextEditor>
                        )}
                        <FileInput
                          id="modal-service-attachment-input"
                          style={{ display: "none" }}
                          multiple
                          onChange={(files) => {
                            if (files) {
                              setModalAttachments([
                                ...modalAttachments,
                                ...files,
                              ]);
                              files.forEach((file) => {
                                const link = `<p><a href="#" data-file="${file.name}">${file.name}</a> (${(file.size / 1024).toFixed(1)} KB)</p>`;
                                modalEditor?.commands.insertContent(link);
                              });
                            }
                          }}
                        />
                        {modalAttachments.length > 0 && (
                          <div style={{ marginTop: "8px" }}>
                            <Text size="xs" c="dimmed">
                              Attachments ({modalAttachments.length}):
                            </Text>
                            {modalAttachments.map((file, index) => (
                              <Group key={index} gap="xs" mt="xs">
                                <Text size="xs">{file.name}</Text>
                                <Text size="xs" c="dimmed">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </Text>
                                <ActionIcon
                                  size="xs"
                                  color="red"
                                  variant="subtle"
                                  onClick={() =>
                                    setModalAttachments(
                                      modalAttachments.filter(
                                        (_, i) => i !== index,
                                      ),
                                    )
                                  }
                                >
                                  <IconTrash size={12} />
                                </ActionIcon>
                              </Group>
                            ))}
                          </div>
                        )}
                      </div>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Checkbox
                        label="Add this service to the catalogue for future use"
                        checked={newItemForm.addToCatalogue}
                        onChange={(e) =>
                          setNewItemForm({
                            ...newItemForm,
                            addToCatalogue: e.currentTarget.checked,
                          })
                        }
                      />
                    </Grid.Col>
                  </Grid>
                </Tabs.Panel>
              </Tabs>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="internal" pt="md">
            <Stack gap="md">
              <Tabs value={itemType} onChange={setItemType}>
                <Tabs.List>
                  <Tabs.Tab
                    value="goods"
                    leftSection={<IconPackage size={16} />}
                  >
                    Inventory Items
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="services"
                    leftSection={<IconPlane size={16} />}
                  >
                    Services
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="goods" pt="md">
                  <TextInput
                    placeholder="Search inventory items..."
                    leftSection={<IconSearch size={16} />}
                    mb="md"
                  />

                  <Table highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Item</Table.Th>
                        <Table.Th>Category</Table.Th>
                        <Table.Th>Price</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {catalogueItems.map((item) => (
                        <Table.Tr
                          key={item.value}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedCatalogueItem === item.value
                                ? "var(--mantine-color-blue-0)"
                                : undefined,
                          }}
                          onClick={() => setSelectedCatalogueItem(item.value)}
                        >
                          <Table.Td>
                            <Text fw={500} size="sm">
                              {item.label}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {item.value}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light" size="sm">
                              {item.category}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={600} c="cyan">
                              KES {item.price.toLocaleString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              variant="light"
                              color={item.inStock ? "green" : "red"}
                            >
                              {item.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Tabs.Panel>

                <Tabs.Panel value="services" pt="md">
                  <TextInput
                    placeholder="Search services..."
                    leftSection={<IconSearch size={16} />}
                    mb="md"
                  />

                  <Table highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Service</Table.Th>
                        <Table.Th>Category</Table.Th>
                        <Table.Th>Price</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {[
                        {
                          value: "SRV-001",
                          label: "Flight Booking Service",
                          category: "Travel",
                          price: 15000,
                          inStock: true,
                        },
                        {
                          value: "SRV-002",
                          label: "Hotel Accommodation",
                          category: "Travel",
                          price: 12000,
                          inStock: true,
                        },
                        {
                          value: "SRV-003",
                          label: "Car Rental Service",
                          category: "Transport",
                          price: 8000,
                          inStock: true,
                        },
                      ].map((item) => (
                        <Table.Tr
                          key={item.value}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedCatalogueItem === item.value
                                ? "var(--mantine-color-blue-0)"
                                : undefined,
                          }}
                          onClick={() => setSelectedCatalogueItem(item.value)}
                        >
                          <Table.Td>
                            <Text fw={500} size="sm">
                              {item.label}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {item.value}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light" size="sm">
                              {item.category}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={600} c="cyan">
                              From KES {item.price.toLocaleString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light" color="green">
                              Available
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Tabs.Panel>
              </Tabs>

              {selectedCatalogueItem &&
                selectedCatalogueItem !== "existing" &&
                selectedCatalogueItem !== "suppliers" && (
                  <NumberInput
                    label="Quantity"
                    value={itemQuantity}
                    onChange={(value) =>
                      setItemQuantity(typeof value === "number" ? value : 1)
                    }
                    min={1}
                    max={99}
                  />
                )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="suppliers" pt="md">
            <Stack gap="md">
              <Tabs value={itemType} onChange={setItemType}>
                <Tabs.List>
                  <Tabs.Tab
                    value="goods"
                    leftSection={<IconPackage size={16} />}
                  >
                    Inventory Items
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="services"
                    leftSection={<IconPlane size={16} />}
                  >
                    Services
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="goods" pt="md">
                  <TextInput
                    placeholder="Search supplier inventory..."
                    leftSection={<IconSearch size={16} />}
                    mb="md"
                  />

                  <Table highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Item</Table.Th>
                        <Table.Th>Supplier</Table.Th>
                        <Table.Th>Price</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {[
                        {
                          value: "SUP-001",
                          label: "Premium Office Chair",
                          supplier: "Office Pro Ltd",
                          price: 42000,
                          inStock: true,
                        },
                        {
                          value: "SUP-002",
                          label: "Gaming Laptop - ASUS ROG",
                          supplier: "Tech Solutions Inc",
                          price: 220000,
                          inStock: true,
                        },
                        {
                          value: "SUP-003",
                          label: "Industrial Printer",
                          supplier: "Print Solutions Ltd",
                          price: 85000,
                          inStock: false,
                        },
                      ].map((item) => (
                        <Table.Tr
                          key={item.value}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedCatalogueItem === item.value
                                ? "var(--mantine-color-blue-0)"
                                : undefined,
                          }}
                          onClick={() => setSelectedCatalogueItem(item.value)}
                        >
                          <Table.Td>
                            <Text fw={500} size="sm">
                              {item.label}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {item.value}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{item.supplier}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={600} c="cyan">
                              KES {item.price.toLocaleString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              variant="light"
                              color={item.inStock ? "green" : "orange"}
                            >
                              {item.inStock ? "Available" : "Quote Required"}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Tabs.Panel>

                <Tabs.Panel value="services" pt="md">
                  <TextInput
                    placeholder="Search supplier services..."
                    leftSection={<IconSearch size={16} />}
                    mb="md"
                  />

                  <Table highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Service</Table.Th>
                        <Table.Th>Provider</Table.Th>
                        <Table.Th>Price</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {[
                        {
                          value: "EXT-001",
                          label: "International Flight Booking",
                          supplier: "Kenya Airways",
                          price: 45000,
                          inStock: true,
                        },
                        {
                          value: "EXT-002",
                          label: "Luxury Hotel Package",
                          supplier: "Serena Hotels",
                          price: 25000,
                          inStock: true,
                        },
                        {
                          value: "EXT-003",
                          label: "Executive Car Service",
                          supplier: "Avis Kenya",
                          price: 15000,
                          inStock: true,
                        },
                      ].map((item) => (
                        <Table.Tr
                          key={item.value}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedCatalogueItem === item.value
                                ? "var(--mantine-color-blue-0)"
                                : undefined,
                          }}
                          onClick={() => setSelectedCatalogueItem(item.value)}
                        >
                          <Table.Td>
                            <Text fw={500} size="sm">
                              {item.label}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {item.value}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{item.supplier}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={600} c="cyan">
                              From KES {item.price.toLocaleString()}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light" color="blue">
                              Quote Available
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Tabs.Panel>
              </Tabs>

              {selectedCatalogueItem &&
                selectedCatalogueItem !== "existing" &&
                selectedCatalogueItem !== "suppliers" && (
                  <NumberInput
                    label="Quantity"
                    value={itemQuantity}
                    onChange={(value) =>
                      setItemQuantity(typeof value === "number" ? value : 1)
                    }
                    min={1}
                    max={99}
                  />
                )}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" gap="sm" mt="md">
          <Button variant="outline" onClick={() => setAddItemModalOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={addItem}
            disabled={
              selectedCatalogueItem === "existing" ||
              selectedCatalogueItem === "suppliers" ||
              (selectedCatalogueItem === null &&
                (!newItemForm.name ||
                  !newItemForm.category ||
                  newItemForm.price <= 0))
            }
          >
            Add Item
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}
