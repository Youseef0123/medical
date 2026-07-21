import { products } from "@/data/products";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Button } from "@/components/ui/Button";

export function Products() {
  return (
    <section id="products" className="bg-neutral-100 px-5 py-22 sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-11 text-center">
          <span className="mb-3 block text-[13px] font-semibold tracking-[0.08em] text-accent-700 uppercase">
            Our Products
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-ink uppercase">
            Formulations you can rely on
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Card key={product.slug} hoverLift className="group flex flex-col">
              <div className="overflow-hidden">
                <ImageSlot
                  alt={`${product.name} packaging photo`}
                  placeholderLabel={`${product.name} packaging photo`}
                  className="aspect-4/3 transition-transform duration-[400ms] ease-out group-hover:scale-[1.06]"
                />
              </div>
              <div className="p-4.5">
                <div className="mb-2.5 flex flex-wrap gap-2">
                  <Tag variant={i % 2 === 0 ? "accent" : "outline"}>
                    {product.category}
                  </Tag>
                  <Tag variant="neutral">{product.rxType}</Tag>
                </div>
                <h3 className="mb-1.5 font-heading text-xl font-semibold tracking-tight text-ink uppercase">
                  {product.name}
                </h3>
                <p className="text-sm text-ink/80">{product.ingredient}</p>
                <p className="mt-1 text-[13px] text-ink/60 tabular-nums">
                  {product.dosage}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="secondary" href="#products">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
