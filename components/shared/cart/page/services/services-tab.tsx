import {
  getCartService,
  getCartServices,
  removeCartService,
  updateCartServiceQuantity,
} from "@/lib/redux/features/services/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  computeTax,
  computeTotal,
  computeSubtotal,
  formatCurrency,
} from "@/components/shared/catalogue/services/utils/constants";
import {
  ActionIcon,
  Badge,
  Center,
  Group,
  Loader,
  NumberInput,
  Paper,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import ServiceViewSkeleton from "./service-view-skeleton";

const ServiceView = ({
  item,
  setEditModalOpen,
  setSelectedItem,
}: {
  item: RawCartService;
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedItem: Dispatch<SetStateAction<CartService | null>>;
}) => {
  const dispatch = useAppDispatch();
  const service = useAppSelector(
    (state) => state.services_cart.serviceDetails[item.service_id],
  );
  const serviceLoading = useAppSelector(
    (state) => state.services_cart.serviceDetailsLoading[item.service_id] ?? true,
  );

  useEffect(() => {
    dispatch(getCartService(item.service_id));
  }, [dispatch, item.service_id]);

  const handleQuantityChange = (value: string | number) => {
    const quantity = Number(value);
    if (quantity > 0)
      dispatch(updateCartServiceQuantity({ service_id: item.service_id, quantity }));
  };

  const handleRemove = () => {
    dispatch(removeCartService(item.service_id));
  };

  if (serviceLoading || !service) return <ServiceViewSkeleton />;

  const unitTotal = computeTotal(service);
  const taxAmount = computeTax(service);
  const unitSubtotal = computeSubtotal(service);
  const isInclusive = service.sellable?.tax_type === "inclusive";
  const isTaxable = service.sellable?.tax_status === "taxable" && taxAmount > 0;

  return (
    <Paper
      p="md"
      withBorder
      style={{ cursor: "pointer" }}
      onClick={() => {
        setSelectedItem({ service, quantity: item.quantity, custom_values: item.custom_values });
        setEditModalOpen(true);
      }}
    >
      <Stack gap="xs">
        <div>
          <Text fw={600} size="sm">
            {service.name}
          </Text>
          <Text size="xs" c="dimmed">
            {service.id} • {service.category.name}
          </Text>
          <Group justify="space-between" align="flex-start">
            <div>
              {service.sellable?.suppliers?.[0] && (
                <Text size="xs" c="dimmed" mt={4}>
                  Supplier: {service.sellable.suppliers[0].company_name}
                </Text>
              )}
              {service.description && (
                <Text size="xs" c="dimmed" mt={2}>
                  {service.description}
                </Text>
              )}
            </div>
            <Badge size="xs" variant="light" color="blue">
              Click to edit
            </Badge>
          </Group>
        </div>

        <Group justify="space-between" align="flex-end">
          <Group gap="md">
            <div>
              <Text size="xs" c="dimmed" mb={4}>
                Quantity
              </Text>
              <NumberInput
                value={item.quantity}
                min={1}
                max={100}
                w={100}
                size="xs"
                onClick={(e) => e.stopPropagation()}
                onChange={handleQuantityChange}
              />
            </div>
            <div>
              <Text size="xs" c="dimmed" mb={4}>
                Unit Price
              </Text>
              <Text size="sm" fw={600}>
                {formatCurrency(unitSubtotal)}
              </Text>
              {isTaxable && (
                <Text size="xs" c="dimmed" mt={2}>
                  +{formatCurrency(taxAmount)} tax ({isInclusive ? "incl." : "excl."})
                </Text>
              )}
            </div>
            <div>
              <Text size="xs" c="dimmed" mb={4}>
                Total
              </Text>
              <Text size="sm" fw={700} c="cyan">
                {formatCurrency(unitTotal * item.quantity)}
              </Text>
              {isTaxable && (
                <Text size="xs" c="dimmed">
                  incl. {formatCurrency(taxAmount * item.quantity)} tax
                </Text>
              )}
            </div>
          </Group>

          <ActionIcon
            variant="subtle"
            color="red"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Group>
      </Stack>
    </Paper>
  );
};

const ServicesTab = ({
  setEditModalOpen,
  setSelectedItem,
}: {
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedItem: Dispatch<SetStateAction<CartService | null>>;
}) => {
  const dispatch = useAppDispatch();
  const { services, servicesLoading } = useAppSelector(
    (state) => state.services_cart,
  );

  useEffect(() => {
    dispatch(getCartServices());
  }, [dispatch]);

  if (servicesLoading)
    return (
      <Tabs.Panel value="services" pt="md">
        <Center py="xl">
          <Loader />
        </Center>
      </Tabs.Panel>
    );

  return (
    <Tabs.Panel value="services" pt="md">
      <Stack gap="md">
        {services.map((item) => (
          <ServiceView
            key={item.service_id}
            item={item}
            setEditModalOpen={setEditModalOpen}
            setSelectedItem={setSelectedItem}
          />
        ))}
      </Stack>
    </Tabs.Panel>
  );
};

export default ServicesTab;
