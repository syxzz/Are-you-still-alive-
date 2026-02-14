/**
 * 资产实体（与数据库 assets 表对应）
 */
export interface Asset {
  id: number;
  name: string;
  category: string;
  account: string;
  password: string;
  note: string;
  imageUri: string;
  createdAt: number;
}

/**
 * 新增/编辑资产时的表单数据（无 id、createdAt）
 */
export interface AssetFormData {
  name: string;
  category: string;
  account: string;
  password: string;
  note: string;
  imageUri: string;
}

/** 资产分类选项 */
export const ASSET_CATEGORIES = [
  { label: '银行卡', value: 'bank' },
  { label: '信用卡', value: 'card' },
  { label: '社交账号', value: 'social' },
  { label: '其他', value: 'other' },
] as const;

export type AssetCategoryValue = (typeof ASSET_CATEGORIES)[number]['value'];
