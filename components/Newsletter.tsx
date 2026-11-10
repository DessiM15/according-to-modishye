import { NewsletterForm } from "@/components/NewsletterForm";

export function Newsletter() {
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="container scroll-mt-24">
      <div className="catalogue-card relative p-6 sm:p-10">
        <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:items-center">
          <div>
            <p className="eyebrow">Library card</p>
            <h2 id="newsletter-title" className="mt-2 text-2xl font-semibold">
              Get a card. New shelves land in your inbox.
            </h2>
            <p className="mt-3 text-ink-2">
              Tell Yeye where you are in the journey and she sends the articles and guides that fit that moment, nothing else.
            </p>
          </div>
          <div className="relative">
            <NewsletterForm />
          </div>
        </div>
        <span className="stamp absolute right-4 top-4 hidden text-coral-deep sm:inline-block">Member</span>
      </div>
    </section>
  );
}
