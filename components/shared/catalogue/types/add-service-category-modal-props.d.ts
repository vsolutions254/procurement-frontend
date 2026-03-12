type AddServiceCategoryModalProps = {
  categoryModalOpen: boolean;
  setCategoryModalOpen: (open: boolean) => void;
  categoryType: "services";
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
  handleAddServiceCategory: (customFields: CustomField[]) => void;
  isCreating: boolean;
};
