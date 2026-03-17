"use client";

import { ContentContainer } from "@/components/layout/content-container";
import {
  getService,
  editService,
} from "@/lib/redux/features/services/servicesSlice";
import { fetchSuppliers } from "@/lib/redux/features/suppliers/supplierSlice";
import { fetchServiceCategories } from "@/lib/redux/features/services/categories/serviceCategoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

interface EditServicePageProps {
  params: Promise<{ service_id: string }>;
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter();
  const { service_id } = use(params);
  const dispatch = useAppDispatch();

  const { service, serviceLoading } = useAppSelector((state) => state.services);
  const { categories } = useAppSelector((state) => state.service_categories);
  const { suppliers } = useAppSelector((state) => state.suppliers);

  const form = useForm<CreateServiceFormData>({
    mode: "controlled",
    initialValues: {
      service_name: "",
      description: "",
      base_price: 0,
      category_id: 0,
      supplier_ids: [],
      tax_status: "taxable",
      tax_type: "inclusive",
      tax_method: "percentage",
      tax_value_type: "percentage",
      tax_value: 16,
      specifications: "",
      service_terms: "",
    },
  });

  const serviceTermsEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: ({ editor }) => form.setFieldValue("service_terms", editor.getHTML()),
  });

  const specificationsEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: ({ editor }) => form.setFieldValue("specifications", editor.getHTML()),
  });

  useEffect(() => {
    dispatch(getService(parseInt(service_id)));
    dispatch(fetchSuppliers(1));
    dispatch(fetchServiceCategories(1));
  }, [dispatch, service_id]);

  useEffect(() => {
    if (!service) return;

    form.setValues({
      service_name: service.name ?? "",
      description: service.description ?? "",
      base_price: service.base_price ?? 0,
      category_id: service.category?.id ?? 0,
      supplier_ids: service.sellable?.suppliers?.map((s: User) => s.id.toString()) ?? [],
      tax_status: service.sellable?.tax_status ?? "taxable",
      tax_type: service.sellable?.tax_type ?? "inclusive",
      tax_method: "percentage",
      tax_value_type: service.sellable?.tax_value_type ?? "percentage",
      tax_value: service.sellable?.tax?.rate ?? service.sellable?.tax_value ?? 16,
      specifications: service.specifications ?? "",
      service_terms: service.service_terms ?? "",
    });

    if (serviceTermsEditor && service.service_terms) {
      serviceTermsEditor.commands.setContent(service.service_terms);
    }
    if (specificationsEditor && service.specifications) {
      specificationsEditor.commands.setContent(service.specifications);
    }
  }, [service, serviceTermsEditor, specificationsEditor]); // eslint-disable-line react-hooks/exhaustive-deps

  const supplierOptions = suppliers.map((s) => ({
    value: s.id.toString(),
    label: s.company_name || s.supplier_trading_name || s.user_name,
  }));

  const mergedSupplierOptions = [
    ...supplierOptions,
    ...(service?.sellable?.suppliers ?? [])
      .filter((s: User) => !supplierOptions.find((o) => o.value === s.id.toString()))
      .map((s: User) => ({
        value: s.id.toString(),
        label: s.company_name || s.supplier_trading_name || s.user_name,
      })),
  ];

  const handleSave = form.onSubmit(async (values) => {
    try {
      await dispatch(
        editService({
          service_id: parseInt(service_id),
          service_name: values.service_name,
          category_id: values.category_id,
          suppliers: values.supplier_ids.map((id) => parseInt(id)) as number[],
          description: values.description,
          price: values.base_price,
          specifications: values.specifications,
        }),
      ).unwrap();
      notifications.show({
        title: "Success",
        message: "Service updated successfully",
        color: "green",
      });
      router.back();
    } catch (error: unknown) {
      const err = error as { errors?: Record<string, string[]>; message?: string };
      const msg =
        Object.values(err?.errors ?? {}).flat().join(". ") ||
        err?.message ||
        "Failed to update service";
      notifications.show({ title: "Error", message: msg, color: "red" });
    }
  });

  return (
    <ContentContainer>
      <Stack gap="lg">
        <Group>
          <ActionIcon variant="subtle" size="lg" onClick={() => router.back()}>
            <IconArrowLeft size={20} />
          </ActionIcon>
          <div>
            <Title order={2}>Edit Service</Title>
            <Text c="dimmed" size="sm">
              Service #{service_id}
            </Text>
          </div>
        </Group>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <form onSubmit={handleSave}>
            <Stack gap="md">
              <TextInput
                label="Service Name"
                placeholder="Enter service name"
                key={form.key("service_name")}
                {...form.getInputProps("service_name")}
                required
              />

              <Group grow>
                <Select
                  label="Category"
                  placeholder="Select category"
                  key={form.key("category_id")}
                  value={form.values.category_id ? form.values.category_id.toString() : null}
                  onChange={(val) =>
                    form.setFieldValue("category_id", val ? parseInt(val) : 0)
                  }
                  error={form.errors.category_id}
                  data={categories.map((c) => ({
                    value: c.id.toString(),
                    label: c.name,
                  }))}
                  searchable
                  required
                />
                <MultiSelect
                  label="Suppliers"
                  placeholder="Select suppliers"
                  key={form.key("supplier_ids")}
                  {...form.getInputProps("supplier_ids")}
                  data={mergedSupplierOptions}
                  searchable
                  required
                />
              </Group>

              <NumberInput
                label="Base Price (KES)"
                placeholder="0"
                key={form.key("base_price")}
                {...form.getInputProps("base_price")}
                min={0}
                prefix="From KES "
                thousandSeparator=","
                required
              />

              <Textarea
                label="Description"
                placeholder="Enter service description"
                key={form.key("description")}
                {...form.getInputProps("description")}
                minRows={3}
              />

              <Stack gap={4}>
                <Text size="sm" fw={500}>
                  Service Terms
                </Text>
                {!serviceTermsEditor ? (
                  <Group justify="center" p="xl">
                    <Loader size="sm" />
                  </Group>
                ) : (
                  <RichTextEditor editor={serviceTermsEditor}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
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
                      </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content mih={150} />
                  </RichTextEditor>
                )}
              </Stack>

              <Stack gap={4}>
                <Text size="sm" fw={500}>
                  Specifications
                </Text>
                {!specificationsEditor ? (
                  <Group justify="center" p="xl">
                    <Loader size="sm" />
                  </Group>
                ) : (
                  <RichTextEditor editor={specificationsEditor}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                      </RichTextEditor.ControlsGroup>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                      </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content mih={150} />
                  </RichTextEditor>
                )}
              </Stack>

              <Group justify="flex-end" mt="md">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={serviceLoading}
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
