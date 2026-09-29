import { db } from "@/lib/db";
import type { Product, ProductCategory } from "@/types/product";

type ProductRow = {
    id: number;
    name: string;
    slug: string;
    model: string | null;
    short_description: string | null;
    description: string | null;
    price: number | string | null;
    mrp: number | string | null;
    warranty: string | null;
    is_available: number;
    is_featured: number;
    sort_order: number;

    category_id: number;
    category_name: string;
    category_slug: string;
};

type SpecificationRow = {
    product_id: number;
    sweep: string | null;
    rpm: string | null;
    wattage: string | null;
    voltage: string | null;
    frequency: string | null;
    motor_type: string | null;
    winding: string | null;
    blades: string | null;
    air_delivery: string | null;
    noise: string | null;
    body_material: string | null;
    blade_material: string | null;
};

type ImageRow = {
    id: number;
    product_id: number;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: number;
};

type ColorRow = {
    product_id: number;
    color_name: string;
    color_code: string | null;
    sort_order: number;
};

type FeatureRow = {
    product_id: number;
    feature: string;
    sort_order: number;
};

function nullable(value: string | null | undefined) {
    return value ?? undefined;
}

function numeric(value: number | string | null) {
    if (value === null || value === undefined) {
        return undefined;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? undefined : parsed;
}

function mapCategory(slug: string): ProductCategory {
    const normalizedSlug = slug.toLowerCase().trim();

    switch (normalizedSlug) {
        case "ceiling-fan":
        case "ceiling-fans":
            return "ceiling-fan";

        case "table-fan":
        case "table-fans":
            return "table-fan";

        case "pedestal-fan":
        case "pedestal-fans":
            return "pedestal-fan";

        default:
            throw new Error(
                `Unsupported product category: ${slug}`
            );
    }
}

export async function getRelatedProducts(
    slug: string,
    category: ProductCategory,
    limit = 3
): Promise<Product[]> {
    const products = await getProductsByCategory(category);

    return products
        .filter((product) => product.slug !== slug)
        .slice(0, limit);
}

function mapProduct(
    product: ProductRow,
    specification?: SpecificationRow,
    images: ImageRow[] = [],
    colors: ColorRow[] = [],
    features: FeatureRow[] = []
): Product {
    return {
        id: String(product.id),

        slug: product.slug,

        company: "LIMRA INDUSTRIES",

        name: product.name,

        category: mapCategory(product.category_slug),

        model: nullable(product.model),

        shortDescription:
            product.short_description ?? "",

        description:
            product.description ?? "",

        images: images
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((image) => image.image_url),

        price: numeric(product.price),

        mrp: numeric(product.mrp),

        specifications: {
            size: nullable(specification?.sweep),
            sweep: nullable(specification?.sweep),
            rpm: nullable(specification?.rpm),
            wattage: nullable(specification?.wattage),
            voltage: nullable(specification?.voltage),
            frequency: nullable(specification?.frequency),
            motorType: nullable(specification?.motor_type),
            winding: nullable(specification?.winding),
            blades: nullable(specification?.blades),
            airDelivery: nullable(specification?.air_delivery),
            noise: nullable(specification?.noise),
            bodyMaterial: nullable(specification?.body_material),
            bladeMaterial: nullable(specification?.blade_material),

            colors: colors
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((color) => color.color_name),
        },

        features: features
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((feature) => feature.feature),

        warranty: nullable(product.warranty),

        available: Boolean(product.is_available),

        featured: Boolean(product.is_featured),
    };
}

async function getProductRows(
    where = "",
    values: unknown[] = []
): Promise<ProductRow[]> {
    const [rows] = await db.query(
        `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.model,
        p.short_description,
        p.description,
        p.price,
        p.mrp,
        p.warranty,
        p.is_available,
        p.is_featured,
        p.sort_order,

        c.id AS category_id,
        c.name AS category_name,
        c.slug AS category_slug

      FROM products p

      INNER JOIN categories c
        ON c.id = p.category_id

      WHERE
        p.is_available = 1
        AND c.is_active = 1
        ${where}

      ORDER BY
        p.sort_order ASC,
        p.created_at DESC
    `,
        values
    );

    return rows as ProductRow[];
}

async function getProductRelations(
    productIds: number[]
) {
    if (productIds.length === 0) {
        return {
            specifications: [],
            images: [],
            colors: [],
            features: [],
        };
    }

    const placeholders = productIds.map(() => "?").join(",");

    const [specificationRows] = await db.query(
        `
      SELECT *
      FROM product_specifications
      WHERE product_id IN (${placeholders})
    `,
        productIds
    );

    const [imageRows] = await db.query(
        `
      SELECT
        id,
        product_id,
        image_url,
        alt_text,
        sort_order,
        is_primary
      FROM product_images
      WHERE product_id IN (${placeholders})
      ORDER BY sort_order ASC
    `,
        productIds
    );

    const [colorRows] = await db.query(
        `
      SELECT
        product_id,
        color_name,
        color_code,
        sort_order
      FROM product_colors
      WHERE product_id IN (${placeholders})
      ORDER BY sort_order ASC
    `,
        productIds
    );

    const [featureRows] = await db.query(
        `
      SELECT
        product_id,
        feature,
        sort_order
      FROM product_features
      WHERE product_id IN (${placeholders})
      ORDER BY sort_order ASC
    `,
        productIds
    );

    return {
        specifications:
            specificationRows as SpecificationRow[],

        images:
            imageRows as ImageRow[],

        colors:
            colorRows as ColorRow[],

        features:
            featureRows as FeatureRow[],
    };
}

export async function getProducts(): Promise<Product[]> {
    const rows = await getProductRows();

    const productIds = rows.map((product) => product.id);

    const relations =
        await getProductRelations(productIds);

    return rows.map((product) =>
        mapProduct(
            product,
            relations.specifications.find(
                (item) => item.product_id === product.id
            ),
            relations.images.filter(
                (item) => item.product_id === product.id
            ),
            relations.colors.filter(
                (item) => item.product_id === product.id
            ),
            relations.features.filter(
                (item) => item.product_id === product.id
            )
        )
    );
}

export async function getProductBySlug(
    slug: string
): Promise<Product | null> {
    const rows = await getProductRows(
        "AND p.slug = ?",
        [slug]
    );

    if (rows.length === 0) {
        return null;
    }

    const product = rows[0];

    const relations =
        await getProductRelations([product.id]);

    return mapProduct(
        product,
        relations.specifications[0],
        relations.images,
        relations.colors,
        relations.features
    );
}

export async function getFeaturedProducts(): Promise<Product[]> {
    const rows = await getProductRows(
        "AND p.is_featured = 1"
    );

    const productIds = rows.map((product) => product.id);

    const relations =
        await getProductRelations(productIds);

    return rows.map((product) =>
        mapProduct(
            product,
            relations.specifications.find(
                (item) => item.product_id === product.id
            ),
            relations.images.filter(
                (item) => item.product_id === product.id
            ),
            relations.colors.filter(
                (item) => item.product_id === product.id
            ),
            relations.features.filter(
                (item) => item.product_id === product.id
            )
        )
    );
}

export async function getProductsByCategory(
    category: ProductCategory
): Promise<Product[]> {
    const databaseCategoryMap: Record<
        ProductCategory,
        string
    > = {
        "ceiling-fan": "ceiling-fans",
        "table-fan": "table-fans",
        "pedestal-fan": "pedestal-fans",
    };

    const databaseSlug = databaseCategoryMap[category];

    const rows = await getProductRows(
        "AND c.slug = ?",
        [databaseSlug]
    );

    const productIds = rows.map(
        (product) => product.id
    );

    const relations =
        await getProductRelations(productIds);

    return rows.map((product) =>
        mapProduct(
            product,
            relations.specifications.find(
                (item) =>
                    item.product_id === product.id
            ),
            relations.images.filter(
                (item) =>
                    item.product_id === product.id
            ),
            relations.colors.filter(
                (item) =>
                    item.product_id === product.id
            ),
            relations.features.filter(
                (item) =>
                    item.product_id === product.id
            )
        )
    );
}