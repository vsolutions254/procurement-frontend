"use client";

import {
  TextInput,
  NumberInput,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
} from "@mantine/core";
import { DatePickerInput, TimeInput, DateTimePicker } from "@mantine/dates";
import React from "react";

interface CustomFieldsFormProps {
  customFields: CustomField[];
  formData: Record<string, CustomFieldValueType>;
  setFormData: (data: Record<string, CustomFieldValueType>) => void;
  errors?: Record<string, string>;
}

const CustomFieldsForm: React.FC<CustomFieldsFormProps> = ({
  customFields,
  formData,
  setFormData,
  errors = {},
}) => {
  const handleChange = (id: string, value: CustomFieldValueType) => {
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const renderField = (field: CustomField) => {
    const value = formData[field.id] ?? "";
    const error = errors[field.id];

    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      required: field.required,
      error,
    };

    switch (field.type) {
      case "text":
        return (
          <TextInput
            key={field.id}
            {...commonProps}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
      case "textarea":
        return (
          <Textarea
            key={field.id}
            {...commonProps}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
      case "number":
        return (
          <NumberInput
            key={field.id}
            {...commonProps}
            value={value as string | number}
            onChange={(val) => handleChange(field.id, val)}
            min={field.min}
            max={field.max}
            prefix={field.prefix}
          />
        );
      case "currency":
        return (
          <NumberInput
            key={field.id}
            {...commonProps}
            value={value as string | number}
            onChange={(val) => handleChange(field.id, val)}
            min={field.min}
            max={field.max}
            prefix={field.prefix || "KES"}
          />
        );
      case "date":
        return (
          <DatePickerInput
            key={field.id}
            {...commonProps}
            value={value ? new Date(value as string | number) : null}
            onChange={(date) =>
              handleChange(field.id, date?.toString().split("T")[0] ?? "")
            }
            popoverProps={{ withinPortal: true, zIndex: 1000 }}
          />
        );
      case "time":
        return (
          <TimeInput
            key={field.id}
            {...commonProps}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
      case "datetime":
        return (
          <DateTimePicker
            key={field.id}
            {...commonProps}
            value={value ? new Date(value as string | number) : null}
            onChange={(date) => handleChange(field.id, date?.toString() ?? "")}
            popoverProps={{ withinPortal: true, zIndex: 1000 }}
          />
        );
      case "select":
        return (
          <Select
            key={field.id}
            {...commonProps}
            value={value as string}
            onChange={(val) => handleChange(field.id, val)}
            data={field.options || []}
          />
        );
      case "multiselect":
        return (
          <MultiSelect
            key={field.id}
            {...commonProps}
            value={Array.isArray(value) ? value : []}
            onChange={(val) => handleChange(field.id, val)}
            data={field.options || []}
          />
        );
      case "boolean":
        return (
          <Checkbox
            key={field.id}
            {...commonProps}
            checked={value as boolean}
            onChange={(e) => handleChange(field.id, e.target.checked)}
            label={field.label}
          />
        );
      case "richtext":
        return (
          <Textarea
            key={field.id}
            {...commonProps}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
      default:
        return (
          <TextInput
            key={field.id}
            {...commonProps}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <>
      {customFields.map((field) => (
        <div key={field.id}>
          {renderField(field)}
          {field.help_text && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--mantine-color-dimmed)",
                marginTop: 4,
              }}
            >
              {field.help_text}
            </p>
          )}
        </div>
      ))}
    </>
  );
};

export default CustomFieldsForm;