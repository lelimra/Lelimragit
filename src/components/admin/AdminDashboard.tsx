"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { products as defaults } from "@/data/products";

type Setting = { setting_key: string; setting_value: string };

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function api(path: string, options: RequestInit = {}) {
    const r = await fetch(path, { ...options, credentials: "include" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Request failed");
    return j;
  }

  async function login() {
    setLoading(true); setNotice("");
    try { await api("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); setLoggedIn(true); setPassword(""); await load(); }
    catch (e) { setNotice(e instanceof Error ? e.message : "Login failed"); }
    finally { setLoading(false); }
  }

  async function load() {
    setLoading(true); setNotice("");
    try {
      const [p, s] = await Promise.all([api("/api/admin/products"), api("/api/admin/settings")]);
      setItems((p.products || []).map((x: { product_json: Product } | Product) => "product_json" in x ? x.product_json : x));
      setSettings(s);
    } catch (e) { setNotice(e instanceof Error ? e.message : "Could not load admin data"); }
    finally { setLoading(false); }
  }

  function newProduct() {
    setSelected({ ...defaults[0], id: "new-product", slug: "new-product", name: "New product", shortDescription: "", description: "", images: [], features: [], specifications: {}, featured: false, available: true });
  }

  async function saveProduct() {
    if (!selected) return;
    setLoading(true); setNotice("");
    try { await api("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(selected) }); setNotice("Product saved successfully."); await load(); }
    catch (e) { setNotice(e instanceof Error ? e.message : "Save failed"); }
    finally { setLoading(false); }
  }

  async function deleteProduct() {
    if (!selected || !confirm(`Remove the override for ${selected.name}?`)) return;
    setLoading(true);
    try { await api(`/api/admin/products?id=${encodeURIComponent(selected.slug)}`, { method: "DELETE" }); setSelected(null); setNotice("Product override removed."); await load(); }
    catch (e) { setNotice(e instanceof Error ? e.message : "Delete failed"); }
    finally { setLoading(false); }
  }

  async function saveSetting(key: string, value: string) {
    try { await api("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) }); setNotice(`${key} saved.`); }
    catch (e) { setNotice(e instanceof Error ? e.message : "Setting save failed"); }
  }

  useEffect(() => { if (loggedIn) load(); }, [loggedIn]);

  if (!loggedIn) return (
    <main className="mx-auto max-w-md px-5 py-20">
      <div className="rounded-2xl border bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-bold">LE LIMRA Admin</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to manage products and business settings.</p>
        <input type="password" autoComplete="current-password" placeholder="Admin password" className="mt-6 w-full rounded-lg border p-3" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === "Enter") login(); }} />
        <button disabled={loading || !password} onClick={login} className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50">{loading ? "Signing in…" : "Sign in"}</button>
        {notice && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{notice}</p>}
      </div>
    </main>
  );

  return <main className="mx-auto max-w-7xl space-y-6 px-5 py-10">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">LE LIMRA Admin</h1><p className="text-slate-600">Products and business configuration.</p></div><button onClick={async()=>{await api("/api/admin/logout",{method:"POST"});setLoggedIn(false)}} className="rounded-lg border px-4 py-2">Sign out</button></div>
    {notice && <p role="status" className="rounded-lg bg-slate-100 p-3">{notice}</p>}
    <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="rounded-xl border bg-white p-3"><div className="mb-3 flex gap-2"><button onClick={newProduct} className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Add product</button><button onClick={load} className="rounded-lg border px-3 py-2 text-sm">Refresh</button></div><div className="max-h-[560px] overflow-y-auto">{items.map(p=><button key={p.slug} onClick={()=>setSelected({...p})} className="block w-full border-b p-3 text-left hover:bg-slate-50">{p.name}<span className="block text-xs text-slate-500">{p.slug}</span></button>)}</div></div>
      {selected ? <section className="space-y-4 rounded-xl border bg-white p-5"><div className="flex justify-between"><h2 className="text-xl font-bold">Edit product</h2><button onClick={deleteProduct} className="text-sm font-semibold text-red-600">Remove override</button></div>
        {(["name","slug","model","shortDescription","description","warranty"] as const).map(field=><label key={field} className="grid gap-1 text-sm font-medium">{field}<input className="rounded-lg border p-3 font-normal" value={(selected[field] || "") as string} onChange={e=>setSelected({...selected,[field]:e.target.value})} /></label>)}
        <label className="grid gap-1 text-sm font-medium">Category<select className="rounded-lg border p-3 font-normal" value={selected.category} onChange={e=>setSelected({...selected,category:e.target.value as Product["category"]})}>{["ceiling-fan","table-fan","pedestal-fan"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-medium">Image paths<textarea className="rounded-lg border p-3 font-normal" rows={3} value={selected.images.join("\n")} onChange={e=>setSelected({...selected,images:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})}/></label>
        <label className="grid gap-1 text-sm font-medium">Features<textarea className="rounded-lg border p-3 font-normal" rows={3} value={selected.features.join("\n")} onChange={e=>setSelected({...selected,features:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})}/></label>
        <label className="grid gap-1 text-sm font-medium">Specifications JSON<textarea className="rounded-lg border p-3 font-mono text-xs font-normal" rows={6} value={JSON.stringify(selected.specifications,null,2)} onChange={e=>{try{setSelected({...selected,specifications:JSON.parse(e.target.value)})}catch{}}}/></label>
        <div className="flex flex-wrap gap-5"><label><input type="checkbox" checked={selected.available} onChange={e=>setSelected({...selected,available:e.target.checked})}/> Published</label><label><input type="checkbox" checked={selected.featured} onChange={e=>setSelected({...selected,featured:e.target.checked})}/> Featured</label></div>
        <button disabled={loading} onClick={saveProduct} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">Save product</button>
      </section> : <div className="rounded-xl border bg-white p-8 text-slate-600">Select a product to edit it.</div>}
    </section>
    <section className="rounded-xl border bg-white p-5"><h2 className="text-xl font-bold">Business settings</h2><p className="mt-1 text-sm text-slate-500">These are stored in MySQL for future runtime configuration.</p><div className="mt-4 grid gap-4 md:grid-cols-2">{["phone","whatsapp","email","address","aboutText"].map(key=>{const item=settings.find(x=>x.setting_key===key);return <label key={key} className="grid gap-1 text-sm font-medium">{key}<textarea className="rounded-lg border p-3 font-normal" rows={key==="aboutText"?3:1} defaultValue={item?.setting_value||""} onBlur={e=>saveSetting(key,e.target.value)}/></label>})}</div></section>
  </main>;
}
