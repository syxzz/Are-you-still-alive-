/**
 * OCR 识别结果（本期为模拟数据结构，后续接入 Google ML Kit 时沿用）
 */
export interface OcrResult {
  /** 识别出的账号/卡号等 */
  account?: string;
  /** 其他识别字段可在此扩展 */
  rawText?: string;
}

/**
 * 模拟 OCR 识别：从图片 URI 识别出账号等信息
 * TODO: 待接入真实 API（如 Google ML Kit Text Recognition）
 * @param _imageUri 图片本地 URI，当前未使用，真实接入时传入
 * @returns 模拟识别结果：银行卡号
 */
export async function recognizeFromImage(_imageUri: string): Promise<OcrResult> {
  // 模拟网络/本地识别延迟
  await new Promise((r) => setTimeout(r, 500));
  // 模拟数据：识别出“银行卡号”
  return {
    account: '6222 **** **** 1234',
    rawText: '银行卡号：6222 **** **** 1234',
  };
}
