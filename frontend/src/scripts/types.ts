export interface OrganizationInfo {
  owner_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  ogrn?: string;
}

export interface OrganizationFolders {
  folders: OrganizationFolder[];
  total: number;
  page: number;
  limit: number;
}

export interface FolderFiles {
  files: FolderFile[];
  total: number;
  page: number;
  limit: number;
}

export interface FolderFile {
  image_id: string;
  name: string;
  description: string;
}

export interface OrganizationFolder {
  folder_id: string;
  name: string;
  description: string;
}

export interface RegisterData {
  firstname: string | "";
  surname: string | "";
  patronymic: string | "";
  email: string | "";
  password: string | "";
}

export interface LoginData {
  email: string | "";
  password: string | "";
}
