import { useAppSelector } from "@/lib/redux/hooks";
import { Grid, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

const RequestDetails = ({
  requisitionForm,
}: {
  requisitionForm: UseFormReturnType<CreateRequisitionFormData>;
}) => {
  const { projects } = useAppSelector((state) => state.projects);
  const { cost_centers } = useAppSelector((state) => state.cost_centers);
  return (
    <Stack gap="md" mt="xl">
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Requisition Title"
            placeholder="e.g., Q1 Office Equipment"
            key={requisitionForm.key("title")}
            {...requisitionForm.getInputProps("title")}
            required
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Priority"
            placeholder="Select priority"
            data={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
            key={requisitionForm.key("priority")}
            {...requisitionForm.getInputProps("priority")}
            required
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Cost Center"
            placeholder="Select cost center"
            data={cost_centers.map((p) => ({
              value: p.id.toString(),
              label: p.name,
            }))}
            key={requisitionForm.key("cost_center_id")}
            {...requisitionForm.getInputProps("cost_center_id")}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Project"
            placeholder="Select a project"
            data={projects.map((p) => ({
              value: p.id.toString(),
              label: p.name,
            }))}
            clearable
            key={requisitionForm.key("project_id")}
            {...requisitionForm.getInputProps("project_id")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            label="Business Justification"
            placeholder="Explain why these items are needed..."
            rows={4}
            key={requisitionForm.key("justification")}
            {...requisitionForm.getInputProps("justification")}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default RequestDetails;
