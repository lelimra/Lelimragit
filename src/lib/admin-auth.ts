import {createHmac,timingSafeEqual} from "node:crypto";import {cookies} from "next/headers";
const name="limra_admin";function signature(payload:string){const secret=process.env.ADMIN_SESSION_SECRET;if(!secret)return "";return createHmac("sha256",secret).update(payload).digest("hex")}
export function verifyPassword(password:string){const expected=process.env.ADMIN_PASSWORD;if(!expected||!process.env.ADMIN_SESSION_SECRET)return false;const a=Buffer.from(password),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b)}
export function issueToken(){const payload=String(Date.now()+8*60*60*1000);return `${payload}.${signature(payload)}`}
export async function isAdmin(){const token=(await cookies()).get(name)?.value||"";const [payload,sig]=token.split(".");if(!payload||!sig||!process.env.ADMIN_SESSION_SECRET||!/^\d+$/.test(payload)||Number(payload)<Date.now())return false;const expected=signature(payload);return sig.length===expected.length&&timingSafeEqual(Buffer.from(sig),Buffer.from(expected))}
export const adminCookie=name;
