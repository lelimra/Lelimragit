"use client";

import { useEffect, useState } from "react";

type Specifications = {
  sweep: string;
  rpm: string;
  wattage: string;
  voltage: string;
  frequency: string;
  motor_type: string;
  winding: string;
  blades: string;
  air_delivery: string;
  noise: string;
  body_material: string;
  blade_material: string;
};

const emptySpecifications: Specifications = {
  sweep: "",
  rpm: "",
  wattage: "",
  voltage: "",
  frequency: "",
  motor_type: "",
  winding: "",
  blades: "",
  air_delivery: "",
  noise: "",
  body_material: "",
  blade_material: "",
};

type Props = {
  productId: number;
};

export default function ProductSpecificationsForm({
  productId,
}: Props) {
  const [form, setForm] = useState<Specifications>(
    emptySpecifications
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSpecifications();
  }, [productId]);

  async function loadSpecifications() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/products/${productId}/specifications`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load specifications");
      }

      const data = await response.json();

      const specification =
        data.specification ?? data.specifications ?? data;

      if (specification && !Array.isArray(specification)) {
        setForm({
          sweep: specification.sweep ?? "",
          rpm: specification.rpm ?? "",
          wattage: specification.wattage ?? "",
          voltage: specification.voltage ?? "",
          frequency: specification.frequency ?? "",
          motor_type: specification.motor_type ?? "",
          winding: specification.winding ?? "",
          blades: specification.blades ?? "",
          air_delivery: specification.air_delivery ?? "",
          noise: specification.noise ?? "",
          body_material: specification.body_material ?? "",
          blade_material: specification.blade_material ?? "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    field: keyof Specifications,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveSpecifications() {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `/api/admin/products/${productId}/specifications`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save specifications"
        );
      }

      setMessage("Specifications saved successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save specifications."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Loading specifications...
        </p>
      </section>
    );
  }

  const fields: {
    key: keyof Specifications;
    label: string;
    placeholder: string;
  }[] = [
    {
      key: "sweep",
      label: "Sweep",
      placeholder: "1200 mm",
    },
    {
      key: "rpm",
      label: "RPM",
      placeholder: "350 RPM",
    },
    {
      key: "wattage",
      label: "Wattage",
      placeholder: "75 W",
    },
    {
      key: "voltage",
      label: "Voltage",
      placeholder: "220-240 V",
    },
    {
      key: "frequency",
      label: "Frequency",
      placeholder: "50 Hz",
    },
    {
      key: "motor_type",
      label: "Motor Type",
      placeholder: "Induction Motor",
    },
    {
      key: "winding",
      label: "Winding",
      placeholder: "Copper",
    },
    {
      key: "blades",
      label: "Blades",
      placeholder: "3 Blade",
    },
    {
      key: "air_delivery",
      label: "Air Delivery",
      placeholder: "220 CMM",
    },
    {
      key: "noise",
      label: "Noise",
      placeholder: "Low Noise",
    },
    {
      key: "body_material",
      label: "Body Material",
      placeholder: "Aluminium",
    },
    {
      key: "blade_material",
      label: "Blade Material",
      placeholder: "Aluminium",
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Specifications
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Technical specifications displayed on the product page.
        </p>
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {field.label}
            </label>

            <input
              type="text"
              value={form[field.key]}
              onChange={(event) =>
                updateField(field.key, event.target.value)
              }
              placeholder={field.placeholder}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {message && (
            <p
              className={`text-sm ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={saveSpecifications}
          disabled={saving}
          className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Specifications"}
        </button>
      </div>
    </section>
  );
}