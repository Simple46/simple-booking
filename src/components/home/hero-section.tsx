import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";

const steps = [
  {
    number: "01",
    title: "Create your activity",
    description:
      "Set the date, capacity, and details. Publish when you're ready.",
  },
  {
    number: "02",
    title: "Share your link",
    description:
      "Let people register for your event or choose an available slot.",
  },
  {
    number: "03",
    title: "Check people in",
    description:
      "Scan their unique QR codes and manage attendance in one place.",
  },
];

export function HeroSection() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-36 -z-10 size-[34rem] rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-400/5"
          />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24">
            <div>
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/80 px-3.5 py-2 text-xs font-semibold tracking-wide text-foreground/75 shadow-sm">
                <span className="size-2 rounded-full bg-amber-500" />
                A calmer way to bring people together
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-6xl md:text-7xl">
                Make room for
                <span className="block text-amber-700 dark:text-amber-400">
                  the good stuff.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-foreground/65 sm:text-lg sm:leading-8">
                Spend less time coordinating and more time connecting. Create
                events, share one simple booking link, and check people in with
                a scan.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/sign-up"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-foreground px-6 text-sm font-semibold text-background shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:shadow-black/30"
                >
                  Create your first activity
                  <span aria-hidden="true">↗</span>
                </Link>

                <Link
                  href="#how-it-works"
                  className="inline-flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold text-foreground/75 transition hover:bg-surface-muted hover:text-foreground"
                >
                  See how it works
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-foreground/55 sm:text-sm">
                <span>Free to get started</span>
                <span aria-hidden="true" className="text-amber-600">
                  ·
                </span>
                <span>Shareable booking links</span>
                <span aria-hidden="true" className="text-amber-600">
                  ·
                </span>
                <span>QR check-in</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div
                aria-hidden="true"
                className="absolute -inset-4 -rotate-3 rounded-[2rem] bg-amber-500/10"
              />
              <div className="relative rounded-[1.6rem] border border-border bg-surface p-5 shadow-2xl shadow-black/10 sm:p-7 dark:shadow-black/30">
                <div className="flex items-center justify-between border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-lg dark:bg-amber-400/15">
                      ✳
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Saturday pottery</p>
                      <p className="mt-0.5 text-xs text-foreground/55">
                        Your next activity
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Published
                  </span>
                </div>

                <div className="py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
                    Saturday, October 24
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    A little time to make
                  </p>
                  <p className="mt-2 text-sm text-foreground/60">
                    10:00 AM · The Clay Studio
                  </p>
                </div>

                <div className="rounded-2xl bg-surface-muted p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Your guests</span>
                    <span className="text-xs font-semibold text-foreground/55">
                      8 of 12 spots
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label="Booking capacity"
                    aria-valuenow={8}
                    aria-valuemin={0}
                    aria-valuemax={12}
                    className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10"
                  >
                    <div className="h-full w-2/3 rounded-full bg-amber-600 dark:bg-amber-400" />
                  </div>
                  <div className="mt-4 flex -space-x-2">
                    {["M", "J", "A", "S", "3"].map((person, index) => (
                      <span
                        key={person}
                        className={`flex size-8 items-center justify-center rounded-full border-2 border-surface-muted text-[11px] font-semibold ${
                          index === 4
                            ? "bg-foreground text-background"
                            : "bg-amber-100 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200"
                        }`}
                      >
                        {person}
                      </span>
                    ))}
                    <span className="ml-3 self-center pl-2 text-xs text-foreground/55">
                      A lovely little group
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl border border-border px-4 py-3.5">
                  <div>
                    <p className="text-xs font-medium text-foreground/50">
                      Booking link
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      simplebooking.app/pottery
                    </p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200">
                    ↗
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-5 hidden rounded-2xl border border-border bg-surface px-4 py-3 shadow-xl sm:block">
                <p className="text-xs font-medium text-foreground/55">Check-in</p>
                <p className="mt-1 text-sm font-semibold">Quick scan. All set.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="grid border-y border-border sm:grid-cols-3">
            <div className="py-7 sm:pr-8">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                01 / Events
              </p>
              <h2 className="mt-3 text-lg font-semibold">
                One event, many attendees
              </h2>
              <p className="mt-2 text-sm leading-6 text-foreground/60">
                Set a capacity and let participants reserve their place.
              </p>
            </div>

            <div className="border-border py-7 sm:border-l sm:px-8">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                02 / Booking
              </p>
              <h2 className="mt-3 text-lg font-semibold">
                Slots that stay organized
              </h2>
              <p className="mt-2 text-sm leading-6 text-foreground/60">
                Let people select from available sessions and times.
              </p>
            </div>

            <div className="border-border py-7 sm:border-l sm:pl-8">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                03 / Attendance
              </p>
              <h2 className="mt-3 text-lg font-semibold">
                Check in without the lists
              </h2>
              <p className="mt-2 text-sm leading-6 text-foreground/60">
                Verify registrations using unique QR codes.
              </p>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-border bg-surface-muted"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  HOW IT WORKS
                </p>
                <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
                  Everything organized. Nothing complicated.
                </h2>
              </div>

              <p className="max-w-md text-sm leading-7 text-foreground/60">
                From a small university workshop to a large community event, get
                the essentials without the administrative headache.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-sm font-semibold text-amber-900 dark:bg-amber-400/15 dark:text-amber-200">
                    {step.number}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-foreground/60">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-16 flex flex-col justify-between gap-6 rounded-3xl border border-border bg-background p-7 sm:flex-row sm:items-center sm:p-10">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Ready to organize your next activity?
                </h3>
                <p className="mt-2 text-sm leading-6 text-foreground/60">
                  Start with the details. We will keep the process simple.
                </p>
              </div>

              <Link
                href="/sign-up"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Get started <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-sm text-foreground/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link
            href="/"
            className="font-semibold tracking-tight text-foreground"
          >
            simple<span className="text-amber-600">.</span>booking
          </Link>
          <p>Less admin. Better experiences.</p>
        </div>
      </footer>
    </div>
  );
}
