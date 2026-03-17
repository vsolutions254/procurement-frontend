"use client";

import { ContentContainer } from "@/components/layout/content-container";
import CartItems from "@/components/shared/cart/page/cart-items";
import PageHeader from "@/components/shared/cart/page/page-header";
import {
  computeTax,
  computeTotal,
  computeSubtotal,
  formatCurrency,
} from "@/components/shared/catalogue/services/utils/constants";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Text,
  Group,
  Button,
  Stack,
  NumberInput,
  Divider,
  Paper,
  Modal,
  Checkbox,
  Badge,
  Tabs,
} from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import CustomFieldsForm from "@/components/shared/catalogue/custom-fields-form";
import { getCartProducts } from "@/lib/redux/features/products/cart/cartSlice";
import { getCartServices, updateCartService } from "@/lib/redux/features/services/cart/cartSlice";

export default function CartPage() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [proceedModalOpen, setProceedModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartService | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, CustomFieldValueType>>({});
  const [editQuantity, setEditQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const { products } = useAppSelector((state) => state.products_cart);
  const { services, serviceDetails } = useAppSelector((state) => state.services_cart);
  const { productDetails } = useAppSelector((state) => state.products_cart);

  useEffect(() => {
    dispatch(getCartProducts());
    dispatch(getCartServices());
  }, [dispatch]);

  useEffect(() => {
    if (selectedItem) {
      setEditQuantity(selectedItem.quantity);
      const record: Record<string, CustomFieldValueType> = {};
      (selectedItem.custom_values ?? []).forEach(({ field_id, value }) => {
        record[field_id] = value;
      });
      setEditFormData(record);
    }
  }, [selectedItem]);

  const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number>>(new Set());

  // Pre-select all items when modal opens
  useEffect(() => {
    if (proceedModalOpen) {
      setSelectedProductIds(new Set(products.map((p) => p.product_id)));
      setSelectedServiceIds(new Set(services.map((s) => s.service_id)));
    }
  }, [proceedModalOpen, products, services]);

  const toggleProduct = (id: number) =>
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });

  const toggleService = (id: number) =>
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });

  const selectedSubtotal =
    products
      .filter((p) => selectedProductIds.has(p.product_id))
      .reduce((sum, p) => {
        const d = productDetails[p.product_id];
        return sum + (d ? computeSubtotal(d) * p.quantity : 0);
      }, 0) +
    services
      .filter((s) => selectedServiceIds.has(s.service_id))
      .reduce((sum, s) => {
        const d = serviceDetails[s.service_id];
        return sum + (d ? computeSubtotal(d) * s.quantity : 0);
      }, 0);

  const selectedTax =
    products
      .filter((p) => selectedProductIds.has(p.product_id))
      .reduce((sum, p) => {
        const d = productDetails[p.product_id];
        return sum + (d ? computeTax(d) * p.quantity : 0);
      }, 0) +
    services
      .filter((s) => selectedServiceIds.has(s.service_id))
      .reduce((sum, s) => {
        const d = serviceDetails[s.service_id];
        return sum + (d ? computeTax(d) * s.quantity : 0);
      }, 0);

  const selectedCount = selectedProductIds.size + selectedServiceIds.size;

  const productSubtotal = products.reduce((sum, item) => {
    const product = productDetails[item.product_id];
    if (!product) return sum;
    return sum + computeSubtotal(product) * item.quantity;
  }, 0);

  const productTax = products.reduce((sum, item) => {
    const product = productDetails[item.product_id];
    if (!product) return sum;
    return sum + computeTax(product) * item.quantity;
  }, 0);

  const serviceSubtotal = services.reduce((sum, item) => {
    const service = serviceDetails[item.service_id];
    if (!service) return sum;
    return sum + computeSubtotal(service) * item.quantity;
  }, 0);

  const serviceTax = services.reduce((sum, item) => {
    const service = serviceDetails[item.service_id];
    if (!service) return sum;
    return sum + computeTax(service) * item.quantity;
  }, 0);

  const subtotal = productSubtotal + serviceSubtotal;
  const tax = productTax + serviceTax;
  const total = subtotal + tax;

  const totalItems = products.length + services.length;

  return (
    <ContentContainer>
      <Stack gap="lg">
        <PageHeader />

        <CartItems
          totalItems={totalItems}
          setEditModalOpen={setEditModalOpen}
          setSelectedItem={setSelectedItem}
          subtotal={subtotal}
          tax={tax}
          setProceedModalOpen={setProceedModalOpen}
          total={total}
        />

        <Modal
          opened={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Edit Booking - ${selectedItem?.service.name}`}
          size="lg"
        >
          {selectedItem && (
            <Stack gap="md">
              <NumberInput
                label="Quantity"
                min={1}
                max={100}
                value={editQuantity}
                onChange={(val) => setEditQuantity(Number(val) || 1)}
              />

              {selectedItem.service.category.custom_fields &&
                selectedItem.service.category.custom_fields.length > 0 && (
                  <CustomFieldsForm
                    customFields={selectedItem.service.category.custom_fields}
                    formData={editFormData}
                    setFormData={setEditFormData}
                  />
                )}

              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  leftSection={<IconDeviceFloppy size={16} />}
                  onClick={async () => {
                    if (!selectedItem) return;
                    const custom_values: CustomFieldValue[] = Object.entries(editFormData).map(
                      ([field_id, value]) => ({ field_id, value }),
                    );
                    await dispatch(
                      updateCartService({
                        service_id: selectedItem.service.id,
                        quantity: editQuantity,
                        custom_values,
                      }),
                    );
                    setEditModalOpen(false);
                  }}
                >
                  Save Booking
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>

        <Modal
          opened={proceedModalOpen}
          onClose={() => setProceedModalOpen(false)}
          title="Proceed to Requisition"
          size="lg"
          centered
          styles={{ body: { overflowY: "auto", maxHeight: "80vh" } }}
        >
          <Stack gap="md">
            <Tabs defaultValue="products">
              <Tabs.List>
                <Tabs.Tab value="products">
                  Products ({products.length})
                </Tabs.Tab>
                <Tabs.Tab value="services">
                  Services ({services.length})
                </Tabs.Tab>
                <Tabs.Tab value="recommended">
                  Recommended
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="products" pt="md">
                  <Stack gap="xs">
                    {products.length === 0 ? (
                      <Text size="sm" c="dimmed" ta="center" py="md">No products in cart.</Text>
                    ) : products.map((item) => {
                      const p = productDetails[item.product_id];
                      const taxAmt = p ? computeTax(p) * item.quantity : 0;
                      const lineTotal = p ? computeTotal(p) * item.quantity : 0;
                      const isTaxable = p?.sellable?.tax_status === "taxable" && taxAmt > 0;
                      const isInclusive = p?.sellable?.tax_type === "inclusive";
                      return (
                        <Paper key={item.product_id} p="sm" withBorder>
                          <Group justify="space-between" wrap="nowrap">
                            <Group wrap="nowrap" gap="sm">
                              <Checkbox
                                checked={selectedProductIds.has(item.product_id)}
                                onChange={() => toggleProduct(item.product_id)}
                              />
                              <div>
                                <Text size="sm" fw={500}>{p?.name ?? `Product #${item.product_id}`}</Text>
                                <Text size="xs" c="dimmed">Qty: {item.quantity} · {p?.category?.name}</Text>
                                {isTaxable && (
                                  <Badge size="xs" variant="dot" color={isInclusive ? "teal" : "orange"} mt={2}>
                                    Tax {isInclusive ? "incl." : "excl."} · {formatCurrency(taxAmt)}
                                  </Badge>
                                )}
                              </div>
                            </Group>
                            <Text size="sm" fw={600} style={{ whiteSpace: "nowrap" }}>
                              {formatCurrency(lineTotal)}
                            </Text>
                          </Group>
                        </Paper>
                      );
                    })}
                  </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="services" pt="md">
                  <Stack gap="xs">
                    {services.length === 0 ? (
                      <Text size="sm" c="dimmed" ta="center" py="md">No services in cart.</Text>
                    ) : services.map((item) => {
                      const s = serviceDetails[item.service_id];
                      const taxAmt = s ? computeTax(s) * item.quantity : 0;
                      const lineTotal = s ? computeTotal(s) * item.quantity : 0;
                      const isTaxable = s?.sellable?.tax_status === "taxable" && taxAmt > 0;
                      const isInclusive = s?.sellable?.tax_type === "inclusive";
                      return (
                        <Paper key={item.service_id} p="sm" withBorder>
                          <Group justify="space-between" wrap="nowrap">
                            <Group wrap="nowrap" gap="sm">
                              <Checkbox
                                checked={selectedServiceIds.has(item.service_id)}
                                onChange={() => toggleService(item.service_id)}
                              />
                              <div>
                                <Text size="sm" fw={500}>{s?.name ?? `Service #${item.service_id}`}</Text>
                                <Text size="xs" c="dimmed">Qty: {item.quantity} · {s?.category?.name}</Text>
                                {isTaxable && (
                                  <Badge size="xs" variant="dot" color={isInclusive ? "teal" : "orange"} mt={2}>
                                    Tax {isInclusive ? "incl." : "excl."} · {formatCurrency(taxAmt)}
                                  </Badge>
                                )}
                              </div>
                            </Group>
                            <Text size="sm" fw={600} style={{ whiteSpace: "nowrap" }}>
                              {formatCurrency(lineTotal)}
                            </Text>
                          </Group>
                        </Paper>
                      );
                    })}
                  </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="recommended" pt="md">
                  <Stack gap="xs">
                    {[
                      { id: "REC-001", name: "Wireless Keyboard", category: "IT Equipment", price: 4500 },
                      { id: "REC-002", name: "USB-C Hub", category: "IT Equipment", price: 3200 },
                      { id: "REC-003", name: "Desk Organizer Set", category: "Office Supplies", price: 1800 },
                      { id: "REC-004", name: "Monitor Stand", category: "Furniture", price: 6500 },
                      { id: "REC-005", name: "Ergonomic Mouse Pad", category: "Office Supplies", price: 950 },
                    ].map((item) => (
                      <Paper key={item.id} p="sm" withBorder>
                        <Group justify="space-between">
                          <div>
                            <Text size="sm" fw={500}>{item.name}</Text>
                            <Group gap="xs" mt={2}>
                              <Badge size="xs" variant="light">{item.category}</Badge>
                              <Text size="xs" c="dimmed">{item.id}</Text>
                            </Group>
                          </div>
                          <Group gap="sm">
                            <Text size="sm" fw={600} c="cyan">{formatCurrency(item.price)}</Text>
                            <Button size="xs" variant="light">Add</Button>
                          </Group>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
              </Tabs.Panel>
            </Tabs>

            <Divider />

            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Subtotal ({selectedCount} items)</Text>
                <Text size="sm" fw={500}>{formatCurrency(selectedSubtotal)}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Tax</Text>
                <Text size="sm" fw={500}>{formatCurrency(selectedTax)}</Text>
              </Group>
              <Divider />
              <Group justify="space-between">
                <Text fw={600}>Total</Text>
                <Text fw={700} c="cyan">{formatCurrency(selectedSubtotal + selectedTax)}</Text>
              </Group>
            </Stack>

            <Group justify="flex-end" mt="xs">
              <Button variant="outline" onClick={() => setProceedModalOpen(false)}>Cancel</Button>
              <Button
                onClick={() => window.location.href = "/application/requisitions/new"}
              >
                Create Requisition ({selectedCount})
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </ContentContainer>
  );
}
