import {
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

const CreateService = ({
  form,
}: {
  form: UseFormReturnType<CreateServiceFormData>;
}) => {
  return (
    <Tabs.Panel value="service" pt="md">
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Service Information
              </Title>
              <Stack gap="md">
                <TextInput
                  label="Service Name"
                  placeholder="e.g., Flight Booking Service"
                  key={form.key("product_name")}
                  {...form.getInputProps("product_name")}
                  required
                />
                <Grid gutter="md">
                  <Grid.Col span={6}>
                    <Group align="end" gap="xs">
                      <div style={{ flex: 1 }}>
                        <Select
                          label="Category"
                          placeholder="Select category"
                          data={(categories || []).map((category) => ({
                            value: category.id.toString(),
                            label: category.name,
                          }))}
                          key={form.key("category_id")}
                          {...form.getInputProps("category_id")}
                          searchable
                          required
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const categoryName = prompt("Enter category name:");
                          if (categoryName?.trim()) {
                            const newId = Date.now().toString();
                            form.setFieldValue("category_id", newId);
                            notifications.show({
                              title: "Category Created",
                              message: `Category "${categoryName}" created successfully`,
                              color: "green",
                            });
                          }
                        }}
                      >
                        +
                      </Button>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      label="Base Price (KES)"
                      placeholder="0"
                      key={form.key("base_price")}
                      {...form.getInputProps("base_price")}
                      min={0}
                      prefix="From KES "
                      thousandSeparator=","
                      required
                    />
                  </Grid.Col>
                </Grid>
                <Textarea
                  label="Service Description"
                  placeholder="Detailed description of the service offered..."
                  key={form.key("description")}
                  {...form.getInputProps("descrition")}
                  rows={4}
                  required
                />
                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Service Terms
                  </Text>
                  {!serviceTermsEditor ? (
                    <Group justify="center" p="xl">
                      <Loader size="sm" />
                      <Text size="sm" c="dimmed">
                        Loading editor...
                      </Text>
                    </Group>
                  ) : (
                    <RichTextEditor editor={serviceTermsEditor}>
                      <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Bold />
                          <RichTextEditor.Italic />
                          <RichTextEditor.Underline />
                          <RichTextEditor.Strikethrough />
                          <RichTextEditor.ClearFormatting />
                          <RichTextEditor.Highlight />
                          <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.H1 />
                          <RichTextEditor.H2 />
                          <RichTextEditor.H3 />
                          <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Blockquote />
                          <RichTextEditor.Hr />
                          <RichTextEditor.BulletList />
                          <RichTextEditor.OrderedList />
                          <RichTextEditor.Subscript />
                          <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Link />
                          <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.AlignLeft />
                          <RichTextEditor.AlignCenter />
                          <RichTextEditor.AlignJustify />
                          <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Control
                            onClick={() =>
                              document
                                .getElementById("service-attachment-input")
                                ?.click()
                            }
                            aria-label="Insert attachment"
                            title="Insert attachment"
                          >
                            <IconUpload size={16} />
                          </RichTextEditor.Control>
                        </RichTextEditor.ControlsGroup>
                      </RichTextEditor.Toolbar>

                      <RichTextEditor.Content style={{ minHeight: "150px" }} />
                    </RichTextEditor>
                  )}
                  <FileInput
                    id="service-attachment-input"
                    style={{ display: "none" }}
                    multiple
                    onChange={(files) => {
                      if (files) {
                        setServiceAttachments([
                          ...serviceAttachments,
                          ...files,
                        ]);
                        files.forEach((file) => {
                          const link = `<p><a href="#" data-file="${
                            file.name
                          }">${file.name}</a> (${(file.size / 1024).toFixed(
                            1,
                          )} KB)</p>`;
                          serviceTermsEditor?.commands.insertContent(link);
                        });
                      }
                    }}
                  />
                  {serviceAttachments.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                      <Text size="xs" c="dimmed">
                        Attachments ({serviceAttachments.length}):
                      </Text>
                      {serviceAttachments.map((file, index) => (
                        <Group key={index} gap="xs" mt="xs">
                          <Text size="xs">{file.name}</Text>
                          <Text size="xs" c="dimmed">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </Text>
                          <ActionIcon
                            size="xs"
                            color="red"
                            variant="subtle"
                            onClick={() =>
                              setServiceAttachments(
                                serviceAttachments.filter(
                                  (_, i) => i !== index,
                                ),
                              )
                            }
                          >
                            <IconX size={12} />
                          </ActionIcon>
                        </Group>
                      ))}
                    </div>
                  )}
                </div>

                {form.values.category_id === "Travel" && (
                  <Grid gutter="md">
                    <Grid.Col span={12}>
                      <Text size="sm" fw={500} c="blue">
                        Travel Details
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Travel Type"
                        data={["Domestic", "International", "Multi-city"]}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Destination"
                        placeholder="City, Country"
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput label="Travel Date" type="date" />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Number of Travelers"
                        min={1}
                        max={20}
                        defaultValue={1}
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Textarea
                        label="Travel Purpose"
                        placeholder="Business meeting, conference, training, etc."
                        rows={2}
                      />
                    </Grid.Col>
                  </Grid>
                )}
              </Stack>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Service Provider
              </Title>
              <Stack gap="md">
                <MultiSelect
                  label="Select Service Providers"
                  placeholder="Choose one or more providers"
                  data={[
                    "Kenya Airways",
                    "Serena Hotels",
                    "Avis Kenya",
                    "Corporate Training Ltd",
                    "Business Consulting Kenya",
                  ]}
                  key={form.key("suppliers")}
                  {...form.getInputProps("suppliers")}
                  searchable
                  required
                />
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <TaxDetails form={form} />
      </Grid>
    </Tabs.Panel>
  );
};

export default CreateService;
