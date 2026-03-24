import { useAppSelector } from "@/lib/redux/hooks";
import {
  Checkbox,
  Grid,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

type DeliveryDetailsProps = {
  useCustomDelivery: boolean;
  setUseCustomDelivery: (v: boolean) => void;
  users: User[];
  selectedReceiver: string | null;
  setSelectedReceiver: (v: string | null) => void;
  selectedUser: User | undefined;
  requisitionForm: UseFormReturnType<CreateRequisitionFormData>;
};

const DeliveryDetails = ({
  useCustomDelivery,
  setUseCustomDelivery,
  requisitionForm,
}: DeliveryDetailsProps) => {
  const { locations } = useAppSelector((state) => state.locations);
  return (
    <Stack gap="md" mt="xl">
      <Grid gutter="md">
        <Grid.Col span={12}>
          <Checkbox
            label="Use custom delivery information"
            checked={useCustomDelivery}
            onChange={(e) => setUseCustomDelivery(e.currentTarget.checked)}
          />
        </Grid.Col>
        {!useCustomDelivery && (
          <>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Delivery Location"
                placeholder="Select location"
                data={locations.map((loc) => ({
                  value: loc.id.toString(),
                  label: loc.contact_name + " - " + loc.address,
                }))}
                key={requisitionForm.key("location_id")}
                {...requisitionForm.getInputProps("location_id")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Delivery Date"
                type="date"
                required
                key={requisitionForm.key("delivery_date")}
                {...requisitionForm.getInputProps("delivery_date")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Special Delivery Instructions (Optional)"
                placeholder="Any special requirements..."
                rows={3}
                key={requisitionForm.key("delivery_instructions")}
                {...requisitionForm.getInputProps("delivery_instructions")}
              />
            </Grid.Col>
          </>
        )}
        {useCustomDelivery && (
          <>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Receiver Name"
                placeholder="Enter receiver name"
                required
                key={requisitionForm.key("custom_receiver_name")}
                {...requisitionForm.getInputProps("custom_receiver_name")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Receiver Phone"
                placeholder="Enter phone number"
                required
                key={requisitionForm.key("custom_receiver_phone")}
                {...requisitionForm.getInputProps("custom_receiver_phone")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Receiver Email"
                placeholder="Enter email address"
                required
                key={requisitionForm.key("custom_receiver_email")}
                {...requisitionForm.getInputProps("custom_receiver_email")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Pickup Point"
                placeholder="Enter name of pickup point. Could be a building, department, or specific location within the organization."
                key={requisitionForm.key("custom_delivery_point")}
                {...requisitionForm.getInputProps("custom_delivery_point")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Delivery Address"
                placeholder="Enter complete delivery address"
                rows={2}
                required
                key={requisitionForm.key("custom_delivery_address")}
                {...requisitionForm.getInputProps("custom_delivery_address")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Requested Delivery Date"
                type="date"
                required
                key={requisitionForm.key("delivery_date")}
                {...requisitionForm.getInputProps("delivery_date")}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Special Delivery Instructions (Optional)"
                placeholder="Any special requirements..."
                rows={3}
                key={requisitionForm.key("delivery_instructions")}
                {...requisitionForm.getInputProps("delivery_instructions")}
              />
            </Grid.Col>
          </>
        )}
      </Grid>
    </Stack>
  );
};

export default DeliveryDetails;
