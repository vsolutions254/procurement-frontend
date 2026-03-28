import { Button, Group, Modal, Tabs } from "@mantine/core";
import { IconPackage, IconPlane } from "@tabler/icons-react";
import React from "react";
import RecommendProductsForm from "./modal/products-form";
import RecommendedServicesForm from "./modal/services-form";

const RecommendItemModal = ({
  modalOpen,
  handleClose,
  itemType,
  setItemType,
}: {
  modalOpen: boolean;
  handleClose: () => void;
  itemType: "goods" | "services";
  setItemType: (type: "goods" | "services") => void;
}) => {
  return (
    <Modal
      opened={modalOpen}
      onClose={handleClose}
      title="Recommend an Item"
      size="xl"
      centered
    >
      <Tabs
        value={itemType}
        onChange={(value) => setItemType(value! as "goods" | "services")}
      >
        <Tabs.List>
          <Tabs.Tab value="goods" leftSection={<IconPackage size={16} />}>
            Goods
          </Tabs.Tab>
          <Tabs.Tab value="services" leftSection={<IconPlane size={16} />}>
            Services
          </Tabs.Tab>
        </Tabs.List>

        <RecommendProductsForm onClose={handleClose} />

        <RecommendedServicesForm onClose={handleClose} />
      </Tabs>
    </Modal>
  );
};

export default RecommendItemModal;
