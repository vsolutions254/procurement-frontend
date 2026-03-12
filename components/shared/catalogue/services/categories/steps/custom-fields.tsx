import { FIELD_TYPE_OPTIONS, TYPE_BADGE_COLOR } from "@/lib/utils/constants";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconGripVertical,
  IconPlus,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import React, { Dispatch, SetStateAction } from "react";

const CustomFields = ({
  customFields,
  expandedId,
  setExpandedId,
  addField,
  removeField,
  updateField,
  hasMinMax,
  hasOptions,
  removeOption,
  newOptionText,
  addOption,
  setNewOptionText,
}: {
  customFields: CustomField[];
  expandedId: string | null;
  setExpandedId: Dispatch<SetStateAction<string | null>>;
  addField: () => void;
  removeField: (id: string) => void;
  updateField: (id: string, patch: Partial<CustomField>) => void;
  hasMinMax: (t: CustomFieldType) => boolean;
  hasOptions: (t: CustomFieldType) => boolean;
  removeOption: (fieldId: string, index: number) => void;
  newOptionText: Record<string, string>;
  addOption: (fieldId: string) => void;
  setNewOptionText: Dispatch<SetStateAction<Record<string, string>>>;
}) => {
  return (
    <Stack gap="sm">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm" fw={500}>
            Custom Fields
          </Text>
          <Text size="xs" c="dimmed">
            Optional fields that appear when adding services to this category.
          </Text>
        </div>
        <Button
          size="xs"
          leftSection={<IconPlus size={14} />}
          variant="light"
          onClick={addField}
        >
          Add Field
        </Button>
      </Group>

      {customFields.length === 0 && (
        <Paper withBorder p="xl" radius="md" style={{ textAlign: "center" }}>
          <Text size="sm" c="dimmed">
            No custom fields yet.
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            Click "Add Field" to define fields for this category.
          </Text>
        </Paper>
      )}

      {customFields.map((field, index) => {
        const isExpanded = expandedId === field.id;
        return (
          <Paper key={field.id} withBorder radius="md" p="sm">
            <Group
              justify="space-between"
              style={{ cursor: "pointer" }}
              onClick={() => setExpandedId(isExpanded ? null : field.id)}
            >
              <Group gap="xs">
                <IconGripVertical size={14} color="gray" />
                <Text size="sm" fw={500}>
                  {field.label.trim() ? (
                    field.label
                  ) : (
                    <Text span c="dimmed" fw={400} size="sm">
                      Untitled field {index + 1}
                    </Text>
                  )}
                </Text>
                <Badge
                  size="xs"
                  color={TYPE_BADGE_COLOR[field.type]}
                  variant="light"
                >
                  {
                    FIELD_TYPE_OPTIONS.find((o) => o.value === field.type)
                      ?.label
                  }
                </Badge>
                {field.required && (
                  <Badge size="xs" color="red" variant="dot">
                    Required
                  </Badge>
                )}
              </Group>
              <ActionIcon
                size="sm"
                color="red"
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation();
                  removeField(field.id);
                }}
              >
                <IconTrash size={14} />
              </ActionIcon>
            </Group>

            {/* expanded editor */}
            {isExpanded && (
              <Stack
                gap="sm"
                mt="sm"
                pt="sm"
                style={{
                  borderTop: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Group grow>
                  <TextInput
                    label="Field Label"
                    placeholder="e.g. Budget, Priority, Notes…"
                    value={field.label}
                    onChange={(e) =>
                      updateField(field.id, { label: e.target.value })
                    }
                    required
                    size="sm"
                  />
                  <Select
                    label="Field Type"
                    data={FIELD_TYPE_OPTIONS}
                    value={field.type}
                    onChange={(val) =>
                      updateField(field.id, {
                        type: val as CustomFieldType,
                        options: [],
                      })
                    }
                    size="sm"
                  />
                </Group>

                <TextInput
                  label="Placeholder"
                  placeholder="Hint shown inside the field"
                  value={field.placeholder ?? ""}
                  onChange={(e) =>
                    updateField(field.id, {
                      placeholder: e.target.value,
                    })
                  }
                  size="sm"
                />

                <Textarea
                  label="Help Text"
                  placeholder="Short description shown below the field"
                  value={field.help_text ?? ""}
                  onChange={(e) =>
                    updateField(field.id, { help_text: e.target.value })
                  }
                  autosize
                  minRows={2}
                  size="sm"
                />

                {field.type === "currency" && (
                  <TextInput
                    label="Currency Prefix"
                    placeholder="$"
                    value={field.prefix ?? ""}
                    onChange={(e) =>
                      updateField(field.id, { prefix: e.target.value })
                    }
                    size="sm"
                    style={{ maxWidth: 120 }}
                  />
                )}

                {hasMinMax(field.type) && (
                  <Group grow>
                    <NumberInput
                      label="Min"
                      value={field.min ?? ""}
                      onChange={(val) =>
                        updateField(field.id, { min: val as number })
                      }
                      size="sm"
                    />
                    <NumberInput
                      label="Max"
                      value={field.max ?? ""}
                      onChange={(val) =>
                        updateField(field.id, { max: val as number })
                      }
                      size="sm"
                    />
                  </Group>
                )}

                {hasOptions(field.type) && (
                  <div>
                    <Text size="xs" fw={500} mb={6}>
                      Options
                    </Text>
                    <Stack gap={4}>
                      {(field.options ?? []).map((opt, i) => (
                        <Group key={i} gap="xs">
                          <Text size="sm" style={{ flex: 1 }}>
                            {opt}
                          </Text>
                          <ActionIcon
                            size="xs"
                            color="red"
                            variant="subtle"
                            onClick={() => removeOption(field.id, i)}
                          >
                            <IconX size={12} />
                          </ActionIcon>
                        </Group>
                      ))}
                      <Group gap="xs">
                        <TextInput
                          placeholder="Type an option and press Enter…"
                          size="xs"
                          style={{ flex: 1 }}
                          value={newOptionText[field.id] ?? ""}
                          onChange={(e) =>
                            setNewOptionText((prev) => ({
                              ...prev,
                              [field.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addOption(field.id);
                            }
                          }}
                        />
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => addOption(field.id)}
                        >
                          Add
                        </Button>
                      </Group>
                    </Stack>
                  </div>
                )}

                <Switch
                  label="Required field"
                  checked={field.required}
                  onChange={(e) =>
                    updateField(field.id, {
                      required: e.currentTarget.checked,
                    })
                  }
                  size="sm"
                />
              </Stack>
            )}
          </Paper>
        );
      })}
    </Stack>
  );
};

export default CustomFields;
