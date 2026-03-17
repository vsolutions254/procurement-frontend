"use client";

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
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  getCartProducts,
  getCartProduct,
  removeCartProduct,
  updateCartProductQuantity,
  addProductToCart,
} from "@/lib/redux/features/products/cart/cartSlice";
import {
  getCartServices,
  getCartService,
  removeCartService,
  updateCartServiceQuantity,
  addServiceToCart,
  updateCartService,
} from "@/lib/redux/features/services/cart/cartSlice";
import { getProducts } from "@/lib/redux/features/products/productsSlice";
import { getServices } from "@/lib/redux/features/services/servicesSlice";
import {
  computeTax,
  computeTotal,
  formatCurrency,
} from "@/components/shared/catalogue/services/utils/constants";
import CustomFieldsForm from "@/components/shared/catalogue/custom-fields-form";

type RequisitionItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
  description?: string;
  isNew?: boolean;
  addToCatalogue?: boolean;
};

export default function CheckoutPage() {
  const { products: cartProducts, productDetails } = useAppSelector(
    (state) => state.products_cart,
  );
  const {
    services: cartServices,
    serviceDetails,
    servicesLoading,
  } = useAppSelector((state) => state.services_cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCartProducts());
    dispatch(getCartServices());
  }, [dispatch]);

  useEffect(() => {
    cartProducts.forEach((item) => {
      if (!productDetails[item.product_id]) {
        dispatch(getCartProduct(item.product_id));
      }
    });
  }, [cartProducts, dispatch, productDetails]);

  useEffect(() => {
    cartServices.forEach((item) => {
      if (!serviceDetails[item.service_id]) {
        dispatch(getCartService(item.service_id));
      }
    });
  }, [cartServices, dispatch, serviceDetails]);

  useEffect(() => {
    const productItems = cartProducts.map((item) => {
      const product = productDetails[item.product_id];
      return {
        id: `product-${item.product_id}`,
        name: product?.name ?? `Product #${item.product_id}`,
        quantity: item.quantity,
        price: product ? Number(product.base_price) : 0,
        category: "Product",
      };
    });
    const serviceItems = cartServices.map((item) => {
      const service = serviceDetails[item.service_id];
      return {
        id: `service-${item.service_id}`,
        name: service?.name ?? `Service #${item.service_id}`,
        quantity: item.quantity,
        price: service ? Number(service.base_price) : 0,
        category: "Service",
        custom_values: item.custom_values,
      };
    });
    setItems([...productItems, ...serviceItems]);
  }, [cartProducts, cartServices, productDetails, serviceDetails]);

  const { products: catalogueProducts, productsLoading: catalogueProductsLoading } = useAppSelector(
    (state) => state.products,
  );
  const { services: catalogueServices, servicesLoading: catalogueServicesLoading } = useAppSelector(
    (state) => state.services,
  );

  const [internalSearch, setInternalSearch] = useState("");
  const [selectedInternalItem, setSelectedInternalItem] = useState<{ id: number; type: "product" | "service" } | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, CustomFieldValueType>>({});
  const [activeModalTab, setActiveModalTab] = useState<string | null>("new");

  const [active, setActive] = useState(0);
  const [selectedReceiver, setSelectedReceiver] = useState<string | null>(null);

  const [items, setItems] = useState<RequisitionItem[]>([]);

  const [addItemModalOpen, setAddItemModalOpen] = useState(false);

  useEffect(() => {
    if (addItemModalOpen) {
      dispatch(getProducts({ page: 1 }));
      dispatch(getServices({ page: 1 }));
      setSelectedInternalItem(null);
      setCustomFieldValues({});
      setInternalSearch("");
      setItemQuantity(1);
      setActiveModalTab("new");
    }
  }, [addItemModalOpen, dispatch]);
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

  const selectedUser = users.find((user) => user.value === selectedReceiver);

  const updateItemQuantity = async (id: string, quantity: number) => {
    // Update local state immediately for UI responsiveness
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );

    // Also update the global cart state
    try {
      if (id.startsWith("product-")) {
        const productId = parseInt(id.replace("product-", ""));
        await dispatch(
          updateCartProductQuantity({
            product_id: productId,
            quantity,
          }),
        ).unwrap();
      } else if (id.startsWith("service-")) {
        const serviceId = parseInt(id.replace("service-", ""));
        await dispatch(
          updateCartServiceQuantity({
            service_id: serviceId,
            quantity,
          }),
        ).unwrap();
      }
    } catch (error) {
      // If the API call fails, revert the local state change
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity } : item,
        ),
      );
      console.error("Failed to update cart quantity:", error);
    }
  };

  const removeItem = async (id: string) => {
    // Update local state immediately for UI responsiveness
    setItems(items.filter((item) => item.id !== id));

    // Also update the global cart state
    try {
      if (id.startsWith("product-")) {
        const productId = parseInt(id.replace("product-", ""));
        await dispatch(removeCartProduct(productId)).unwrap();
      } else if (id.startsWith("service-")) {
        const serviceId = parseInt(id.replace("service-", ""));
        await dispatch(removeCartService(serviceId)).unwrap();
      }
    } catch (error) {
      // If the API call fails, revert the local state change
      // Note: This is complex to revert, so we'll just log the error for now
      console.error("Failed to remove item from cart:", error);
    }
  };

  const [addItemLoading, setAddItemLoading] = useState(false);
  const [editServiceModalOpen, setEditServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<CartService | null>(null);
  const [editServiceQuantity, setEditServiceQuantity] = useState(1);
  const [editServiceFormData, setEditServiceFormData] = useState<Record<string, CustomFieldValueType>>({});
  const [editServiceLoading, setEditServiceLoading] = useState(false);

  const addItem = async () => {
    if (selectedInternalItem !== null) {
      setAddItemLoading(true);
      try {
        if (selectedInternalItem.type === "product") {
          await dispatch(addProductToCart({ product_id: selectedInternalItem.id, quantity: itemQuantity })).unwrap();
          await dispatch(getCartProduct(selectedInternalItem.id));
        } else {
          const custom_values: CustomFieldValue[] = Object.entries(customFieldValues)
            .filter(([, v]) => v !== "" && v !== null && v !== undefined)
            .map(([field_id, value]) => ({ field_id, value }));
          await dispatch(addServiceToCart({ service_id: selectedInternalItem.id, quantity: itemQuantity, custom_values })).unwrap();
          await dispatch(getCartService(selectedInternalItem.id));
        }
        setAddItemModalOpen(false);
        setSelectedInternalItem(null);
        setCustomFieldValues({});
        setItemQuantity(1);
      } finally {
        setAddItemLoading(false);
      }
      return;
    }

    if (selectedCatalogueItem === null) {
      if (newItemForm.name && newItemForm.category && newItemForm.price > 0) {
        const newItem: RequisitionItem = {
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
        setNewItemForm({ name: "", category: "", price: 0, description: "", specifications: "", addToCatalogue: false });
        setModalAttachments([]);
        setItemType("goods");
      }
    }
  };

  const subtotal = [
    ...cartProducts.map((item) => {
      const p = productDetails[item.product_id];
      return p ? computeTotal(p) * item.quantity : 0;
    }),
    ...cartServices.map((item) => {
      const s = serviceDetails[item.service_id];
      return s ? computeTotal(s) * item.quantity : 0;
    }),
  ].reduce((a, b) => a + b, 0);

  const tax = [
    ...cartProducts.map((item) => {
      const p = productDetails[item.product_id];
      return p ? computeTax(p) * item.quantity : 0;
    }),
    ...cartServices.map((item) => {
      const s = serviceDetails[item.service_id];
      return s ? computeTax(s) * item.quantity : 0;
    }),
  ].reduce((a, b) => a + b, 0);

  const total = subtotal;

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
                  <Tabs defaultValue="products">
                    <Tabs.List mb="md">
                      <Tabs.Tab value="products" leftSection={<IconPackage size={14} />}>
                        Products ({cartProducts.length})
                      </Tabs.Tab>
                      <Tabs.Tab value="services" leftSection={<IconPlane size={14} />}>
                        Services ({cartServices.length})
                      </Tabs.Tab>
                      <Tabs.Tab value="recommended" leftSection={<IconSearch size={14} />}>
                        Recommended Items
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="products">
                      {servicesLoading ? (
                        <Group justify="center" p="md"><Loader size="sm" /></Group>
                      ) : cartProducts.length === 0 ? (
                        <Text c="dimmed" size="sm" ta="center" py="md">No products in cart.</Text>
                      ) : (
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Item</Table.Th>
                              <Table.Th>Qty</Table.Th>
                              <Table.Th>Unit Price</Table.Th>
                              <Table.Th>Tax</Table.Th>
                              <Table.Th>Total</Table.Th>
                              <Table.Th></Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {cartProducts.map((raw) => {
                              const p = productDetails[raw.product_id];
                              const id = `product-${raw.product_id}`;
                              const base = p ? Number(p.base_price) : 0;
                              const taxAmt = p ? computeTax(p) : 0;
                              const lineTotal = p ? computeTotal(p) * raw.quantity : 0;
                              const isInclusive = p?.sellable?.tax_type === "inclusive";
                              const isTaxable = p?.sellable?.tax_status === "taxable" && taxAmt > 0;
                              return (
                                <Table.Tr key={id}>
                                  <Table.Td>
                                    <Text size="sm" fw={500}>{p?.name ?? `Product #${raw.product_id}`}</Text>
                                    <Text size="xs" c="dimmed">{p?.category?.name}</Text>
                                  </Table.Td>
                                  <Table.Td>
                                    <NumberInput
                                      value={raw.quantity}
                                      onChange={(v) => updateItemQuantity(id, Number(v) || 1)}
                                      min={1} max={99} size="xs" w={80}
                                    />
                                  </Table.Td>
                                  <Table.Td>{formatCurrency(base)}</Table.Td>
                                  <Table.Td>
                                    {isTaxable ? (
                                      <Stack gap={2}>
                                        <Text size="xs" fw={500}>{formatCurrency(taxAmt * raw.quantity)}</Text>
                                        <Badge size="xs" variant="dot" color={isInclusive ? "teal" : "orange"}>
                                          {isInclusive ? "Inclusive" : "Exclusive"}
                                        </Badge>
                                      </Stack>
                                    ) : (
                                      <Text size="xs" c="dimmed">—</Text>
                                    )}
                                  </Table.Td>
                                  <Table.Td fw={600}>{formatCurrency(lineTotal)}</Table.Td>
                                  <Table.Td>
                                    <ActionIcon color="red" variant="subtle" onClick={() => removeItem(id)}>
                                      <IconTrash size={16} />
                                    </ActionIcon>
                                  </Table.Td>
                                </Table.Tr>
                              );
                            })}
                          </Table.Tbody>
                        </Table>
                      )}
                    </Tabs.Panel>

                    <Tabs.Panel value="services">
                      {servicesLoading ? (
                        <Group justify="center" p="md"><Loader size="sm" /></Group>
                      ) : cartServices.length === 0 ? (
                        <Text c="dimmed" size="sm" ta="center" py="md">No services in cart.</Text>
                      ) : (
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Service</Table.Th>
                              <Table.Th>Qty</Table.Th>
                              <Table.Th>Unit Price</Table.Th>
                              <Table.Th>Tax</Table.Th>
                              <Table.Th>Total</Table.Th>
                              <Table.Th></Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {cartServices.map((raw) => {
                              const s = serviceDetails[raw.service_id];
                              const id = `service-${raw.service_id}`;
                              const base = s ? Number(s.base_price) : 0;
                              const taxAmt = s ? computeTax(s) : 0;
                              const lineTotal = s ? computeTotal(s) * raw.quantity : 0;
                              const isInclusive = s?.sellable?.tax_type === "inclusive";
                              const isTaxable = s?.sellable?.tax_status === "taxable" && taxAmt > 0;
                              const hasCustomFields = (s?.category?.custom_fields?.length ?? 0) > 0;
                              return (
                                <Table.Tr
                                  key={id}
                                  style={{ cursor: hasCustomFields ? "pointer" : undefined }}
                                  onClick={() => {
                                    if (!s || !hasCustomFields) return;
                                    setEditingService({ service: s, quantity: raw.quantity, custom_values: raw.custom_values ?? [] });
                                    setEditServiceQuantity(raw.quantity);
                                    const record: Record<string, CustomFieldValueType> = {};
                                    (raw.custom_values ?? []).forEach(({ field_id, value }) => { record[field_id] = value; });
                                    setEditServiceFormData(record);
                                    setEditServiceModalOpen(true);
                                  }}
                                >
                                  <Table.Td>
                                    <Text size="sm" fw={500}>{s?.name ?? `Service #${raw.service_id}`}</Text>
                                    <Group gap={4} mt={2}>
                                      <Text size="xs" c="dimmed">{s?.category?.name}</Text>
                                      {hasCustomFields && (
                                        <Badge size="xs" variant="light" color="blue">Click to edit</Badge>
                                      )}
                                    </Group>
                                  </Table.Td>
                                  <Table.Td>
                                    <NumberInput
                                      value={raw.quantity}
                                      onChange={(v) => updateItemQuantity(id, Number(v) || 1)}
                                      min={1} max={99} size="xs" w={80}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </Table.Td>
                                  <Table.Td>{formatCurrency(base)}</Table.Td>
                                  <Table.Td>
                                    {isTaxable ? (
                                      <Stack gap={2}>
                                        <Text size="xs" fw={500}>{formatCurrency(taxAmt * raw.quantity)}</Text>
                                        <Badge size="xs" variant="dot" color={isInclusive ? "teal" : "orange"}>
                                          {isInclusive ? "Inclusive" : "Exclusive"}
                                        </Badge>
                                      </Stack>
                                    ) : (
                                      <Text size="xs" c="dimmed">—</Text>
                                    )}
                                  </Table.Td>
                                  <Table.Td fw={600}>{formatCurrency(lineTotal)}</Table.Td>
                                  <Table.Td>
                                    <ActionIcon color="red" variant="subtle" onClick={(e) => { e.stopPropagation(); removeItem(id); }}>
                                      <IconTrash size={16} />
                                    </ActionIcon>
                                  </Table.Td>
                                </Table.Tr>
                              );
                            })}
                          </Table.Tbody>
                        </Table>
                      )}
                    </Tabs.Panel>

                    <Tabs.Panel value="recommended">
                      <Table highlightOnHover>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Item</Table.Th>
                            <Table.Th>Category</Table.Th>
                            <Table.Th>Price</Table.Th>
                            <Table.Th></Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {[
                            { id: "REC-001", name: "Wireless Keyboard", category: "IT Equipment", price: 4500 },
                            { id: "REC-002", name: "USB-C Hub", category: "IT Equipment", price: 3200 },
                            { id: "REC-003", name: "Desk Organizer Set", category: "Office Supplies", price: 1800 },
                            { id: "REC-004", name: "Monitor Stand", category: "Furniture", price: 6500 },
                          ].map((rec) => (
                            <Table.Tr key={rec.id}>
                              <Table.Td>
                                <Text size="sm" fw={500}>{rec.name}</Text>
                                <Text size="xs" c="dimmed">{rec.id}</Text>
                              </Table.Td>
                              <Table.Td>
                                <Badge variant="light" size="sm">{rec.category}</Badge>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm" fw={600} c="cyan">{formatCurrency(rec.price)}</Text>
                              </Table.Td>
                              <Table.Td>
                                <Button size="xs" variant="light" leftSection={<IconPlus size={12} />}>
                                  Add
                                </Button>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Tabs.Panel>
                  </Tabs>
                )}

                {!viewingService && (
                  <>
                    <Divider my="md" />
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text size="sm">Subtotal</Text>
                        <Text size="sm" fw={500}>
                          {formatCurrency(subtotal)}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Tax</Text>
                        <Text size="sm" fw={500}>
                          {formatCurrency(tax)}
                        </Text>
                      </Group>
                      <Divider />
                      <Group justify="space-between">
                        <Text size="md" fw={600}>
                          Total
                        </Text>
                        <Text size="lg" fw={700} c="cyan">
                          {formatCurrency(total)}
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
        opened={editServiceModalOpen}
        onClose={() => setEditServiceModalOpen(false)}
        title={`Edit Service - ${editingService?.service.name}`}
        size="lg"
        centered
      >
        {editingService && (
          <Stack gap="md">
            <NumberInput
              label="Quantity"
              min={1}
              max={100}
              value={editServiceQuantity}
              onChange={(v) => setEditServiceQuantity(Number(v) || 1)}
            />
            {(editingService.service.category.custom_fields?.length ?? 0) > 0 && (
              <>
                <Divider label="Service Details" labelPosition="left" />
                <CustomFieldsForm
                  customFields={editingService.service.category.custom_fields!}
                  formData={editServiceFormData}
                  setFormData={setEditServiceFormData}
                />
              </>
            )}
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={() => setEditServiceModalOpen(false)}>Cancel</Button>
              <Button
                loading={editServiceLoading}
                onClick={async () => {
                  setEditServiceLoading(true);
                  try {
                    const custom_values: CustomFieldValue[] = Object.entries(editServiceFormData)
                      .filter(([, v]) => v !== "" && v !== null && v !== undefined)
                      .map(([field_id, value]) => ({ field_id, value }));
                    await dispatch(updateCartService({
                      service_id: editingService.service.id,
                      quantity: editServiceQuantity,
                      custom_values,
                    })).unwrap();
                    setEditServiceModalOpen(false);
                  } finally {
                    setEditServiceLoading(false);
                  }
                }}
              >
                Save
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      <Modal
        opened={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        title="Add Item"
        size="xl"
        centered
      >
        <Tabs
          value={activeModalTab}
          onChange={(value) => {
            setActiveModalTab(value);
            setSelectedInternalItem(null);
            setSelectedCatalogueItem(value === "suppliers" ? "suppliers" : null);
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
                            price: Number(value) || 0,
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
                          setItemQuantity(Number(value) || 1)
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
                            price: Number(value) || 0,
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
                          setItemQuantity(Number(value) || 1)
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
              <Tabs value={itemType} onChange={(v) => { setItemType(v); setSelectedInternalItem(null); setCustomFieldValues({}); }}>
                <Tabs.List>
                  <Tabs.Tab value="goods" leftSection={<IconPackage size={16} />}>
                    Products
                  </Tabs.Tab>
                  <Tabs.Tab value="services" leftSection={<IconPlane size={16} />}>
                    Services
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="goods" pt="md">
                  <TextInput
                    placeholder="Search products..."
                    leftSection={<IconSearch size={16} />}
                    mb="md"
                    value={internalSearch}
                    onChange={(e) => setInternalSearch(e.currentTarget.value)}
                  />
                  {catalogueProductsLoading ? (
                    <Group justify="center" py="md"><Loader size="sm" /></Group>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Item</Table.Th>
                          <Table.Th>Category</Table.Th>
                          <Table.Th>Price</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {catalogueProducts
                          .filter((p: Product) => p.name.toLowerCase().includes(internalSearch.toLowerCase()))
                          .map((p: Product) => (
                            <Table.Tr
                              key={p.id}
                              style={{
                                cursor: "pointer",
                                backgroundColor: selectedInternalItem?.id === p.id && selectedInternalItem?.type === "product"
                                  ? "var(--mantine-color-blue-0)" : undefined,
                              }}
                              onClick={() => setSelectedInternalItem({ id: p.id, type: "product" })}
                            >
                              <Table.Td>
                                <Text fw={500} size="sm">{p.name}</Text>
                                <Text size="xs" c="dimmed">{p.id}</Text>
                              </Table.Td>
                              <Table.Td>
                                <Badge variant="light" size="sm">{p.category?.name}</Badge>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm" fw={600} c="cyan">{formatCurrency(Number(p.base_price))}</Text>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </Tabs.Panel>

                <Tabs.Panel value="services" pt="md">
                  <TextInput
                    placeholder="Search services..."
                    leftSection={<IconSearch size={16} />}
                    mb="md"
                    value={internalSearch}
                    onChange={(e) => setInternalSearch(e.currentTarget.value)}
                  />
                  {catalogueServicesLoading ? (
                    <Group justify="center" py="md"><Loader size="sm" /></Group>
                  ) : (
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Service</Table.Th>
                          <Table.Th>Category</Table.Th>
                          <Table.Th>Price</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {catalogueServices
                          .filter((s: Service) => s.name.toLowerCase().includes(internalSearch.toLowerCase()))
                          .map((s: Service) => (
                            <Table.Tr
                              key={s.id}
                              style={{
                                cursor: "pointer",
                                backgroundColor: selectedInternalItem?.id === s.id && selectedInternalItem?.type === "service"
                                  ? "var(--mantine-color-blue-0)" : undefined,
                              }}
                              onClick={() => { setSelectedInternalItem({ id: s.id, type: "service" }); setCustomFieldValues({}); }}
                            >
                              <Table.Td>
                                <Text fw={500} size="sm">{s.name}</Text>
                                <Text size="xs" c="dimmed">{s.id}</Text>
                              </Table.Td>
                              <Table.Td>
                                <Badge variant="light" size="sm">{s.category?.name}</Badge>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm" fw={600} c="cyan">{formatCurrency(Number(s.base_price))}</Text>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </Tabs.Panel>
              </Tabs>

              {selectedInternalItem && (
                <Stack gap="sm">
                  <NumberInput
                    label="Quantity"
                    value={itemQuantity}
                    onChange={(value) => setItemQuantity(Number(value) || 1)}
                    min={1}
                    max={99}
                  />
                  {(() => {
                    if (selectedInternalItem.type !== "service") return null;
                    const svc = catalogueServices.find((s: Service) => s.id === selectedInternalItem.id);
                    const fields = svc?.category?.custom_fields;
                    if (!fields?.length) return null;
                    return (
                      <>
                        <Divider label="Service Details" labelPosition="left" />
                        <CustomFieldsForm
                          customFields={fields}
                          formData={customFieldValues}
                          setFormData={setCustomFieldValues}
                        />
                      </>
                    );
                  })()}
                </Stack>
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
                        },
                        {
                          value: "EXT-002",
                          label: "Luxury Hotel Package",
                          supplier: "Serena Hotels",
                          price: 25000,
                        },
                        {
                          value: "EXT-003",
                          label: "Executive Car Service",
                          supplier: "Avis Kenya",
                          price: 15000,
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
                    onChange={(value) => setItemQuantity(Number(value) || 1)}
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
            loading={addItemLoading}
            disabled={
              !addItemLoading &&
              selectedInternalItem === null &&
              (selectedCatalogueItem === "suppliers" ||
              (selectedCatalogueItem === null &&
                (!newItemForm.name ||
                  !newItemForm.category ||
                  newItemForm.price <= 0)))
            }
          >
            Add Item
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
}
