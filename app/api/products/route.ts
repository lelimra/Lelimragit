import { NextResponse } from "next/server";
import { getManagedProducts } from "@/lib/productCatalog";
export const dynamic = "force-dynamic";
export async function GET(){return NextResponse.json({products:await getManagedProducts()},{headers:{"Cache-Control":"no-store"}});}
export async function POST(){return NextResponse.json({error:"Use the authenticated admin product endpoint."},{status:405});}
export async function DELETE(){return NextResponse.json({error:"Use the authenticated admin product endpoint."},{status:405});}
