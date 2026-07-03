"use client";

import { useState } from "react";
import { saveProductAction } from "@/actions/vendor.actions";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ProductFormData {
  id?: number;
  slug: string;
  price: number;
  stock: number;
  type: "physical" | "digital" | "license";
  discount_percent?: number | null;
  title: string;
  description?: string;
  short_description?: string;
}

interface ProductFormProps {
  initial?: ProductFormData | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function ProductForm({ initial, onSaved, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initial || {
    slug: "",
    price: 0,
    stock: 0,
    type: "physical",
    title: "",
    description: "",
    short_description: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await saveProductAction(form);
    if (res.error) { toast.error(res.error); setSaving(false); return; }
    toast.success(initial ? "Product updated!" : "Product created!");
    setSaving(false);
    onSaved();
  };

  return (
    <div className="border border-gray-100 rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-text-main">{initial ? "Edit Product" : "Add Product"}</h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
              className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required
              className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price *</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required
              className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock *</label>
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required
              className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Discount %</label>
            <input type="number" value={form.discount_percent || ""} onChange={(e) => setForm({ ...form, discount_percent: e.target.value ? Number(e.target.value) : null })}
              className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "physical" | "digital" | "license" })}
              className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:border-primary">
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
              <option value="license">License</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Short Description</label>
            <textarea value={form.short_description || ""} onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              rows={2} className="w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:border-primary resize-none" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4} className="w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:border-primary resize-none" />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="bg-primary text-white h-10 px-6 rounded-md text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50">
            {saving ? "Saving..." : initial ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={onCancel}
            className="h-10 px-6 border border-gray-200 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
