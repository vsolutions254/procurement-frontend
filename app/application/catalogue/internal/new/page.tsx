"use client";

import { ContentContainer } from "@/components/layout/content-container";
import { Stack, Tabs } from "@mantine/core";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { IconPackage, IconPlane } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchSuppliers } from "@/lib/redux/features/suppliers/supplierSlice";
import { addProduct } from "@/lib/redux/features/products/productsSlice";
import { notifications } from "@mantine/notifications";
import { fetchCategories } from "@/lib/redux/features/products/categories/categoriesSlice";
import { useForm } from "@mantine/form";
import CreateItemPageHeader from "@/components/shared/catalogue/internal/create-item/shared/page-header";
import CreateProductForm from "@/components/shared/catalogue/internal/create-item/products/create-product";
import CreateService from "@/components/shared/catalogue/internal/create-item/services/create-service";

export default function NewInternalCatalogItem() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [itemType, setItemType] = useState<string | null>(type);

  const form = useForm<CreateProductFormData>({
    mode: "controlled",
    initialValues: {
      product_name: "",
      category_id: "",
      categories: [] as string[],
      suppliers: [] as string[],
      base_price: 0,
      description: "",
      specifications: "",
      serviceTerms: "",
      tax_status: "taxable",
      tax_type: "inclusive",
      tax_method: "percentage",
      tax_value_type: "percentage",
      tax_value: 16,
    },
  });

  const specificationsEditor = useEditor({
    extensions: [
      StarterKit,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: form.values.specifications || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      form.setFieldValue("specifications", editor.getHTML());
    },
  });

  const serviceTermsEditor = useEditor({
    extensions: [
      StarterKit,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: form.values.serviceTerms || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      form.setFieldValue("serviceTerms", editor.getHTML());
    },
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [serviceAttachments, setServiceAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { suppliers } = useAppSelector((state) => state.suppliers);

  useEffect(() => {
    dispatch(fetchSuppliers(1));
    dispatch(fetchCategories(1));
  }, [dispatch]);

  const handleImageUpload = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();

      Object.entries(form.values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            submitData.append(`${key}[${index}]`, item);
          });
        } else if (
          ["base_price", "tax_value", "min_stock", "max_stock"].includes(key)
        ) {
          submitData.append(key, value.toString());
        } else {
          submitData.append(key, value.toString());
        }
      });

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      await dispatch(addProduct(submitData)).unwrap();
      notifications.show({
        title: "Success",
        message: "Product created successfully",
        color: "green",
      });
      router.push("/application/catalogue/internal");
    } catch (error: unknown) {
      let errorMessage = "Failed to create product";

      const payload = error as {
        errors?: Record<string, string[]>;
        message?: string;
      };

      if (payload?.errors) {
        errorMessage = Object.values(payload.errors).flat().join(". ");
      } else if (payload?.message) {
        errorMessage = payload.message;
      }

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ContentContainer>
      <Stack gap="lg">
        <CreateItemPageHeader
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />

        <Tabs value={itemType} onChange={setItemType}>
          <Tabs.List>
            <Tabs.Tab value="inventory" leftSection={<IconPackage size={16} />}>
              Product
            </Tabs.Tab>
            <Tabs.Tab value="service" leftSection={<IconPlane size={16} />}>
              Service
            </Tabs.Tab>
          </Tabs.List>

          <CreateProductForm
            form={form}
            specificationsEditor={specificationsEditor}
            setAttachments={setAttachments}
            attachments={attachments}
            setImagePreview={setImagePreview}
            setImageFile={setImageFile}
            suppliers={suppliers}
            imagePreview={imagePreview}
            imageFile={imageFile}
            handleImageUpload={handleImageUpload}
          />

          <CreateService />
        </Tabs>
      </Stack>
    </ContentContainer>
  );
}
