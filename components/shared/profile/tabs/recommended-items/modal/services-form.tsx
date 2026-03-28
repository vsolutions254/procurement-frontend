import { fetchServiceCategories } from "@/lib/redux/features/services/categories/serviceCategoriesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  Button,
  Grid,
  Group,
  NumberInput,
  Select,
  Tabs,
  Textarea,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import EditorSection from "../editor-section";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useForm } from "@mantine/form";

const RecommendedServicesForm = ({ onClose }: { onClose: () => void }) => {
  const {
    categories: serviceCategories,
    categoriesLoading: serviceCategoriesLoading,
  } = useAppSelector((state) => state.service_categories);
  const dispatch = useAppDispatch();

  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      category_id: "",
      price: 0,
      description: "",
      requirements: "",
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      form.setFieldValue("requirements", editor.getHTML());
    },
  });

  const handleAttachments = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleSubmit = form.onSubmit((values) => {
    console.log("BALYUS", { ...values, attachments });
  });

  useEffect(() => {
    dispatch(fetchServiceCategories(1));
  }, [dispatch]);

  return (
    <Tabs.Panel value="services" pt="md">
      <Grid gutter="md">
        <Grid.Col span={6}>
          <TextInput
            label="Service Name"
            placeholder="Enter service name"
            required
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Service Category"
            placeholder="Select category"
            data={serviceCategories.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
            disabled={serviceCategoriesLoading}
            required
            key={form.key("category_id")}
            {...form.getInputProps("category_id")}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            label="Estimated Base Price (KES)"
            placeholder="0"
            min={0}
            thousandSeparator=","
            required
            key={form.key("price")}
            {...form.getInputProps("price")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Service Description"
            placeholder="Brief description of the service"
            rows={2}
            key={form.key("description")}
            {...form.getInputProps("description")}
          />
        </Grid.Col>
        <EditorSection
          label="Service Requirements"
          attachmentInputId="recommend-services-attachment-input"
          editor={editor}
          attachments={attachments}
          setAttachments={setAttachments}
          handleAttachments={handleAttachments}
        />
      </Grid>

      <Group justify="flex-end" gap="sm" mt="md">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => handleSubmit()}>Submit Recommendation</Button>
      </Group>
    </Tabs.Panel>
  );
};

export default RecommendedServicesForm;
