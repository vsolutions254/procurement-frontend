"use client";

import { Button, Modal, Stack, Text, Group, NumberInput } from "@mantine/core";
import { useState } from "react";
import CustomFieldsForm from "../custom-fields-form";

interface AddToCartModalProps {
  opened: boolean;
  onClose: () => void;
  service: Service | null;
  onAddToCart: (service: Service, quantity: number, customValues: CustomFieldValue[]) => Promise<void>;
  loading: boolean;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  opened,
  onClose,
  service,
  onAddToCart,
  loading,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [customData, setCustomData] = useState<Record<string, CustomFieldValueType>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const customFields = (service as Service | null)?.category?.custom_fields ?? [];

  const handleSubmit = async () => {
    if (!service) return;

    const newErrors: Record<string, string> = {};
    customFields.forEach((field) => {
      if (field.required && !customData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const customValues: CustomFieldValue[] = Object.entries(customData).map(
      ([field_id, value]) => ({ field_id, value }),
    );
    await onAddToCart(service, quantity, customValues);
    onClose();
    setQuantity(1);
    setCustomData({});
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    setQuantity(1);
    setCustomData({});
    setErrors({});
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={`Add ${service?.name} to Cart`}
      size="lg"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Configure your service options below.
        </Text>

        <NumberInput
          label="Quantity"
          value={quantity}
          onChange={(val) => setQuantity(Number(val))}
          min={1}
          required
        />

        {customFields.length > 0 && (
          <>
            <Text size="sm" fw={600}>
              Custom Fields
            </Text>
            <CustomFieldsForm
              customFields={customFields}
              formData={customData}
              setFormData={setCustomData}
              errors={errors}
            />
          </>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Add to Cart
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default AddToCartModal;
