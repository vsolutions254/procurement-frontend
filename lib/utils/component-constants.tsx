import {
  IconBriefcase,
  IconMapPin,
  IconTag,
  IconUser,
} from "@tabler/icons-react";
import React from "react";

export const categoryIcons: Record<string, React.ReactNode> = {
  Travel: <IconMapPin size={16} />,
  Transport: <IconBriefcase size={16} />,
  "Professional Services": <IconUser size={16} />,
  Consulting: <IconTag size={16} />,
};
