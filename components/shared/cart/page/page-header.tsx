import { Text, Title } from "@mantine/core";
import React from "react";

const PageHeader = () => {
  return (
    <div>
      <Title order={2} mb="xs">
        Request Cart
      </Title>
      <Text c="dimmed" size="sm">
        Review your items before creating a requisition
      </Text>
    </div>
  );
};

export default PageHeader;
