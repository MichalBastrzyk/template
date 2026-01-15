import { createFileRoute } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/")({
  component: App,
  headers: () => ({
    "CDN-Cache-Control":
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    "Cache-Control":
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
  }),
});

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary/10 via-background to-accent/10" />
        <div className="bg-[radial-gradient(circle,var(--color-primary),transparent_60%)]/[25] absolute -top-24 left-1/2 h-112 w-md -translate-x-1/2 rounded-full blur-3xl" />

        <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/90 text-sm font-semibold text-primary-foreground">
              NS
            </div>
            <div className="text-sm font-semibold tracking-tight">Newstore</div>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a
              className="text-muted-foreground transition hover:text-foreground"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-muted-foreground transition hover:text-foreground"
              href="#tour"
            >
              Product tour
            </a>
            <a
              className="text-muted-foreground transition hover:text-foreground"
              href="#pricing"
            >
              Pricing
            </a>
            <a
              className="text-muted-foreground transition hover:text-foreground"
              href="#testimonials"
            >
              Stories
            </a>
            <a
              className="text-muted-foreground transition hover:text-foreground"
              href="#faq"
            >
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
            <Button size="sm">Get started</Button>
          </div>
        </header>

        <section className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 pt-10 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit">
              Built for modern commerce teams
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Turn product launches into revenue—beautifully, fast, and at
              scale.
            </h1>
            <p className="text-lg text-balance text-muted-foreground">
              Newstore is the premium storefront framework for brands that care
              about conversion, brand control, and design polish. Launch
              campaigns, manage inventory, and personalize every touchpoint in
              minutes.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="px-6">
                Start free trial
              </Button>
              <Button size="lg" variant="outline" className="px-6">
                Book a demo
              </Button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex w-full items-center gap-2 rounded-xl bg-background/80 px-3 py-2.5 ring-1 ring-foreground/10 sm:max-w-sm">
                <Input placeholder="Work email" aria-label="Work email" />
                <Button size="sm">Notify me</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Join 3,200+ teams building with Newstore.
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-primary">
                  99.99%
                </span>
                uptime SLA
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-primary">
                  2x
                </span>
                faster checkouts
              </div>
            </div>
          </div>
          <div className="relative">
            <Card className="border-border/60 bg-card/70 shadow-2xl">
              <CardHeader>
                <CardTitle>Campaign Control Center</CardTitle>
                <CardDescription>
                  Drag-and-drop storytelling, realtime inventory, and
                  AI-assisted personalization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-40 rounded-xl border border-dashed bg-muted/70" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs">
                    <span className="text-muted-foreground">Active drops</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs">
                    <span className="text-muted-foreground">
                      Inventory synced
                    </span>
                    <span className="font-medium">98%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-xs text-muted-foreground">
                  Last refreshed 2 min ago
                </div>
                <Button size="sm" variant="secondary">
                  View dashboard
                </Button>
              </CardFooter>
            </Card>
            <div className="absolute -top-6 -right-4 rounded-2xl bg-primary/10 px-4 py-2 text-xs text-primary shadow-lg">
              +42% conversion lift
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 pb-10">
        <div className="grid grid-cols-2 items-center gap-6 text-xs text-muted-foreground md:grid-cols-5">
          <span>Pulse Athletics</span>
          <span>Northwind Studio</span>
          <span>Glide Collective</span>
          <span>Atlas & Co</span>
          <span>Orbital Labs</span>
        </div>
      </section>

      <Separator className="mx-auto w-full max-w-6xl" />

      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <Badge variant="outline" className="w-fit">
              What you get
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Every surface designed to convert.
            </h2>
            <p className="text-base text-muted-foreground">
              Activate immersive product stories, lightning-fast checkouts, and
              unified commerce analytics. All powered by a design system that
              feels like your brand.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Instant launch templates",
                "Live inventory sync",
                "AI-powered personalization",
                "Global-ready localization",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 inline-flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Brand storytelling",
                description:
                  "Compose cinematic collection pages with drag-and-drop blocks.",
              },
              {
                title: "Instant A/B testing",
                description:
                  "Ship experiments in minutes and watch conversion rise.",
              },
              {
                title: "Unified fulfillment",
                description:
                  "Connect stores, warehouses, and dropship partners effortlessly.",
              },
              {
                title: "Performance budgets",
                description:
                  "Autotune assets to hit Core Web Vitals every time.",
              },
            ].map((feature) => (
              <Card key={feature.title} size="sm" className="bg-card/70">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-20 rounded-lg border border-dashed bg-muted/60" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="tour" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge variant="outline" className="w-fit">
              Product tour
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Orchestrate every moment from one canvas.
            </h2>
            <p className="text-base text-muted-foreground">
              Switch between launch playbooks, checkout improvements, and
              fulfillment automations without losing momentum.
            </p>
            <Tabs defaultValue="launch" className="gap-4">
              <TabsList variant="line" className="w-full justify-start">
                <TabsTrigger value="launch">Launch</TabsTrigger>
                <TabsTrigger value="checkout">Checkout</TabsTrigger>
                <TabsTrigger value="ops">Ops</TabsTrigger>
              </TabsList>
              <TabsContent value="launch" className="space-y-4">
                <Card className="bg-card/70">
                  <CardHeader>
                    <CardTitle>Drop playbooks</CardTitle>
                    <CardDescription>
                      Sequence product reveals, creator collabs, and limited
                      runs in minutes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={72}>
                      <ProgressLabel>Launch readiness</ProgressLabel>
                      <ProgressValue>
                        {(_, value) => (value ? `${value}%` : "--")}
                      </ProgressValue>
                    </Progress>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border bg-background px-3 py-2 text-xs">
                        <p className="text-muted-foreground">
                          Campaigns queued
                        </p>
                        <p className="text-sm font-semibold">8</p>
                      </div>
                      <div className="rounded-lg border bg-background px-3 py-2 text-xs">
                        <p className="text-muted-foreground">Content synced</p>
                        <p className="text-sm font-semibold">94%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="checkout" className="space-y-4">
                <Card className="bg-card/70">
                  <CardHeader>
                    <CardTitle>Checkout studio</CardTitle>
                    <CardDescription>
                      Optimize payment flows and recovery journeys with smart
                      defaults.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={88}>
                      <ProgressLabel>Conversion lift</ProgressLabel>
                      <ProgressValue>{() => "+18%"}</ProgressValue>
                    </Progress>
                    <div className="rounded-lg border bg-background px-3 py-2 text-xs">
                      <p className="text-muted-foreground">
                        Top performing flow
                      </p>
                      <p className="text-sm font-semibold">One-tap checkout</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ops" className="space-y-4">
                <Card className="bg-card/70">
                  <CardHeader>
                    <CardTitle>Fulfillment engine</CardTitle>
                    <CardDescription>
                      Route orders to stores, warehouses, or partners based on
                      margin and speed.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={81}>
                      <ProgressLabel>On-time shipments</ProgressLabel>
                      <ProgressValue>
                        {(_, value) => (value ? `${value}%` : "--")}
                      </ProgressValue>
                    </Progress>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border bg-background px-3 py-2 text-xs">
                        <p className="text-muted-foreground">Smart reroutes</p>
                        <p className="text-sm font-semibold">34</p>
                      </div>
                      <div className="rounded-lg border bg-background px-3 py-2 text-xs">
                        <p className="text-muted-foreground">
                          Savings last week
                        </p>
                        <p className="text-sm font-semibold">$12.4k</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="relative">
            <Carousel className="relative">
              <CarouselContent>
                {[
                  "Launch dashboard",
                  "Creative approvals",
                  "Inventory pulse",
                ].map((label) => (
                  <CarouselItem key={label}>
                    <Card className="bg-card/70">
                      <CardHeader>
                        <CardTitle>{label}</CardTitle>
                        <CardDescription>
                          Preview how your team collaborates in real time.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48 rounded-xl border border-dashed bg-muted/60" />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:inline-flex" />
              <CarouselNext className="hidden md:inline-flex" />
            </Carousel>
          </div>
        </div>
      </section>

      <section id="ops" className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-card/70">
            <CardHeader>
              <CardTitle>Live ops health</CardTitle>
              <CardDescription>
                Monitor inventory, fulfillment, and payments without
                spreadsheets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={96}>
                <ProgressLabel>Inventory sync</ProgressLabel>
                <ProgressValue>
                  {(_, value) => (value ? `${value}%` : "--")}
                </ProgressValue>
              </Progress>
              <Progress value={82}>
                <ProgressLabel>Fulfillment SLA</ProgressLabel>
                <ProgressValue>
                  {(_, value) => (value ? `${value}%` : "--")}
                </ProgressValue>
              </Progress>
              <Progress value={91}>
                <ProgressLabel>Payment authorization</ProgressLabel>
                <ProgressValue>
                  {(_, value) => (value ? `${value}%` : "--")}
                </ProgressValue>
              </Progress>
            </CardContent>
          </Card>
          <Card className="bg-card/70">
            <CardHeader>
              <CardTitle>Launch timeline</CardTitle>
              <CardDescription>
                Stay ahead with a shared checklist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Milestone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      item: "Creative approvals",
                      status: "Complete",
                      owner: "Avery",
                    },
                    {
                      item: "Inventory lock",
                      status: "In progress",
                      owner: "Luis",
                    },
                    {
                      item: "Global pricing",
                      status: "Scheduled",
                      owner: "Juno",
                    },
                  ].map((row) => (
                    <TableRow key={row.item}>
                      <TableCell>{row.item}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.status}
                      </TableCell>
                      <TableCell>{row.owner}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid gap-6 rounded-2xl border bg-muted/40 p-6 md:grid-cols-3">
          {[
            { label: "Avg. order value", value: "$128" },
            { label: "Faster launches", value: "6x" },
            { label: "Revenue uplift", value: "+34%" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="integrations"
        className="mx-auto w-full max-w-6xl px-6 pb-16"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <Badge variant="outline" className="w-fit">
              Integrations
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Plug into the tools your teams already love.
            </h2>
            <p className="text-base text-muted-foreground">
              Connect marketing, ops, and finance stacks with one secure data
              plane.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Shopify",
                "Stripe",
                "Segment",
                "Klaviyo",
                "Snowflake",
                "NetSuite",
              ].map((name) => (
                <Tooltip key={name}>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="cursor-default">
                      {name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Live sync enabled</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
          <Card className="bg-card/70">
            <CardHeader>
              <CardTitle>Data orchestration</CardTitle>
              <CardDescription>
                Keep every system updated with intelligent routing and audit
                trails.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Events / min", value: "18.2k" },
                  { label: "Destinations", value: "42" },
                  { label: "Latency", value: "120ms" },
                  { label: "Retries saved", value: "1.3k" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border bg-background px-3 py-2 text-xs"
                  >
                    <p className="text-muted-foreground">{stat.label}</p>
                    <p className="text-sm font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="flex flex-col gap-4">
          <Badge variant="outline" className="w-fit">
            Pricing
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Premium plans for ambitious brands.
          </h2>
          <p className="text-base text-muted-foreground">
            Scale from your first drop to global expansion with transparent,
            flexible pricing.
          </p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {[
            {
              name: "Launch",
              price: "$199",
              note: "For emerging teams",
              cta: "Start launch",
            },
            {
              name: "Scale",
              price: "$499",
              note: "For growth-focused brands",
              cta: "Choose scale",
              highlighted: true,
            },
            {
              name: "Enterprise",
              price: "Custom",
              note: "For global retail ecosystems",
              cta: "Talk to sales",
            },
          ].map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "border-primary/60 bg-primary/5 shadow-xl"
                  : "bg-card/70"
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlighted ? <Badge>Most popular</Badge> : null}
                </div>
                <CardDescription>{plan.note}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-semibold tracking-tight">
                  {plan.price}
                  {plan.price !== "Custom" ? (
                    <span className="text-sm text-muted-foreground">/mo</span>
                  ) : null}
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Unlimited collections</li>
                  <li>Realtime inventory sync</li>
                  <li>Brand design system</li>
                  <li>24/7 priority support</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="testimonials"
        className="mx-auto w-full max-w-6xl px-6 pb-20"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="w-fit">
              Customer stories
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Teams shipping unforgettable experiences.
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            View all stories
          </Button>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            {
              quote:
                "We launched a global capsule in 48 hours and beat our revenue target by 62%.",
              name: "Avery Ng",
              role: "VP Commerce, Pulse Athletics",
            },
            {
              quote:
                "Newstore made personalization feel cinematic. Our NPS jumped 18 points in one quarter.",
              name: "Luis Moreno",
              role: "Head of Digital, Northwind Studio",
            },
          ].map((story) => (
            <Card key={story.name} className="bg-card/70">
              <CardHeader>
                <CardDescription>“{story.quote}”</CardDescription>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1">
                <div className="text-sm font-medium">{story.name}</div>
                <div className="text-xs text-muted-foreground">
                  {story.role}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section id="team" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-8 rounded-2xl border bg-muted/40 p-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <Badge variant="outline" className="w-fit">
              Your launch crew
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              A dedicated squad for every drop.
            </h2>
            <p className="text-base text-muted-foreground">
              Designers, operators, and analysts move as one with live
              collaboration and shared KPIs.
            </p>
            <AvatarGroup>
              {[
                { name: "Avery", initials: "AN" },
                { name: "Luis", initials: "LM" },
                { name: "Juno", initials: "JR" },
              ].map((member) => (
                <Tooltip key={member.name}>
                  <TooltipTrigger aria-label={`${member.name} profile`}>
                    <Avatar size="lg">
                      <AvatarImage
                        src={`https://i.pravatar.cc/100?u=${member.name}`}
                        alt={member.name}
                      />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                      <AvatarBadge />
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{member.name} · Always online</TooltipContent>
                </Tooltip>
              ))}
            </AvatarGroup>
          </div>
          <Card className="bg-card/70">
            <CardHeader>
              <CardTitle>Weekly ritual</CardTitle>
              <CardDescription>
                Align on launches, risks, and wins in 20 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Launch retro & insights",
                "Inventory exceptions",
                "Creative pipeline review",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <span className="inline-flex size-2 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit">
              FAQ
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Questions, answered.
            </h2>
            <p className="text-base text-muted-foreground">
              Everything you need to know about switching, launching, and
              scaling.
            </p>
          </div>
          <Accordion defaultValue={["item-1"]} className="gap-2">
            {[
              {
                id: "item-1",
                question: "Can we migrate from our current storefront?",
                answer:
                  "Yes. Our onboarding team maps your catalog, themes, and integrations in under two weeks with zero downtime.",
              },
              {
                id: "item-2",
                question: "How fast can we launch a campaign?",
                answer:
                  "Most teams launch in under a day. Templates, smart sections, and AI copy shorten the process dramatically.",
              },
              {
                id: "item-3",
                question: "Do you support global inventory?",
                answer:
                  "Absolutely. Use location-aware fulfillment, multi-currency, and localized checkout flows out of the box.",
              },
            ].map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <Card className="bg-linear-to-r from-primary/10 via-background to-accent/10">
          <CardHeader>
            <CardTitle>Ready to launch your next era?</CardTitle>
            <CardDescription>
              Bring your brand to life with premium templates, personalized
              shopping, and commerce intelligence.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="px-6">
              Start building
            </Button>
            <Button size="lg" variant="outline" className="px-6">
              Talk to product
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 pb-10 text-sm">
        <div className="flex flex-col justify-between gap-6 border-t pt-6 md:flex-row">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Newstore</div>
            <p className="text-xs text-muted-foreground">
              Modern commerce for design-led brands.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
            <a className="hover:text-foreground" href="#features">
              Features
            </a>
            <a className="hover:text-foreground" href="#tour">
              Product tour
            </a>
            <a className="hover:text-foreground" href="#pricing">
              Pricing
            </a>
            <a className="hover:text-foreground" href="#integrations">
              Integrations
            </a>
            <a className="hover:text-foreground" href="#team">
              Team
            </a>
            <a className="hover:text-foreground" href="#faq">
              FAQ
            </a>
            <a className="hover:text-foreground" href="#">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
