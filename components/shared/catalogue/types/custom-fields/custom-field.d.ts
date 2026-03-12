type CustomField = {
  id: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
  placeholder?: string;
  help_text?: string;
  options?: string[];
  min?: number;
  max?: number;
  prefix?: string;
};
