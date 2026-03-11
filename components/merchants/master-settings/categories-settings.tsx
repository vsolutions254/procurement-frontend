import CategoriesTable from "@/components/shared/catalogue/products/categories-table";
import ServiceCategoriesTable from "@/components/shared/catalogue/services/categories-table";
import { Category } from "@/types/category";
import { Badge, Button, Card, Group, Table, Tabs, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React from "react";

interface CategoriesSettingsProps {
  setCategoryType: (type: "goods" | "services") => void;
  setCategoryModalOpen: (open: boolean) => void;
  handleDeleteCategory: (category: Category) => void;
}

const CategoriesSettings = ({
  setCategoryType,
  setCategoryModalOpen,
  handleDeleteCategory,
}: CategoriesSettingsProps) => {
  return (
    <Tabs.Panel value="categories" pt="md">
      <Tabs defaultValue="goods">
        <Tabs.List>
          <Tabs.Tab value="goods">Goods</Tabs.Tab>
          <Tabs.Tab value="services">Services</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="goods" pt="md">
          <CategoriesTable
            setCategoryType={setCategoryType}
            setCategoryModalOpen={setCategoryModalOpen}
            handleDeleteCategory={(category) => handleDeleteCategory(category)}
          />
        </Tabs.Panel>

        <ServiceCategoriesTable
          setCategoryType={setCategoryType}
          setCategoryModalOpen={setCategoryModalOpen}
        />
      </Tabs>
    </Tabs.Panel>
  );
};

export default CategoriesSettings;
