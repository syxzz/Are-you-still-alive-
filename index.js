// pnpm 下 Metro 无法正确解析 node_modules/.pnpm 内的 expo-router/entry，
// 使用本地入口再导入，避免 Web 请求到错误路径返回 JSON 导致 MIME 错误。
import "expo-router/entry";
