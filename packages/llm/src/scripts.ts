import { isValidBase64 } from "./utils/validate-media"

const file = Bun.file("/home/cirejr/work/personal/ai-agent-demo/README.md")
console.log("type", file.type)
console.log("name",file.name)
console.log("size", file.size)

const bytes = new Uint8Array(await file.arrayBuffer())
console.log('bytes', bytes.slice(0,30))
const base64 = Buffer.from(bytes).toBase64()

console.log("base64", base64)

const dataUrl = `data:${file.type};base64,${base64}`
console.log("unknown",new Uint8Array(Buffer.from(base64, "base64")))

console.log("dataUrl", dataUrl.slice(0, 80))

console.log("is valid base64 : ", isValidBase64("VG8gaW5zdGFsbCBkZXBlbmRlbmNpZXM6CmBgYHNoCmJ1biBpbnN0YWxsCmBgYAoKVG8gcnVuOgpgYGBzaApidW4gcnVuIGRldgpgYGAKCm9wZW4gaHR0cDovL2xvY2FsaG9zdDozMDAwCiMgYWktYWdlbnQK"))
