import {
  ActionIcon,
  Card,
  FileInput,
  Grid,
  Group,
  Loader,
  MultiSelect,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";
import CategoriesSelect from "../../../products/categories-select";
import { RichTextEditor } from "@mantine/tiptap";
import { IconUpload, IconX } from "@tabler/icons-react";
import Image from "next/image";
import TaxDetails from "../../../products/tax-details";

const CreateProductForm = ({
  form,
  specificationsEditor,
  setAttachments,
  attachments,
  setImagePreview,
  setImageFile,
  suppliers,
  imagePreview,
  imageFile,
  handleImageUpload,
}: {
  form: UseFormReturnType<CreateProductFormData>;
  specificationsEditor: ReturnType<
    typeof import("@tiptap/react").useEditor
  > | null;
  setAttachments: (attachments: File[]) => void;
  attachments: File[];
  setImagePreview: (preview: string | null) => void;
  setImageFile: (file: File | null) => void;
  suppliers: User[];
  imagePreview: string | null;
  imageFile: File | null;
  handleImageUpload: (file: File | null) => void;
}) => {
  return (
    <Tabs.Panel value="inventory" pt="md">
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Product Information
              </Title>
              <Stack gap="md">
                <TextInput
                  label="Product Name"
                  placeholder="e.g., Ergonomic Office Chair"
                  key={form.key("product_name")}
                  {...form.getInputProps("product_name")}
                  required
                  maxLength={125}
                />

                <CategoriesSelect form={form} />

                <Textarea
                  label="Description"
                  placeholder="Detailed description of the item..."
                  key={form.key("description")}
                  {...form.getInputProps("description")}
                  rows={4}
                  required
                  maxLength={255}
                />
                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Specifications
                  </Text>
                  {!specificationsEditor ? (
                    <Group justify="center" p="xl">
                      <Loader size="sm" />
                      <Text size="sm" c="dimmed">
                        Loading editor...
                      </Text>
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
                                .getElementById("attachment-input")
                                ?.click()
                            }
                            aria-label="Insert attachment"
                            title="Insert attachment"
                          >
                            <IconUpload size={16} />
                          </RichTextEditor.Control>
                        </RichTextEditor.ControlsGroup>
                      </RichTextEditor.Toolbar>

                      <RichTextEditor.Content style={{ minHeight: "200px" }} />
                    </RichTextEditor>
                  )}
                  <FileInput
                    id="attachment-input"
                    style={{ display: "none" }}
                    multiple
                    onChange={(files) => {
                      if (files) {
                        setAttachments([...attachments, ...files]);
                        files.forEach((file) => {
                          const link = `<p><a href="#" data-file="${
                            file.name
                          }">${file.name}</a> (${(file.size / 1024).toFixed(
                            1,
                          )} KB)</p>`;
                          specificationsEditor?.commands.insertContent(link);
                        });
                      }
                    }}
                  />
                  {attachments.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                      <Text size="xs" c="dimmed">
                        Attachments ({attachments.length}):
                      </Text>
                      {attachments.map((file, index) => (
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
                              setAttachments(
                                attachments.filter((_, i) => i !== index),
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
                Supplier
              </Title>
              <Stack gap="md">
                <MultiSelect
                  label="Select Suppliers"
                  placeholder="Choose one or more suppliers"
                  data={suppliers.map((supplier) => ({
                    value: supplier.id.toString(),
                    label:
                      supplier.supplier_trading_name ?? supplier.company_name,
                  }))}
                  key={form.key("suppliers")}
                  {...form.getInputProps("suppliers")}
                  searchable
                />
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Product Image
              </Title>
              <Stack gap="md">
                {imagePreview && (
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={imagePreview}
                      alt="Item preview"
                      width={400}
                      height={200}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <ActionIcon
                      size="sm"
                      color="red"
                      variant="filled"
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                      }}
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      <IconX size={12} />
                    </ActionIcon>
                  </div>
                )}
                <FileInput
                  label="Upload Image"
                  placeholder="Select image file"
                  leftSection={<IconUpload size={16} />}
                  accept="image/*"
                  value={imageFile}
                  onChange={handleImageUpload}
                  required
                />
                <Text size="xs" c="dimmed">
                  Recommended: 400x400px, max 2MB
                </Text>
              </Stack>
            </Card>

            <TaxDetails form={form} />
          </Stack>
        </Grid.Col>
      </Grid>
    </Tabs.Panel>
  );
};

export default CreateProductForm;
