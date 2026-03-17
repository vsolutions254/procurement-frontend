import { useAppSelector } from "@/lib/redux/hooks";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
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

interface ProductGridViewProps {
  addProductToCart: (item: CartProduct) => Promise<void>;
}

const ProductGridView = ({
  addProductToCart,
}: ProductGridViewProps) => {
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

      <Grid gutter="md">
        {products.map((item: Product) => (
          <Grid.Col key={item.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Card.Section style={{ position: "relative" }}>
                <Image
                  src={
                    item.image
                      ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/storage/${item.image}`
                      : "/placeholder.svg"
                  }
                  height={180}
                  alt={item.name}
                />

                <Group
                  gap="xs"
                  style={{ position: "absolute", top: 8, right: 8 }}
                >
                  <ActionIcon variant="filled" color="blue" size="sm">
                    <Link href={`/application/catalogue/products/${item.id}`}>
                      <IconEye size={16} />
                    </Link>
                  </ActionIcon>

                  <ActionIcon variant="filled" color="orange" size="sm">
                    <Link
                      href={`/application/catalogue/products/${item.id}/edit`}
                    >
                      <IconEdit size={16} />
                    </Link>
                  </ActionIcon>

                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="sm"
                    onClick={() => handleDeleteClick(item.id, item.name)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Card.Section>

              <Stack gap="xs" mt="md">
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Text fw={600} size="sm" lineClamp={2}>
                      {item.name}
                    </Text>

                    <Badge variant="light" size="xs" mt={4}>
                      {typeof item.category === "object"
                        ? item.category.name
                        : item.category}
                    </Badge>

                    <Text size="xs" c="dimmed" mt={4}>
                      {item.product_code ?? item.id}
                    </Text>
                  </div>

                  <ActionIcon variant="subtle" color="gray">
                    <IconHeart size={18} />
                  </ActionIcon>
                </Group>

                <Text size="xs" c="dimmed" lineClamp={2}>
                  {item.description}
                </Text>

                <Group justify="space-between" mt="xs">
                  <div>
                    <Text size="xs" c="dimmed">
                      Suppliers
                    </Text>

                    <Text size="xs" fw={500}>
                      {item.suppliers?.length
                        ? item.suppliers
                            .slice(0, 3)
                            .map((s: User) => s.company_name)
                            .join(", ")
                        : "No suppliers"}
                    </Text>
                  </div>

                  <Text size="lg" fw={700} c="cyan">
                    KES {item.base_price?.toLocaleString()}
                  </Text>
                </Group>

                <Group grow mt="md" gap="xs">
                  <Button
                    loading={loadingId === item.id}
                    leftSection={<IconShoppingCart size={16} />}
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};

export default ProductGridView;
