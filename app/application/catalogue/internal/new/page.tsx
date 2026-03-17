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
import { addService } from "@/lib/redux/features/services/servicesSlice";
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

  const productForm = useForm<CreateProductFormData>({
    mode: "controlled",
    initialValues: {
      product_name: "",
      category_id: "",
      categories: [] as string[],
      suppliers: [] as string[],
      base_price: 0,
      description: "",
      specifications: "",
      service_terms: "",
      tax_status: "taxable",
      tax_type: "inclusive",
      tax_method: "percentage",
      tax_value_type: "percentage",
      tax_value: 16,
    },
  });

  const serviceForm = useForm<CreateServiceFormData>({
    mode: "controlled",
    initialValues: {
      service_name: "",
      description: "",
      base_price: 0,
      category_id: 0,
      supplier_ids: [] as string[],
      tax_status: "taxable",
      tax_type: "inclusive",
      tax_method: "percentage",
      tax_value_type: "percentage",
      tax_value: 16,
      specifications: "",
      service_terms: "",
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
    content: productForm.values.specifications || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      productForm.setFieldValue("specifications", editor.getHTML());
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
    content: serviceForm.values.service_terms || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      serviceForm.setFieldValue("service_terms", editor.getHTML());
    },
  });

  const serviceSpecificationsEditor = useEditor({
    extensions: [
      StarterKit,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: serviceForm.values.specifications || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      serviceForm.setFieldValue("specifications", editor.getHTML());
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

    const isProduct = itemType === "inventory";
    const activeForm = isProduct ? productForm : serviceForm;

    setIsLoading(true);
    try {
      const submitData = new FormData();

      Object.entries(activeForm.values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Append each item directly — no JSON.stringify to avoid double-encoding
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

      if (isProduct && imageFile) {
        submitData.append("image", imageFile);
      }

      if (isProduct) {
        await dispatch(addProduct(submitData)).unwrap();
      } else {
        await dispatch(addService(submitData)).unwrap();
      }
      notifications.show({
        title: "Success",
        message: `${isProduct ? "Product" : "Service"} created successfully`,
        color: "green",
      });
      router.push("/application/catalogue/internal");
    } catch (error: unknown) {
      let errorMessage = `Failed to create ${isProduct ? "product" : "service"}`;

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
            form={productForm}
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

          <CreateService
            form={serviceForm}
            serviceTermsEditor={serviceTermsEditor}
            setServiceAttachments={setServiceAttachments}
            serviceAttachments={serviceAttachments}
            serviceSpecificationsEditor={serviceSpecificationsEditor}
            suppliers={suppliers}
          />
        </Tabs>
      </Stack>
    </ContentContainer>
  );
}