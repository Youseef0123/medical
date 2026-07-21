import { certifications } from "@/data/certifications";
import { Card } from "@/components/ui/Card";

export function Certifications() {
  return (
    <section id="certifications" className="bg-bg px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-9 text-center">
          <span className="mb-3 block text-[13px] font-semibold tracking-[0.08em] text-accent-700 uppercase">
            Certifications &amp; Compliance
          </span>
          <h2 className="text-[28px] font-semibold tracking-tight text-ink uppercase">
            Held to standard, on record
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {certifications.map((cert) => (
            <Card
              key={cert.label}
              className="flex min-w-[160px] flex-col items-center gap-2.5 px-7 py-5"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="text-accent-700"
              >
                <path d="M12 2l7 3v6c0 5-3 8.5-7 9-4-.5-7-4-7-9V5l7-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="font-heading text-[15px] font-semibold tracking-wide text-ink uppercase">
                {cert.label}
              </span>
              <span className="text-xs text-ink/65">{cert.detail}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
