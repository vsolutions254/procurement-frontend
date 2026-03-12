import {
  ActionIcon,
  Button,
  FileInput,
  Group,
  Image,
  Loader,
  Modal,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { IconUpload, IconX } from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
import React from "react";

interface AddCategoryModalProps {
  categoryModalOpen: boolean;
  setCategoryModalOpen: (open: boolean) => void;
  categoryType: "goods" | "services";
  newCategory: string;
  setNewCategory: (value: string) => void;
  categoryImagePreview: string | null;
  setCategoryImage: (file: File | null) => void;
  setCategoryImagePreview: (preview: string | null) => void;
  categoryImage: File | null;
  handleImageUpload: (file: File | null) => void;
  editor: Editor | null;
  setAttachments: (attachments: File[]) => void;
  attachments: File[];
  handleAddCategory: () => void;
  isCreating: boolean;
}

const AddCategoryModal = ({
  categoryModalOpen,
  setCategoryModalOpen,
  categoryType,
  newCategory,
  setNewCategory,
  categoryImagePreview,
  setCategoryImage,
  setCategoryImagePreview,
  categoryImage,
  handleImageUpload,
  editor,
  setAttachments,
  attachments,
  handleAddCategory,
  isCreating,
}: AddCategoryModalProps) => {
  return (
    <Modal
      opened={categoryModalOpen}
      onClose={() => setCategoryModalOpen(false)}
      title={`Add ${categoryType === "goods" ? "Goods" : "Service"} Category`}
      size="lg"
    >
      <Stack gap="md">
        <TextInput
          label="Category Name"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          required
        />

        <div>
          <Text size="sm" fw={500} mb="xs">
            Category Image
          </Text>
          <Stack gap="md">
            {categoryImagePreview && (
              <div style={{ position: "relative" }}>
                <Image
                  src={categoryImagePreview}
                  alt="Category preview"
                  h={150}
                  w={200}
                  fit="cover"
                  radius="md"
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
                    setCategoryImage(null);
                    setCategoryImagePreview(null);
                  }}
                >
                  <IconX size={12} />
                </ActionIcon>
              </div>
            )}
            <FileInput
              placeholder="Select image file"
              leftSection={<IconUpload size={16} />}
              accept="image/*"
              value={categoryImage}
              onChange={handleImageUpload}
            />
          </Stack>
        </div>

        <div>
          <Text size="sm" fw={500} mb="xs">
            Description
          </Text>
          {!editor ? (
            <Group justify="center" p="xl">
              <Loader size="sm" />
              <Text size="sm" c="dimmed">
                Loading editor...
              </Text>
            </Group>
          ) : (
            <RichTextEditor editor={editor}>
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
                        .getElementById("category-attachment-input")
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
            id="category-attachment-input"
            style={{ display: "none" }}
            multiple
            onChange={(files) => {
              if (files) {
                setAttachments([...attachments, ...files]);
                files.forEach((file) => {
                  const link = `<p><a href="#" data-file="${file.name}">${
                    file.name
                  }</a> (${(file.size / 1024).toFixed(1)} KB)</p>`;
                  editor?.commands.insertContent(link);
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
                      setAttachments(attachments.filter((_, i) => i !== index))
                    }
                  >
                    <IconX size={12} />
                  </ActionIcon>
                </Group>
              ))}
            </div>
          )}
        </div>

        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddCategory} 
            disabled={!newCategory.trim() || isCreating}
            loading={isCreating}
          >
            Add Category
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AddCategoryModal;
