import {
  fetchServiceCategories,
  createServiceCategory,
} from "@/lib/redux/features/services/categories/serviceCategoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  ActionIcon,
  Button,
  Card,
  FileInput,
  Grid,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { RichTextEditor } from "@mantine/tiptap";
import { IconUpload, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import TaxDetails from "../../../products/tax-details";
import { Editor, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import AddServiceCategoryModal from "@/components/shared/catalogue/services/categories/add-service-category-modal";

const CreateService = ({
  form,
  serviceTermsEditor,
  serviceSpecificationsEditor,
  setServiceAttachments,
  serviceAttachments,
  suppliers,
}: {
  form: UseFormReturnType<CreateServiceFormData>;
  serviceTermsEditor: Editor | null;
  serviceSpecificationsEditor: Editor | null;
  setServiceAttachments: React.Dispatch<React.SetStateAction<File[]>>;
  serviceAttachments: File[];
  suppliers: User[];
}) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.service_categories);

  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [newServiceCategory, setNewServiceCategory] = useState("");
  const [serviceCategoryDescription, setServiceCategoryDescription] =
    useState("");
  const [serviceCategoryImage, setServiceCategoryImage] = useState<File | null>(
    null,
  );
  const [serviceCategoryImagePreview, setServiceCategoryImagePreview] =
    useState<string | null>(null);
  const [serviceCategoryAttachments, setServiceCategoryAttachments] = useState<
    File[]
  >([]);
  const [isCreatingService, setIsCreatingService] = useState(false);

  const serviceEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setServiceCategoryDescription(editor.getHTML()),
  });

  useEffect(() => {
    dispatch(fetchServiceCategories(1));
  }, [dispatch]);

  const handleServiceImageUpload = (file: File | null) => {
    setServiceCategoryImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setServiceCategoryImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setServiceCategoryImagePreview(null);
    }
  };

  const handleAddServiceCategory = async (customFields: CustomField[] = []) => {
    if (!newServiceCategory.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Category name is required",
        color: "red",
      });
      return;
    }
    setIsCreatingService(true);
    try {
      await dispatch(
        createServiceCategory({
          name: newServiceCategory,
          description: serviceCategoryDescription,
          image: serviceCategoryImage,
          custom_fields: customFields,
        }),
      ).unwrap();
      notifications.show({
        title: "Success",
        message: "Service category created successfully",
        color: "green",
      });
      setNewServiceCategory("");
      setServiceCategoryDescription("");
      setServiceCategoryImage(null);
      setServiceCategoryImagePreview(null);
      setServiceCategoryAttachments([]);
      serviceEditor?.commands.setContent("<p></p>");
      setServiceModalOpen(false);
      dispatch(fetchServiceCategories(1));
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          (error as string) ??
          "Failed to create service category. Please try again.",
        color: "red",
      });
    } finally {
      setIsCreatingService(false);
    }
  };

  return (
    <Tabs.Panel value="service" pt="md">
      <AddServiceCategoryModal
        categoryModalOpen={serviceModalOpen}
        setCategoryModalOpen={setServiceModalOpen}
        categoryType="services"
        newCategory={newServiceCategory}
        setNewCategory={setNewServiceCategory}
        categoryImagePreview={serviceCategoryImagePreview}
        setCategoryImage={setServiceCategoryImage}
        setCategoryImagePreview={setServiceCategoryImagePreview}
        categoryImage={serviceCategoryImage}
        handleImageUpload={handleServiceImageUpload}
        editor={serviceEditor}
        setAttachments={setServiceCategoryAttachments}
        attachments={serviceCategoryAttachments}
        handleAddServiceCategory={handleAddServiceCategory}
        isCreating={isCreatingService}
      />

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Service Information
              </Title>
              <Stack gap="md">
                <TextInput
                  label="Service Name"
                  placeholder="e.g., Flight Booking Service"
                  key={form.key("service_name")}
                  {...form.getInputProps("service_name")}
                  required
                />
                <Grid gutter="md">
                  <Grid.Col span={6}>
                    <Group align="end" gap="xs">
                      <div style={{ flex: 1 }}>
                        <Select
                          label="Category"
                          placeholder="Select category"
                          data={(categories || []).map((category) => ({
                            value: category.id.toString(),
                            label: category.name,
                          }))}
                          key={form.key("category_id")}
                          value={
                            form.values.category_id
                              ? form.values.category_id.toString()
                              : null
                          }
                          onChange={(value) =>
                            form.setFieldValue(
                              "category_id",
                              value ? parseInt(value, 10) : 0,
                            )
                          }
                          error={form.errors.category_id}
                          searchable
                          required
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setServiceModalOpen(true)}
                      >
                        +
                      </Button>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
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
                  </Grid.Col>
                </Grid>
                <Textarea
                  label="Service Description"
                  placeholder="Detailed description of the service offered..."
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                  rows={4}
                  required
                />
                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Service Terms
                  </Text>
                  {!serviceTermsEditor ? (
                    <Group justify="center" p="xl">
                      <Loader size="sm" />
                      <Text size="sm" c="dimmed">
                        Loading editor...
                      </Text>
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
                          <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.H1 />
                          <RichTextEditor.H2 />
                          <RichTextEditor.H3 />
                          <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Blockquote />
                          <RichTextEditor.Hr />
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
                          <RichTextEditor.AlignJustify />
                          <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Control
                            onClick={() =>
                              document
                                .getElementById("service-attachment-input")
                                ?.click()
                            }
                            aria-label="Insert attachment"
                            title="Insert attachment"
                          >
                            <IconUpload size={16} />
                          </RichTextEditor.Control>
                        </RichTextEditor.ControlsGroup>
                      </RichTextEditor.Toolbar>
                      <RichTextEditor.Content style={{ minHeight: "150px" }} />
                    </RichTextEditor>
                  )}
                  <FileInput
                    id="service-attachment-input"
                    style={{ display: "none" }}
                    multiple
                    onChange={(files) => {
                      if (files) {
                        setServiceAttachments([
                          ...serviceAttachments,
                          ...files,
                        ]);
                        files.forEach((file) => {
                          const link = `<p><a href="#" data-file="${file.name}">${file.name}</a> (${(file.size / 1024).toFixed(1)} KB)</p>`;
                          serviceTermsEditor?.commands.insertContent(link);
                        });
                      }
                    }}
                  />
                  {serviceAttachments.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                      <Text size="xs" c="dimmed">
                        Attachments ({serviceAttachments.length}):
                      </Text>
                      {serviceAttachments.map((file, index) => (
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
                              setServiceAttachments(
                                serviceAttachments.filter(
                                  (_, i) => i !== index,
                                ),
                              )
                            }
                          >
                            <IconX size={12} />
                          </ActionIcon>
                        </Group>
                      ))}
                    </div>
                  )}
                </div>
              </Stack>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Service Provider
              </Title>
              <Stack gap="md">
                <MultiSelect
                  label="Select Service Providers"
                  placeholder="Choose one or more providers"
                  data={suppliers.map((supplier) => ({
                    value: supplier.id.toString(),
                    label: supplier.company_name,
                  }))}
                  key={form.key("supplier_ids")}
                  {...form.getInputProps("supplier_ids")}
                  searchable
                />
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <TaxDetails form={form} />

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Service Specifications
              </Title>
              <Stack gap="md">
                {!serviceSpecificationsEditor ? (
                  <Group justify="center" p="xl">
                    <Loader size="sm" />
                    <Text size="sm" c="dimmed">
                      Loading editor...
                    </Text>
                  </Group>
                ) : (
                  <RichTextEditor editor={serviceSpecificationsEditor}>
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
                    <RichTextEditor.Content style={{ minHeight: "150px" }} />
                  </RichTextEditor>
                )}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Tabs.Panel>
  );
};

export default CreateService;
