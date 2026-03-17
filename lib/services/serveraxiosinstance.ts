import axios from "axios";

export const createServerAxiosInstance = (cookieHeader: string) => {
  const xsrfToken = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Cookie: cookieHeader,
      Referer: process.env.NEXT_PUBLIC_FRONTEND_URL,
      ...(xsrfToken && { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) }),
    },
    withCredentials: true,
  });
};
