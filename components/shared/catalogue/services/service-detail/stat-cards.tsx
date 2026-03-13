import { Badge, SimpleGrid } from "@mantine/core";
import React from "react";
import StatCard from "./stat-card";
import {
  IconCash,
  IconPercentage,
  IconReceipt,
  IconUsers,
} from "@tabler/icons-react";
import {
  formatCurrency,
  taxStatusColor,
  taxStatusLabel,
} from "../utils/constants";

const StatCards = ({
  suppliers_count,
  tax_amount,
  tax_status,
  total_price,
}: {
  suppliers_count: number;
  tax_status: string;
  tax_amount: number;
  total_price: number;
}) => {
  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
      <StatCard
        icon={<IconUsers size={18} />}
        label="Suppliers"
        value={suppliers_count}
        color="blue"
      />
      <StatCard
        icon={<IconPercentage size={18} />}
        label="Tax status"
        value={
          <Badge variant="light" color={taxStatusColor(tax_status)} size="xs">
            {taxStatusLabel(tax_status)}
          </Badge>
        }
        color={taxStatusColor(tax_status)}
      />
      <StatCard
        icon={<IconCash size={18} />}
        label="Tax amount"
        value={tax_amount > 0 ? formatCurrency(tax_amount) : "None"}
        color="teal"
      />
      <StatCard
        icon={<IconReceipt size={18} />}
        label="Total price"
        value={formatCurrency(total_price)}
        color="cyan"
      />
    </SimpleGrid>
  );
};

export default StatCards;
