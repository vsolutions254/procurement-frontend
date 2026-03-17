import {
  getCartProduct,
  removeCartProduct,
  updateCartProductQuantity,
} from "@/lib/redux/features/products/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  computeTax,
  computeTotal,
  computeSubtotal,
  formatCurrency,
} from "@/components/shared/catalogue/services/utils/constants";
import { resolveImageUrl } from "@/lib/utils/helpers";
import {
  ActionIcon,
  Group,
  Image,
  NumberInput,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import React, { useEffect } from "react";
import ProductViewSkeleton from "./product-view-skeleton";

const ProductView = ({ item }: { item: CartProduct }) => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(
    (state) => state.products_cart.productDetails[item.product_id],
  );
  const productLoading = useAppSelector(
    (state) =>
      state.products_cart.productDetailsLoading[item.product_id] ?? true,
  );

  useEffect(() => {
    dispatch(getCartProduct(item.product_id));
  }, [dispatch, item.product_id]);

  const handleQuantityChange = (value: string | number) => {
    const quantity = Number(value);
    if (quantity > 0) dispatch(updateCartProductQuantity({ product_id: item.product_id, quantity }));
  };

  const handleRemove = () => {
    dispatch(removeCartProduct(item.product_id));
  };

  if (productLoading || !product) return <ProductViewSkeleton />;

  const unitTotal = computeTotal(product);
  const taxAmount = computeTax(product);
  const unitSubtotal = computeSubtotal(product);
  const isInclusive = product.sellable?.tax_type === "inclusive";
  const isTaxable = product.sellable?.tax_status === "taxable" && taxAmount > 0;

  return (
    <Paper key={item.product_id} p="md" withBorder>
      <Group align="flex-start" wrap="nowrap">
        <div style={{ width: 100, height: 100, flexShrink: 0 }}>
          <Image
            src={resolveImageUrl(product.image)}
            alt={product.name}
            fit="contain"
            radius="md"
            width="100%"
            height="100%"
          />
        </div>

        <Stack gap="xs" style={{ flex: 1 }}>
          <div>
            <Text fw={600} size="sm">
              {product.name}
            </Text>
            <Text size="xs" c="dimmed">
              {product.id} • {product.category.name}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Supplier: {product.suppliers[0].company_name}
            </Text>
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

            <ActionIcon variant="subtle" color="red" size="lg" onClick={handleRemove}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
};

export default ProductView;
