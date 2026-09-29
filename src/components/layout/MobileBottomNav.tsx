"use client";
import { Home, Fan, ClipboardList, Truck, MessageCircle } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname } from "@/lib/navigation";
import { Link } from "@/lib/navigation";
import { siteConfig } from "@/data/site";
export default function MobileBottomNav(){
 const locale=useLocale(), pathname=usePathname();
 const items=[{name:"Home",path:"",icon:Home},{name:"Fans",path:"products",icon:Fan},{name:"Dealers",path:"dealers",icon:ClipboardList},{name:"Freight",path:"freight",icon:Truck}];
 return <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white/95 text-slate-800 shadow-xl backdrop-blur-md lg:hidden" style={{paddingBottom:"env(safe-area-inset-bottom, 0px)"}}><div className="mx-auto grid h-16 max-w-lg grid-cols-5">{items.map(item=>{const url=`/${locale}${item.path?`/${item.path}`:""}`;const active=pathname===url||(item.path!==""&&pathname.startsWith(url+"/"));const Icon=item.icon;return <Link key={item.name} href={item.path ? `/${item.path}` : "/"} aria-current={active?"page":undefined} className={`flex flex-col items-center justify-center gap-1 text-[11px] ${active?"font-bold text-blue-800":"text-slate-600"}`}><Icon size={21}/>{item.name}</Link>})}<a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 text-[11px] text-emerald-700"><MessageCircle size={21}/>WhatsApp</a></div></nav>
}