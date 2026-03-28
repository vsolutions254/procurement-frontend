import {
  ActionIcon,
  FileInput,
  Grid,
  Group,
  Loader,
  Text,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
import React from "react";

const EditorSection = ({
  label,
  attachmentInputId,
  editor,
  attachments,
  setAttachments,
  handleAttachments,
}: {
  label: string;
  attachmentInputId: string;
  editor: Editor | null;
  attachments: File[];
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
  handleAttachments: (files: File[]) => void;
}) => {
  return (
    <Grid.Col span={12}>
      <Text size="sm" fw={500} mb="xs">
        {label}
      </Text>
      {!editor ? (
        <Group justify="center" p="md">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">
            Loading editor...
          </Text>
        </Group>
      ) : (
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Control
                onClick={() =>
                  document.getElementById(attachmentInputId)?.click()
                }
                aria-label="Insert attachment"
                title="Insert attachment"
              >
                <IconPlus size={16} />
              </RichTextEditor.Control>
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content style={{ minHeight: "120px" }} />
        </RichTextEditor>
      )}
      <FileInput
        id={attachmentInputId}
        style={{ display: "none" }}
        multiple
        onChange={(files) => handleAttachments(files as File[])}
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
                  setAttachments((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <IconTrash size={12} />
              </ActionIcon>
            </Group>
          ))}
        </div>
      )}
    </Grid.Col>
  );
};

export default EditorSection;
