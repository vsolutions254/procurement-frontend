"use client";

import {
  Card,
  Text,
  Group,
  Button,
  Stack,
  Divider,
  Grid,
  TextInput,
  Select,
  Textarea,
  Table,
  Badge,
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
  IconSearch,
  IconPackage,
  IconPlane,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import type { RootState } from "@/lib/redux/store";
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
import { fetchUsers } from "@/lib/redux/features/merchants/merchantSlice";
import {
  computeTax,
  computeTotal,
  formatCurrency,
} from "@/components/shared/catalogue/services/utils/constants";
import CustomFieldsForm from "@/components/shared/catalogue/custom-fields-form";
import PageHeader from "@/components/shared/requisitions/create/page-header";
import CreateRequisitionSteps from "../../../../components/shared/requisitions/create/steps/steps";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { ProcurementProcessor } from "@/lib/utils/procurement-requisitions-processor";

export default function CreateRequisition() {
  const { products: cartProducts, productDetails } = useAppSelector(
    (state) => state.products_cart,
  );
  const { services: cartServices, serviceDetails } = useAppSelector(
    (state) => state.services_cart,
  );
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

  const {
    products: catalogueProducts,
    productsLoading: catalogueProductsLoading,
  } = useAppSelector((state: RootState) => state.products);
  const {
    services: catalogueServices,
    servicesLoading: catalogueServicesLoading,
  } = useAppSelector((state: RootState) => state.services);

  const [internalSearch, setInternalSearch] = useState("");
  const [selectedInternalItem, setSelectedInternalItem] = useState<{
    id: number;
    type: "product" | "service";
  } | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<
    Record<string, CustomFieldValueType>
  >({});
  const [activeModalTab, setActiveModalTab] = useState<string | null>("new");

  const { users } = useAppSelector((state: RootState) => state.merchants);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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

  const selectedUser = users.find(
    (user) => user.id.toString() === selectedReceiver,
  );

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
  const [editingService, setEditingService] = useState<CartService | null>(
    null,
  );
  const [editServiceQuantity, setEditServiceQuantity] = useState(1);
  const [editServiceFormData, setEditServiceFormData] = useState<
    Record<string, CustomFieldValueType>
  >({});
  const [editServiceLoading, setEditServiceLoading] = useState(false);

  const addItem = async () => {
    if (selectedInternalItem !== null) {
      setAddItemLoading(true);
      try {
        if (selectedInternalItem.type === "product") {
          await dispatch(
            addProductToCart({
              product_id: selectedInternalItem.id,
              quantity: itemQuantity,
            }),
          ).unwrap();
          await dispatch(getCartProduct(selectedInternalItem.id));
        } else {
          const custom_values: CustomFieldValue[] = Object.entries(
            customFieldValues,
          )
            .filter(([, v]) => v !== "" && v !== null && v !== undefined)
            .map(([field_id, value]) => ({ field_id, value }));
          await dispatch(
            addServiceToCart({
              service_id: selectedInternalItem.id,
              quantity: itemQuantity,
              custom_values,
            }),
          ).unwrap();
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

  const requisitionForm = useForm({
    mode: "controlled",
    initialValues: {
      title: "",
      priority: "medium",
      justification: "",
      cost_center_id: null,
      project_id: null,
      location_id: null,
      custom_receiver_name: "",
      custom_receiver_phone: "",
      custom_receiver_email: "",
      custom_delivery_point: "",
      custom_delivery_address: "",
      delivery_date: "",
      delivery_instructions: "",
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),

      priority: (value) =>
        ["low", "medium", "high", "urgent"].includes(value)
          ? null
          : "Invalid priority",
      delivery_date: (value) => {
        if (!value) return "Delivery date is required";
      },
    },
  });

  // Step-specific validation
  const validateCurrentStep = (step: number) => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      // Request Details step - validate title and priority
      if (!requisitionForm.values.title.trim()) {
        errors.title = "Title is required";
      }
      if (
        !["low", "medium", "high", "urgent"].includes(
          requisitionForm.values.priority,
        )
      ) {
        errors.priority = "Invalid priority";
      }
    } else if (step === 1) {
      // Delivery Details step
      if (useCustomDelivery) {
        // Custom delivery - validate custom receiver fields
        if (!requisitionForm.values.custom_receiver_name?.trim()) {
          errors.custom_receiver_name = "Receiver name is required";
        }
        if (!requisitionForm.values.custom_receiver_phone?.trim()) {
          errors.custom_receiver_phone = "Receiver phone is required";
        }
        if (!requisitionForm.values.custom_receiver_email?.trim()) {
          errors.custom_receiver_email = "Receiver email is required";
        }
        if (!requisitionForm.values.custom_delivery_address?.trim()) {
          errors.custom_delivery_address = "Delivery address is required";
        }
      } else {
        // Standard delivery - validate delivery date and location
        if (!requisitionForm.values.location_id) {
          errors.location_id = "Delivery location is required";
        }
        if (!requisitionForm.values.delivery_date) {
          errors.delivery_date = "Delivery date is required";
        }
      }
    }
    // Step 2 (Review & Submit) doesn't need validation as it's just a summary

    return {
      hasErrors: Object.keys(errors).length > 0,
      errors,
    };
  };

  return (
    <Stack gap="lg">
      <PageHeader />

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <CreateRequisitionSteps
          active={active}
          setActive={setActive}
          useCustomDelivery={useCustomDelivery}
          setUseCustomDelivery={setUseCustomDelivery}
          users={users}
          selectedReceiver={selectedReceiver}
          setSelectedReceiver={setSelectedReceiver}
          selectedUser={selectedUser}
          items={items}
          setAddItemModalOpen={setAddItemModalOpen}
          viewingService={viewingService}
          setViewingService={setViewingService}
          updateItemQuantity={updateItemQuantity}
          removeItem={removeItem}
          setEditingService={setEditingService}
          setEditServiceQuantity={setEditServiceQuantity}
          subtotal={subtotal}
          tax={tax}
          total={total}
          setEditServiceFormData={setEditServiceFormData}
          setEditServiceModalOpen={setEditServiceModalOpen}
          requisitionForm={requisitionForm}
        />

        {active < 3 && (
          <Group justify="space-between" mt="xl">
            <Button
              variant="default"
              onClick={() => setActive(active - 1)}
              disabled={active === 0}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (active === 2) {
                  // Final submission - validate all steps first
                  const allValidations = [0, 1, 2].map((step) =>
                    validateCurrentStep(step),
                  );
                  const hasAnyErrors = allValidations.some((v) => v.hasErrors);

                  if (hasAnyErrors) {
                    const allErrors = allValidations.flatMap((v) =>
                      Object.values(v.errors),
                    );
                    notifications.show({
                      title: "Validation Error",
                      message:
                        allErrors[0] || "Please fill all required fields",
                      color: "red",
                    });
                    return;
                  }

                  // Process the requisition
                  requisitionForm.onSubmit(async (values) => {
                    try {
                      // Prepare requisition data
                      const requisitionData = {
                        ...values,
                        items: items.map((item) => ({
                          id: item.id,
                          name: item.name,
                          quantity: item.quantity,
                          price: item.price,
                          category: item.category,
                          description: item.description,
                          custom_values: item.custom_values,
                          isNew: item.isNew,
                          addToCatalogue: item.addToCatalogue,
                        })),
                        cartProducts,
                        cartServices,
                        useCustomDelivery,
                        selectedUser,
                        totals: {
                          subtotal,
                          tax,
                          total,
                        },
                      };

                      console.log("📋 Requisition Data:", requisitionData);

                      const processedItems = items.map((item) => ({
                        id: item.id,
                        name: item.name,
                        category: item.category || "Unknown",
                        quantity: item.quantity,
                        unitPrice: item.price,
                        totalPrice: item.price * item.quantity,
                      }));

                      const procurementResult =
                        await ProcurementProcessor.processRequisition(
                          `REQ-${Date.now()}`,
                          processedItems,
                        );

                      console.log(
                        "🔄 Procurement Processing Result:",
                        procurementResult,
                      );

                      // Show success notification
                      notifications.show({
                        title: "Requisition Submitted Successfully",
                        message: `Requisition created with ${procurementResult.inStockItems.length} items available in stock and ${procurementResult.outOfStockItems.length} items requiring RFQ.`,
                        color: "green",
                      });

                      // Move to completion step
                      setActive(3);
                    } catch (error) {
                      console.error("Failed to process requisition:", error);
                      notifications.show({
                        title: "Submission Failed",
                        message:
                          "An error occurred while processing your requisition. Please try again.",
                        color: "red",
                      });
                    }
                  })();
                } else {
                  const validation = validateCurrentStep(active);

                  if (validation.hasErrors) {
                    const firstError = Object.values(validation.errors)[0];

                    notifications.show({
                      title: "Validation Error",
                      message: firstError || "Please fill all required fields",
                      color: "red",
                    });

                    return;
                  }

                  setActive(active + 1);
                }
              }}
            >
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
            {(editingService.service.category.custom_fields?.length ?? 0) >
              0 && (
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
              <Button
                variant="outline"
                onClick={() => setEditServiceModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                loading={editServiceLoading}
                onClick={async () => {
                  setEditServiceLoading(true);
                  try {
                    const custom_values: CustomFieldValue[] = Object.entries(
                      editServiceFormData,
                    )
                      .filter(
                        ([, v]) => v !== "" && v !== null && v !== undefined,
                      )
                      .map(([field_id, value]) => ({ field_id, value }));
                    await dispatch(
                      updateCartService({
                        service_id: editingService.service.id,
                        quantity: editServiceQuantity,
                        custom_values,
                      }),
                    ).unwrap();
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
            setSelectedCatalogueItem(
              value === "suppliers" ? "suppliers" : null,
            );
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
              <Tabs
                value={itemType}
                onChange={(v) => {
                  setItemType(v);
                  setSelectedInternalItem(null);
                  setCustomFieldValues({});
                }}
              >
                <Tabs.List>
                  <Tabs.Tab
                    value="goods"
                    leftSection={<IconPackage size={16} />}
                  >
                    Products
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
                    placeholder="Search products..."
                    leftSection={<IconSearch size={16} />}
                    mb="md"
                    value={internalSearch}
                    onChange={(e) => setInternalSearch(e.currentTarget.value)}
                  />
                  {catalogueProductsLoading ? (
                    <Group justify="center" py="md">
                      <Loader size="sm" />
                    </Group>
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
                          .filter((p: Product) =>
                            p.name
                              .toLowerCase()
                              .includes(internalSearch.toLowerCase()),
                          )
                          .map((p: Product) => (
                            <Table.Tr
                              key={p.id}
                              style={{
                                cursor: "pointer",
                                backgroundColor:
                                  selectedInternalItem?.id === p.id &&
                                  selectedInternalItem?.type === "product"
                                    ? "var(--mantine-color-blue-0)"
                                    : undefined,
                              }}
                              onClick={() =>
                                setSelectedInternalItem({
                                  id: p.id,
                                  type: "product",
                                })
                              }
                            >
                              <Table.Td>
                                <Text fw={500} size="sm">
                                  {p.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {p.id}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Badge variant="light" size="sm">
                                  {p.category?.name}
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm" fw={600} c="cyan">
                                  {formatCurrency(Number(p.base_price))}
                                </Text>
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
                    <Group justify="center" py="md">
                      <Loader size="sm" />
                    </Group>
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
                          .filter((s: Service) =>
                            s.name
                              .toLowerCase()
                              .includes(internalSearch.toLowerCase()),
                          )
                          .map((s: Service) => (
                            <Table.Tr
                              key={s.id}
                              style={{
                                cursor: "pointer",
                                backgroundColor:
                                  selectedInternalItem?.id === s.id &&
                                  selectedInternalItem?.type === "service"
                                    ? "var(--mantine-color-blue-0)"
                                    : undefined,
                              }}
                              onClick={() => {
                                setSelectedInternalItem({
                                  id: s.id,
                                  type: "service",
                                });
                                setCustomFieldValues({});
                              }}
                            >
                              <Table.Td>
                                <Text fw={500} size="sm">
                                  {s.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {s.id}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Badge variant="light" size="sm">
                                  {s.category?.name}
                                </Badge>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm" fw={600} c="cyan">
                                  {formatCurrency(Number(s.base_price))}
                                </Text>
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
                    const svc = catalogueServices.find(
                      (s: Service) => s.id === selectedInternalItem.id,
                    );
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
