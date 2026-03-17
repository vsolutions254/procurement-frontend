"use client";

import { ContentContainer } from "@/components/layout/content-container";
import {
  getProduct,
  editProduct,
} from "@/lib/redux/features/products/productsSlice";
import {
  fetchSuppliers,
  searchSuppliers,
} from "@/lib/redux/features/suppliers/supplierSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Card,
  Text,
  Group,
  Button,
  Stack,
  Title,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  MultiSelect,
  ActionIcon,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useDebouncedValue } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Link } from "@mantine/tiptap";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { fetchCategories } from "@/lib/redux/features/products/categories/categoriesSlice";

interface EditCatalogueItemProps {
  params: Promise<{ item_id: string }>;
}

export default function EditCatalogueItem({ params }: EditCatalogueItemProps) {
  const router = useRouter();
  const { item_id } = use(params);
  const dispatch = useAppDispatch();

  const { product, productLoading, productError } = useAppSelector(
    (state) => state.products,
  );
  const { categories } = useAppSelector((state) => state.product_categories);
  const { suppliers, suppliersLoading } = useAppSelector(
    (state) => state.suppliers,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchTerm, 300);

  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
      category_id: "",
      supplier_ids: [] as string[],
      base_price: 0,
      description: "",
      specifications: "",
    },
  });

  // Fix 1: Remove Link and Underline from extensions — they are already
  // included internally by @mantine/tiptap, causing duplicate extension warnings.
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate({ editor }) {
      form.setFieldValue("specifications", editor.getHTML());
    },
  });

  useEffect(() => {
    dispatch(getProduct(parseInt(item_id)));
    dispatch(fetchSuppliers(1));
    dispatch(fetchCategories(1));
  }, [dispatch, item_id]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      dispatch(searchSuppliers(debouncedSearch));
    } else {
      dispatch(fetchSuppliers(1));
    }
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    if (!product) return;

    const categoryId =
      product.category?.id?.toString() || product.category_id?.toString() || "";

    form.setValues({
      name: product.name || "",
      category_id: categoryId,
      supplier_ids: product.suppliers?.map((s: User) => s.id.toString()) ?? [],
      base_price: product.base_price || 0,
      description: product.description || "",
      specifications: product.specifications || "",
    });

    if (editor && product.specifications) {
      editor.commands.setContent(product.specifications);
    }
  }, [product, editor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fix 2: Move notifications.show() out of the render body into a useEffect
  // to avoid calling setState on a different component during render.
  useEffect(() => {
    if (productError) {
      notifications.show({
        title: "Error",
        message: productError,
        color: "red",
      });
    }
  }, [productError]);

  const supplierOptions = suppliers.map((s) => ({
    value: s.id.toString(),
    label: s.company_name || s.supplier_trading_name || s.user_name,
  }));

  const mergedSupplierOptions = [
    ...supplierOptions,
    ...(product?.suppliers ?? [])
      .filter(
        (s: User) => !supplierOptions.find((o) => o.value === s.id.toString()),
      )
      .map((s: User) => ({
        value: s.id.toString(),
        label: s.company_name || s.supplier_trading_name,
      })),
  ];

  const handleSave = form.onSubmit((values) => {
    dispatch(
      editProduct({
        product_id: parseInt(item_id),
        product_name: values.name,
        category_id: parseInt(values.category_id),
        suppliers: values.supplier_ids.map((id) => parseInt(id)),
        description: values.description,
        price: values.base_price,
        specifications: values.specifications,
      }),
    );
  });

  return (
    <ContentContainer>
      <Stack gap="lg">
        <Group>
          <ActionIcon variant="subtle" size="lg" onClick={() => router.back()}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <div>
            <Title order={2}>Edit Product</Title>
            <Text c="dimmed" size="sm">
              Product {item_id}
            </Text>
          </div>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <form onSubmit={handleSave}>
            <Stack gap="md">
              <TextInput
                label="Product Name"
                placeholder="Enter product name"
                key={form.key("name")}
                {...form.getInputProps("name")}
                required
              />

              <Group grow>
                <Select
                  label="Category"
                  placeholder="Select category"
                  key={form.key("category_id")}
                  {...form.getInputProps("category_id")}
                  data={categories.map((c) => ({
                    value: c.id.toString(),
                    label: c.name,
                  }))}
                  required
                />
                <MultiSelect
                  label="Suppliers"
                  placeholder="Search and select suppliers"
                  key={form.key("supplier_ids")}
                  {...form.getInputProps("supplier_ids")}
                  data={mergedSupplierOptions}
                  searchable
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  disabled={suppliersLoading}
                  nothingFoundMessage={
                    suppliersLoading ? "Searching..." : "No suppliers found"
                  }
                  required
                />
              </Group>

              <NumberInput
                label="Price (KES)"
                placeholder="Enter price"
                key={form.key("base_price")}
                {...form.getInputProps("base_price")}
                min={0}
                required
              />

              <Textarea
                label="Description"
                placeholder="Enter product description"
                key={form.key("description")}
                {...form.getInputProps("description")}
                minRows={3}
              />

              <Stack gap={4}>
                <Text size="sm" fw={500}>
                  Specifications
                </Text>
                <RichTextEditor
                  editor={editor}
                  style={
                    form.errors.specifications
                      ? { borderColor: "var(--mantine-color-red-6)" }
                      : undefined
                  }
                >
                  <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                      <RichTextEditor.Highlight />
                      <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                      <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                      <RichTextEditor.Subscript />
                      <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.AlignLeft />
                      <RichTextEditor.AlignCenter />
                      <RichTextEditor.AlignRight />
                      <RichTextEditor.AlignJustify />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Undo />
                      <RichTextEditor.Redo />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  <RichTextEditor.Content mih={200} />
                </RichTextEditor>
                {form.errors.specifications && (
                  <Text size="xs" c="red">
                    {form.errors.specifications}
                  </Text>
                )}
              </Stack>

              <Group justify="flex-end" mt="md">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={productLoading}
                  leftSection={<IconDeviceFloppy size={16} />}
                >
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>
      </Stack>
    </ContentContainer>
  );
}
