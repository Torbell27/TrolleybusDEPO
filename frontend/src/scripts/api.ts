import api from "./apiClient";
import type {
  OrganizationInfo,
  OrganizationFolders,
  RegisterData,
  LoginData,
  FolderFiles,
} from "./types";

export default {
  getOrganizationInfo: async (
    organizationId: string | undefined
  ): Promise<OrganizationInfo> => {
    const response = await api.get(`/organization/${organizationId}/info`);
    return response.data;
  },

  getFolderOrganizationInfo: async (
    folderId: string | undefined
  ): Promise<OrganizationInfo> => {
    const response = await api.get(`/organization/folder/${folderId}/info`);
    return response.data;
  },

  getOrganizationFolders: async (
    organizationId: string | undefined,
    page: number,
    search: string
  ): Promise<OrganizationFolders> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (search) params.append("search", search);

    const response = await api.get(
      `/organization/${organizationId}/folders?${params}`
    );
    if (!response) throw new Error("Не удалось загрузить папки");
    return response.data;
  },

  getFolderFiles: async (
    folderId: string | undefined,
    page: number,
    search: string
  ): Promise<FolderFiles> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (search) params.append("search", search);

    const response = await api.get(
      `/organization/folder/${folderId}/files?${params}`
    );
    if (!response) throw new Error("Не удалось загрузить Файлы");
    return response.data;
  },

  check: async (): Promise<boolean> => {
    const response = await api.get(`/user/getUserOrganization`);
    return response.data;
  },

  register: async (registerData: RegisterData): Promise<string> => {
    const response = await api.post(`/auth/register`, registerData);
    return response.data;
  },

  login: async (loginData: LoginData): Promise<string> => {
    const response = await api.post(`/auth/login`, loginData, {
      withCredentials: true,
    });
    return response.data;
  },

  logout: async (): Promise<string> => {
    const response = await api.post(`/auth/logout`, { withCredentials: true });
    return response.data;
  },

  getUserOrganization: async (): Promise<string> => {
    const response = await api.get(`/user/getUserOrganization`);
    return response.data;
  },
};
