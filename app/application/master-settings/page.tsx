"use client";

import {
  Card,
  Text,
  Group,
  Button,
  Stack,
  Title,
  TextInput,
  Select,
  NumberInput,
  Tabs,
  Table,
  Badge,
} from "@mantine/core";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import {
  IconSettings,
  IconCurrencyDollar,
  IconCategory,
  IconPlus,
} from "@tabler/icons-react";
import { useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import CategoriesTable from "@/components/shared/catalogue/products/categories-table";
import { Category } from "@/types/category";
import AddCategoryModal from "@/components/shared/catalogue/add-category-modal";
import { createCategory } from "@/lib/redux/features/products/categories/categoriesSlice";
import { notifications } from "@mantine/notifications";
import { createServiceCategory } from "@/lib/redux/features/services/categories/serviceCategoriesSlice";
import GeneralSettings from "@/components/merchants/master-settings/general-settings";
import CategoriesSettings from "@/components/merchants/master-settings/categories-settings";
import ApprovalLimitsSettings from "@/components/merchants/master-settings/approval-limits-settings";

export default function MasterSettingsPage() {
  const [activeTab, setActiveTab] = useState<string | null>("general");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState<
    string | null
  >(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const dispatch = useAppDispatch();

  const [categoryType, setCategoryType] = useState<"goods" | "services">(
    "goods",
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: categoryDescription || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setCategoryDescription(editor.getHTML());
    },
  });

  const handleImageUpload = (file: File | null) => {
    setCategoryImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setCategoryImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setCategoryImagePreview(null);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Category name is required",
        color: "red",
      });
      return;
    }

    const payload = {
      name: newCategory,
      description: categoryDescription,
      image: categoryImage,
    };

    setIsCreating(true);
    try {
      if (categoryType === "services") {
        await dispatch(createServiceCategory(payload)).unwrap();
      } else {
        await dispatch(createCategory(payload)).unwrap();
      }

      notifications.show({
        title: "Success",
        message: "Category created successfully",
        color: "green",
      });

      setNewCategory("");
      setCategoryDescription("");
      setCategoryImage(null);
      setCategoryImagePreview(null);
      setAttachments([]);
      editor?.commands.setContent("<p></p>");
      setCategoryModalOpen(false);
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          (error as Error)?.message ??
          "Failed to create category. Please try again.",
        color: "red",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    console.log("Deleting category:", category);
  };

  return (
    <Stack gap="lg">
      <div>
        <Title order={2} mb="xs">
          Master Settings
        </Title>
        <Text c="dimmed" size="sm">
          Configure system-wide settings and manage categories
        </Text>
      </div>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="general" leftSection={<IconSettings size={16} />}>
            General Settings
          </Tabs.Tab>
          <Tabs.Tab value="categories" leftSection={<IconCategory size={16} />}>
            Categories
          </Tabs.Tab>
          <Tabs.Tab
            value="approvals"
            leftSection={<IconCurrencyDollar size={16} />}
          >
            Approval Limits
          </Tabs.Tab>
        </Tabs.List>

        <GeneralSettings />

        <CategoriesSettings
          setCategoryType={setCategoryType}
          setCategoryModalOpen={setCategoryModalOpen}
          handleDeleteCategory={handleDeleteCategory}
        />

        <ApprovalLimitsSettings />
      </Tabs>

      <AddCategoryModal
        categoryModalOpen={categoryModalOpen}
        setCategoryModalOpen={setCategoryModalOpen}
        categoryType={categoryType}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        categoryImagePreview={categoryImagePreview}
        setCategoryImage={setCategoryImage}
        setCategoryImagePreview={setCategoryImagePreview}
        categoryImage={categoryImage}
        handleImageUpload={handleImageUpload}
        editor={editor}
        setAttachments={setAttachments}
        attachments={attachments}
        handleAddCategory={handleAddCategory}
        isCreating={isCreating}
      />
    </Stack>
  );
}
