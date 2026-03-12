import {
  IconAlertTriangle,
  IconBoxOff,
  IconCircleCheck,
  IconTrendingUp,
} from "@tabler/icons-react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "green";
    case "Pending Approval":
      return "orange";
    case "In Procurement":
      return "blue";
    case "Completed":
      return "gray";
    case "Rejected":
      return "red";
    default:
      return "gray";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgent":
      return "red";
    case "High":
      return "orange";
    case "Medium":
      return "blue";
    case "Low":
      return "gray";
    default:
      return "gray";
  }
};

export const getInitials = (name: string, isCompanyName = false) => {
  if (!name || typeof name !== "string") {
    return "";
  }

  if (isCompanyName) {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return (words[0][0] + words[0][words[0].length - 1]).toUpperCase();
    } else {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
  }

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const getLandingActionText = (role: string) => {
  let text = "";
  let action = "";

  switch (role) {
    case "USER":
      text = "Browse Catalogue";
      action = "/application/catalogue";
      break;
    case "APPROVER":
      text = "Approve Requests";
      action = "/application/approvals";
      break;
    case "PROCUREMENT":
      text = "Process Procurements";
      action = "/application/procurement";
      break;
    case "FINANCE":
      text = "Approve Quotations";
      action = "/application/quotations";
      break;
    case "CATALOGUEADMIN":
      text = "Manage Catalogue";
      action = "/application/catalogue";
      break;
    case "SUPPLIER":
      text = "Submit a Quotation";
      action = "/supplier/rfqs";
      break;
    case "MERCHANT":
      text = "View Reports";
      action = "/application/reports";
      break;
    default:
      text = "Get Started";
      action = "/auth/register";
      break;
  }

  return { text, action };
};

export function getRoleColor(role: string) {
  switch (role) {
    case "Admin":
      return "red";
    case "Manager":
      return "blue";
    case "Procurement Officer":
      return "green";
    case "Employee":
      return "gray";
    default:
      return "gray";
  }
}

export const mapDateFormat = (format: string | undefined) => {
  if (!format) return "dd/MM/yyyy";
  return format.replace("DD", "dd").replace("MM", "MM").replace("YYYY", "yyyy");
};

export const getStockStatusConfig = (status: string) => {
  switch (status) {
    case "out_of_stock":
      return {
        label: "Out of Stock",
        color: "red",
        icon: IconBoxOff,
      };
    case "low_stock":
      return {
        label: "Low Stock",
        color: "orange",
        icon: IconAlertTriangle,
      };
    case "overstock":
      return {
        label: "Overstock",
        color: "yellow",
        icon: IconTrendingUp,
      };
    case "in_stock":
    default:
      return {
        label: "In Stock",
        color: "green",
        icon: IconCircleCheck,
      };
  }
};

export function objectToFormData(
  obj: Record<string, any>,
  form: FormData = new FormData(),
  namespace?: string,
): FormData {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const formKey = namespace ? `${namespace}[${key}]` : key;

    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof File) {
      form.append(formKey, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        objectToFormData(item, form, `${formKey}[${index}]`);
      });
      return;
    }

    if (typeof value === "object") {
      objectToFormData(value, form, formKey);
      return;
    }

    form.append(formKey, String(value));
  });

  return form;
}
