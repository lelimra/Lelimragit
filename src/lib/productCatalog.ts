import db from "@/lib/db";
import {products,type Product} from "@/data/products";
import type {RowDataPacket} from "mysql2";
export async function getManagedProducts():Promise<Product[]>{try{const [rows]=await db.query<RowDataPacket[]>("SELECT slug,product_json FROM product_overrides");const overrides=new Map<string,Product>(rows.map(r=>[r.slug,typeof r.product_json==="string"?JSON.parse(r.product_json):r.product_json]));const catalog=products.map(p=>overrides.get(p.slug)||p);for(const [slug,p] of overrides)if(!products.some(x=>x.slug===slug))catalog.push(p);return catalog.filter(p=>p.available)}catch{return products}}
export async function getManagedProduct(slug:string){const all=await getManagedProducts();return all.find(p=>p.slug===slug)}
