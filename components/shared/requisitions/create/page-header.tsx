import { Text, Title } from "@mantine/core";
import React from "react";

const PageHeader = () => {
  return (
    <div>
      <Title order={2} mb="xs">
        Create Requisition
      </Title>
      <Text c="dimmed" size="sm">
        Complete the form to submit your requisition for approval
      </Text>
    </div>
  );
};

export default PageHeader;
