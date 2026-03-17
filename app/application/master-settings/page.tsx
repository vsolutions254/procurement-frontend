"use client";

import {
  Stack,
  Text,
  Title,
  Tabs,
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
} from "@tabler/icons-react";
import { useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";

import AddCategoryModal from "@/components/shared/catalogue/products/add-category-modal";
import AddServiceCategoryModal from "@/components/shared/catalogue/services/categories/add-service-category-modal";
import { createCategory } from "@/lib/redux/features/products/categories/categoriesSlice";
import { notifications } from "@mantine/notifications";
import { createServiceCategory } from "@/lib/redux/features/services/categories/serviceCategoriesSlice";
import GeneralSettings from "@/components/merchants/master-settings/general-settings";
import CategoriesSettings from "@/components/merchants/master-settings/categories-settings";
import ApprovalLimitsSettings from "@/components/merchants/master-settings/approval-limits-settings";

export default function MasterSettingsPage() {
  const [activeTab, setActiveTab] = useState<string | null>("general");
  const dispatch = useAppDispatch();

  // --- Goods category modal state ---
  const [goodsModalOpen, setGoodsModalOpen] = useState(false);
  const [newGoodsCategory, setNewGoodsCategory] = useState("");
  const [goodsCategoryDescription, setGoodsCategoryDescription] = useState("");
  const [goodsCategoryImage, setGoodsCategoryImage] = useState<File | null>(
    null,
  );
  const [goodsCategoryImagePreview, setGoodsCategoryImagePreview] = useState<
    string | null
  >(null);
  const [goodsAttachments, setGoodsAttachments] = useState<File[]>([]);
  const [isCreatingGoods, setIsCreatingGoods] = useState(false);

  // --- Service category modal state ---
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [newServiceCategory, setNewServiceCategory] = useState("");
  const [serviceCategoryDescription, setServiceCategoryDescription] =
    useState("");
  const [serviceCategoryImage, setServiceCategoryImage] = useState<File | null>(
    null,
  );
  const [serviceCategoryImagePreview, setServiceCategoryImagePreview] =
    useState<string | null>(null);
  const [serviceAttachments, setServiceAttachments] = useState<File[]>([]);
  const [isCreatingService, setIsCreatingService] = useState(false);

  const goodsEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setGoodsCategoryDescription(editor.getHTML()),
  });

  const serviceEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setServiceCategoryDescription(editor.getHTML()),
  });

  const handleGoodsImageUpload = (file: File | null) => {
    setGoodsCategoryImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setGoodsCategoryImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setGoodsCategoryImagePreview(null);
    }
  };

  const handleServiceImageUpload = (file: File | null) => {
    setServiceCategoryImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) =>
        setServiceCategoryImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setServiceCategoryImagePreview(null);
    }
  };

  const handleAddGoodsCategory = async () => {
    if (!newGoodsCategory.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Category name is required",
        color: "red",
      });
      return;
    }
    setIsCreatingGoods(true);
    try {
      await dispatch(
        createCategory({
          name: newGoodsCategory,
          description: goodsCategoryDescription,
          image: goodsCategoryImage,
        }),
      ).unwrap();
      notifications.show({
        title: "Success",
        message: "Category created successfully",
        color: "green",
      });
      setNewGoodsCategory("");
      setGoodsCategoryDescription("");
      setGoodsCategoryImage(null);
      setGoodsCategoryImagePreview(null);
      setGoodsAttachments([]);
      goodsEditor?.commands.setContent("<p></p>");
      setGoodsModalOpen(false);
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          (error as Error)?.message ??
          "Failed to create category. Please try again.",
        color: "red",
      });
    } finally {
      setIsCreatingGoods(false);
    }
  };

  const handleAddServiceCategory = async (customFields: CustomField[] = []) => {
    if (!newServiceCategory.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Category name is required",
        color: "red",
      });
      return;
    }
    setIsCreatingService(true);
    try {
      await dispatch(
        createServiceCategory({
          name: newServiceCategory,
          description: serviceCategoryDescription,
          image: serviceCategoryImage,
          custom_fields: customFields,
        }),
      ).unwrap();
      notifications.show({
        title: "Success",
        message: "Service category created successfully",
        color: "green",
      });
      setNewServiceCategory("");
      setServiceCategoryDescription("");
      setServiceCategoryImage(null);
      setServiceCategoryImagePreview(null);
      setServiceAttachments([]);
      serviceEditor?.commands.setContent("<p></p>");
      setServiceModalOpen(false);
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          (error as string) ??
          "Failed to create service category. Please try again.",
        color: "red",
      });
    } finally {
      setIsCreatingService(false);
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
          setGoodsModalOpen={setGoodsModalOpen}
          setServiceModalOpen={setServiceModalOpen}
          handleDeleteCategory={handleDeleteCategory}
        />

        <ApprovalLimitsSettings />
      </Tabs>

      <AddCategoryModal
        categoryModalOpen={goodsModalOpen}
        setCategoryModalOpen={setGoodsModalOpen}
        categoryType="goods"
        newCategory={newGoodsCategory}
        setNewCategory={setNewGoodsCategory}
        categoryImagePreview={goodsCategoryImagePreview}
        setCategoryImage={setGoodsCategoryImage}
        setCategoryImagePreview={setGoodsCategoryImagePreview}
        categoryImage={goodsCategoryImage}
        handleImageUpload={handleGoodsImageUpload}
        editor={goodsEditor}
        setAttachments={setGoodsAttachments}
        attachments={goodsAttachments}
        handleAddCategory={handleAddGoodsCategory}
        isCreating={isCreatingGoods}
      />

      <AddServiceCategoryModal
        categoryModalOpen={serviceModalOpen}
        setCategoryModalOpen={setServiceModalOpen}
        categoryType="services"
        newCategory={newServiceCategory}
        setNewCategory={setNewServiceCategory}
        categoryImagePreview={serviceCategoryImagePreview}
        setCategoryImage={setServiceCategoryImage}
        setCategoryImagePreview={setServiceCategoryImagePreview}
        categoryImage={serviceCategoryImage}
        handleImageUpload={handleServiceImageUpload}
        editor={serviceEditor}
        setAttachments={setServiceAttachments}
        attachments={serviceAttachments}
        handleAddServiceCategory={handleAddServiceCategory}
        isCreating={isCreatingService}
      />
    </Stack>
  );
}
