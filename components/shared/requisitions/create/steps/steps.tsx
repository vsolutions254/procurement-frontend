import { Stepper } from "@mantine/core";
import React from "react";
import RequestDetails from "./request-details";
import DeliveryDetails from "./delivery-details";
import Requisitionsummary from "./requisition-summary";
import RequisitionCreated from "./completed";

const CreateRequisitionSteps = ({
  active,
  setActive,
  projects,
  useCustomDelivery,
  setUseCustomDelivery,
  users,
  selectedReceiver,
  setSelectedReceiver,
  selectedUser,
  items,
  setAddItemModalOpen,
  viewingService,
  setViewingService,
  updateItemQuantity,
  removeItem,
  setEditingService,
  setEditServiceQuantity,
  subtotal,
  tax,
  total,
  setEditServiceFormData,
  setEditServiceModalOpen,
}: CreateRequisitionStepsProps) => {
  return (
    <Stepper active={active} onStepClick={setActive}>
      <Stepper.Step label="Request Details" description="Basic information">
        <RequestDetails projects={projects} />
      </Stepper.Step>

      <Stepper.Step label="Delivery Details" description="Shipping information">
        <DeliveryDetails
          useCustomDelivery={useCustomDelivery}
          setUseCustomDelivery={setUseCustomDelivery}
          users={users}
          selectedReceiver={selectedReceiver}
          setSelectedReceiver={setSelectedReceiver}
          selectedUser={selectedUser}
        />
      </Stepper.Step>

      <Stepper.Step label="Review & Submit" description="Confirm details">
        <Requisitionsummary
          setAddItemModalOpen={setAddItemModalOpen}
          viewingService={viewingService}
          setViewingService={setViewingService}
          updateItemQuantity={updateItemQuantity}
          removeItem={removeItem}
          total={total}
          tax={tax}
          subtotal={subtotal}
          setEditingService={setEditingService}
          setEditServiceQuantity={setEditServiceQuantity}
          setEditServiceFormData={setEditServiceFormData}
          setEditServiceModalOpen={setEditServiceModalOpen}
          items={items}
        />
      </Stepper.Step>

      <Stepper.Completed>
        <RequisitionCreated />
      </Stepper.Completed>
    </Stepper>
  );
};

export default CreateRequisitionSteps;
