import { Button, Group, Modal, Stack, Stepper } from "@mantine/core";
import React, { useState } from "react";
import ServiceCategoryMetadata from "./steps/metadata";
import CustomFields from "./steps/custom-fields";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function createField(): CustomField {
  return { id: generateId(), label: "", type: "text", required: false };
}

const hasOptions = (t: CustomFieldType) =>
  t === "select" || t === "multiselect";
const hasMinMax = (t: CustomFieldType) => t === "number" || t === "currency";

const AddServiceCategoryModal = ({
  categoryModalOpen,
  setCategoryModalOpen,
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
  handleAddServiceCategory,
  isCreating,
}: AddServiceCategoryModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newOptionText, setNewOptionText] = useState<Record<string, string>>(
    {},
  );

  const handleClose = () => {
    setCategoryModalOpen(false);
    setActiveStep(0);
    setCustomFields([]);
    setExpandedId(null);
  };

  const addField = () => {
    const f = createField();
    setCustomFields((prev) => [...prev, f]);
    setExpandedId(f.id);
  };

  const removeField = (id: string) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const updateField = (id: string, patch: Partial<CustomField>) =>
    setCustomFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );

  const addOption = (fieldId: string) => {
    const opt = newOptionText[fieldId]?.trim();
    if (!opt) return;
    const field = customFields.find((f) => f.id === fieldId);
    updateField(fieldId, { options: [...(field?.options ?? []), opt] });
    setNewOptionText((prev) => ({ ...prev, [fieldId]: "" }));
  };

  const removeOption = (fieldId: string, index: number) => {
    const field = customFields.find((f) => f.id === fieldId);
    updateField(fieldId, {
      options: field?.options?.filter((_, i) => i !== index),
    });
  };

  const isStep1Valid = newCategory.trim().length > 0;
  const isStep2Valid = customFields.every((f) => f.label.trim().length > 0);
  const canProceed = activeStep === 0 ? isStep1Valid : isStep2Valid;

  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else {
      handleAddServiceCategory(customFields);
    }
  };

  return (
    <Modal
      opened={categoryModalOpen}
      onClose={handleClose}
      title="Add Service Category"
      size="lg"
    >
      <Stack gap="md">
        <Stepper active={activeStep} size="sm" styles={{ steps: { gap: 4 } }}>
          <Stepper.Step label="Basic Info" description="Name & description" />
          <Stepper.Step
            label="Custom Fields"
            description="Define data fields"
          />
        </Stepper>

        {activeStep === 0 && (
          <ServiceCategoryMetadata
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            categoryImagePreview={categoryImagePreview}
            setCategoryImage={setCategoryImage}
            setCategoryImagePreview={setCategoryImagePreview}
            categoryImage={categoryImage}
            handleImageUpload={handleImageUpload}
            editor={editor}
            attachments={attachments}
            setAttachments={setAttachments}
          />
        )}

        {activeStep === 1 && (
          <CustomFields
            customFields={customFields}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            addField={addField}
            removeField={removeField}
            updateField={updateField}
            hasMinMax={hasMinMax}
            hasOptions={hasOptions}
            removeOption={removeOption}
            newOptionText={newOptionText}
            addOption={addOption}
            setNewOptionText={setNewOptionText}
          />
        )}

        {/* ── Footer ── */}
        <Group justify="space-between" gap="sm" mt="xs">
          <Button
            variant="subtle"
            onClick={activeStep === 0 ? handleClose : () => setActiveStep(0)}
          >
            {activeStep === 0 ? "Cancel" : "Back"}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed || isCreating}
            loading={isCreating && activeStep === 1}
          >
            {activeStep === 0 ? "Next" : "Add Category"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AddServiceCategoryModal;
