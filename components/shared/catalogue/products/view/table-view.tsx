import { useAppSelector } from "@/lib/redux/hooks";
import { ActionIcon, Badge, Button, Group, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEdit,
  IconEye,
  IconHeart,
  IconShoppingCart,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";
import ConfirmDeleteModal from "./confirm-delete-modal";

interface ProductTableViewProps {
  addProductToCart: (item: CartProduct) => Promise<void>;
}

const ProductTableView = ({
  addProductToCart,
}: ProductTableViewProps) => {
  const { products } = useAppSelector((state) => state.products);
  const [opened, { open, close }] = useDisclosure(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<{
    id: string | number;
    name: string;
  } | null>(null);

  const handleDeleteClick = (id: string | number, name: string) => {
    setSelectedItem({ id, name });
    open();
  };

  const handleAddToCart = async (item: Product) => {
    setLoadingId(item.id);
    await addProductToCart({ product_id: item.id, quantity: 1 });
    setLoadingId(null);
  };

  return (
    <>
      <ConfirmDeleteModal
        opened={opened}
        onClose={close}
        itemId={selectedItem?.id ?? ""}
        itemName={selectedItem?.name}
        title="Delete Product"
      />

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Supplier</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {products.map((item: Product) => (
            <React.Fragment key={item.id}>
              <Table.Tr>
                <Table.Td>
                  <Text fw={500} size="sm">
                    {item.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {item.product_code ?? item.id}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {item.description}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {typeof item.category === "object"
                      ? item.category.name
                      : item.category}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {item.suppliers?.length
                      ? item.suppliers
                          .map((s: User) => s.company_name)
                          .join(", ")
                      : "No suppliers"}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={600} c="cyan">
                    KES {item.base_price?.toLocaleString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="subtle" color="blue">
                      <Link href={`/application/catalogue/products/${item.id}`}>
                        <IconEye size={16} />
                      </Link>
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="orange">
                      <Link
                        href={`/application/catalogue/products/${item.id}/edit`}
                      >
                        <IconEdit size={16} />
                      </Link>
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="gray">
                      <IconHeart size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteClick(item.id, item.name)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Button
                    fullWidth
                    size="xs"
                    loading={loadingId === item.id}
                    leftSection={<IconShoppingCart size={14} />}
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </Table.Td>
              </Table.Tr>
            </React.Fragment>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};

export default ProductTableView;
