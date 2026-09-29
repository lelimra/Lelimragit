import {NextRequest,NextResponse} from "next/server";
import {verifyPassword,issueToken,adminCookie} from "@/lib/admin-auth";export async function POST(req:NextRequest){const {password}=await req.json();if(typeof password!=="string"||!verifyPassword(password))return NextResponse.json({error:"Invalid credentials"},{status:401});
const res=NextResponse.json({ok:true});res.cookies.set(adminCookie,issueToken(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:28800});return res}
