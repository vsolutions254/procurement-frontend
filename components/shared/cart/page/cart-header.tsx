import { clearCart } from "@/lib/redux/features/products/cart/cartSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";

const CartHeader = ({ total_items }: { total_items: number }) => {
  const dispatch = useAppDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClearCart = async () => {
    setLoading(true);
    try {
      await dispatch(clearCart()).unwrap();
      setConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Cart Items ({total_items})
        </Text>
        <Button
          variant="subtle"
          color="red"
          size="xs"
          leftSection={<IconTrash size={14} />}
          onClick={() => setConfirmOpen(true)}
        >
          Clear Cart
        </Button>
      </Group>

      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Clear Cart"
        size="sm"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            Are you sure you want to remove all items from your cart? This cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button color="red" leftSection={<IconTrash size={14} />} onClick={handleClearCart} loading={loading}>
              Clear Cart
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default CartHeader;
