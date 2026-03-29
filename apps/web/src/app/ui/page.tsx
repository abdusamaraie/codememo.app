// apps/web/src/app/ui/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AccentSwitcher } from "@/components/ui/accent-switcher";
import { BookOpen, ChevronDown, Code2, Layers, Palette, Sparkles, Star, Zap } from "lucide-react";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ─── Color swatch ─────────────────────────────────────────────────────────────

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-14 w-14 rounded-[12px] border border-border shadow-sm"
        style={{ backgroundColor: value }}
      />
      <span className="text-[10px] font-medium text-muted-foreground">{name}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UIPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background px-6 py-12 md:px-12">
        <div className="mx-auto max-w-4xl space-y-16">

          {/* ── Header ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/40">v1.0</Badge>
              <Badge variant="secondary">App Bootstrap Theme</Badge>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Design System</h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              CodeMemo UI — built on the App Bootstrap design system. 3-D depth buttons, 20px cards, Nunito Bold, and a dynamic accent engine.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Accent</span>
              <AccentSwitcher />
            </div>
          </div>

          {/* ── Typography ── */}
          <Section title="Typography">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-5xl font-bold tracking-tight">Display / Nunito Bold</p>
                <p className="text-2xl font-bold">Heading 2 / Bold</p>
                <p className="text-lg font-semibold">Heading 3 / Semibold</p>
                <p className="text-base text-foreground">Body — primary information and readable content.</p>
                <p className="text-sm text-muted-foreground">Small — secondary and supporting information</p>
                <p className="font-mono text-sm text-primary">
                  {"const greet = (name: string) => `Hello, ${name}!`"}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {"// JetBrains Mono — code blocks and inline code"}
                </p>
              </CardContent>
            </Card>
          </Section>

          {/* ── Color Palette ── */}
          <Section title="Color Palette">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-5">
                  <ColorSwatch name="background"  value="var(--background)" />
                  <ColorSwatch name="card"         value="var(--card)" />
                  <ColorSwatch name="secondary"    value="var(--secondary)" />
                  <ColorSwatch name="muted"        value="var(--muted)" />
                  <ColorSwatch name="primary"      value="var(--primary)" />
                  <ColorSwatch name="primary/60"   value="color-mix(in srgb, var(--primary) 60%, transparent)" />
                  <ColorSwatch name="primary/30"   value="color-mix(in srgb, var(--primary) 30%, transparent)" />
                  <ColorSwatch name="destructive"  value="var(--destructive)" />
                  <ColorSwatch name="border"       value="var(--border)" />
                  <ColorSwatch name="accent-700"   value="var(--accent-700)" />
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* ── Buttons ── */}
          <Section title="Buttons">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Variants</CardTitle>
                  <CardDescription>Six variants — primary, secondary, outline, ghost, destructive, link</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 items-end">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sizes</CardTitle>
                  <CardDescription>sm · default · lg · icon</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 items-end">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" aria-label="icon"><Zap className="h-4 w-4" /></Button>
                  <Button size="icon" variant="secondary" aria-label="star"><Star className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" aria-label="layers"><Layers className="h-4 w-4" /></Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>States</CardTitle>
                  <CardDescription>Active · Disabled</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 items-end">
                  <Button>Active</Button>
                  <Button disabled>Disabled</Button>
                  <Button variant="secondary" disabled>Secondary Disabled</Button>
                  <Button variant="outline" disabled>Outline Disabled</Button>
                  <Button variant="destructive" disabled>Destructive Disabled</Button>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* ── Badges ── */}
          <Section title="Badges">
            <Card>
              <CardContent className="pt-6 flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-primary/15 text-primary border-primary/30">Primary Soft</Badge>
                <Badge className="bg-green-500/15 text-green-400 border-green-500/30">Success</Badge>
                <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30">Warning</Badge>
                <Badge className="bg-red-500/15 text-red-400 border-red-500/30">Error</Badge>
                <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30">Info</Badge>
              </CardContent>
            </Card>
          </Section>

          {/* ── Cards ── */}
          <Section title="Cards">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Python Basics</CardTitle>
                      <CardDescription>14 sections · 150 cards</CardDescription>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span><span>62%</span>
                    </div>
                    <Progress value={62} />
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm" className="flex-1">Continue</Button>
                  <Button size="sm" variant="outline">Details</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>JavaScript ES6+</CardTitle>
                      <CardDescription>12 sections · 140 cards</CardDescription>
                    </div>
                    <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/30">In Progress</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span><span>28%</span>
                    </div>
                    <Progress value={28} />
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button size="sm" variant="secondary" className="flex-1">Continue</Button>
                  <Button size="sm" variant="outline">Details</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Today&apos;s Goal</CardTitle>
                      <CardDescription>Daily review session</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Cards reviewed</span><span>8 / 10</span>
                    </div>
                    <Progress value={80} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Perfect recalls</span><span>6 / 8</span>
                    </div>
                    <Progress value={75} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Code Block</CardTitle>
                  <CardDescription>JetBrains Mono — syntax display</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-x-auto rounded-[12px] bg-muted p-4 text-sm">
                    <code className="font-mono text-primary">
                      {`def greet(name: str) -> str:\n    """Return a greeting."""\n    return f"Hello, {name}!"`}
                    </code>
                  </pre>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="ghost"><Code2 className="h-4 w-4 mr-1" />Copy</Button>
                </CardFooter>
              </Card>
            </div>
          </Section>

          {/* ── Inputs ── */}
          <Section title="Inputs & Forms">
            <Card>
              <CardContent className="pt-6 space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Search</label>
                  <Input
                    placeholder="Search flashcards..."
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Email</label>
                  <Input type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-muted-foreground">Disabled</label>
                  <Input placeholder="Cannot edit" disabled />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Notes</label>
                  <Textarea placeholder="Write your answer or notes here..." rows={3} />
                </div>
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>
          </Section>

          {/* ── Progress ── */}
          <Section title="Progress">
            <Card>
              <CardContent className="pt-6 space-y-5 max-w-lg">
                {[
                  { label: "Daily goal",     sub: "8/10 cards",  value: 80 },
                  { label: "Perfect recalls",sub: "6/8",         value: 75 },
                  { label: "Study time",     sub: "18/20 min",   value: 90 },
                  { label: "New cards",      sub: "3/10",        value: 30 },
                ].map(({ label, sub, value }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground">{sub}</span>
                    </div>
                    <Progress value={value} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </Section>

          {/* ── Tabs ── */}
          <Section title="Tabs">
            <Tabs defaultValue="flashcards">
              <TabsList>
                <TabsTrigger value="flashcards"><Sparkles className="h-3.5 w-3.5 mr-1.5" />Flashcards</TabsTrigger>
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>
              <TabsContent value="flashcards" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Spaced Repetition</CardTitle>
                    <CardDescription>Review due cards and rate your confidence to schedule the next session.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive">Again</Button>
                      <Button size="sm" variant="secondary">Hard</Button>
                      <Button size="sm" variant="outline">Good</Button>
                      <Button size="sm">Easy</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="exercises" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Exercises</CardTitle>
                    <CardDescription>Fill-in-the-blank, multiple choice, and spot-the-error exercises.</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent value="quiz" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quiz Mode</CardTitle>
                    <CardDescription>10–15 mixed questions. 80% pass threshold. No hints allowed.</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent value="stats" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>Your learning progress over time.</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </Section>

          {/* ── Overlays (Dialog, Dropdown, Tooltip) ── */}
          <Section title="Overlays">
            <div className="flex flex-wrap gap-4 items-start">

              {/* Dialog */}
              <Card className="flex-1 min-w-[220px]">
                <CardHeader>
                  <CardTitle>Dialog</CardTitle>
                  <CardDescription>Modal with 24px radius</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Progress</DialogTitle>
                        <DialogDescription>
                          This will permanently reset your progress for Python Basics. This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="destructive">Reset</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Dropdown */}
              <Card className="flex-1 min-w-[220px]">
                <CardHeader>
                  <CardTitle>Dropdown</CardTitle>
                  <CardDescription>Menu with 12px radius items</CardDescription>
                </CardHeader>
                <CardContent>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        Options <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Course Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><BookOpen className="h-4 w-4" />Study Now</DropdownMenuItem>
                      <DropdownMenuItem><Palette className="h-4 w-4" />Customize</DropdownMenuItem>
                      <DropdownMenuItem><Star className="h-4 w-4" />Add to Favourites</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Zap className="h-4 w-4" />Reset Progress
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              {/* Tooltip */}
              <Card className="flex-1 min-w-[220px]">
                <CardHeader>
                  <CardTitle>Tooltip</CardTitle>
                  <CardDescription>12px radius on hover</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline"><Star className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Add to favourites</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline"><Code2 className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>View source</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="secondary"><Zap className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Quick study</TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>

            </div>
          </Section>

        </div>
      </div>
    </TooltipProvider>
  );
}
