export interface Software {
  id: string;
  name: string;
  description: string;
  category: string;
  publisher: string;
  version: string;
  size: string;
  release_date: string;
  download_url: string | null;
  installer_path: string | null;
  logo: string | null;
  screenshots: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface SoftwareFormData {
  name: string;
  description: string;
  category: string;
  publisher: string;
  version: string;
  size: string;
  release_date: string;
  download_url: string;
  logo: string;
  screenshots: string[];
  installer_file?: File | null;
}