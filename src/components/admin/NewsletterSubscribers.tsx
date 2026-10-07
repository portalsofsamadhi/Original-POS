import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea"; // Unused
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { toast } from "sonner"; // if not available, replace with your toast system or remove

/**
 * NewsletterAdmin.tsx
 * A production-ready admin panel for viewing subscribers and sending newsletters.
 * - Robust fetching with abort + retry
 * - Search, pagination, selection, CSV export, copy emails
 * - Compose + send newsletter to: all / filtered / selected / test email
 * - Clean Tailwind + shadcn/ui styling
 *
 * Backend contract (adjust the endpoints below to your stack):
 * GET  /api/newsletter/subscribers
 *      -> 200 { subscribers: Array<{ email: string; name?: string; tags?: string[]; createdAt?: string }> }
 * POST /api/newsletter/send
 *      body: { subject: string; html: string; recipients: string[]; test?: boolean }
 *      -> 200 { success: true, sent: number }
 */

// ======= Configuration =======
const ENDPOINTS = {
  list: "/api/newsletter/subscribers", // Node.js backend endpoint
  send: "/api/newsletter/send",
};

// ======= Types =======
interface Subscriber {
  email: string;
  name?: string;
  tags?: string[];
  createdAt?: string; // ISO
}

// ======= Utilities =======
const _debounce = (fn: (...args: unknown[]) => void, ms = 300) => {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: unknown[]) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

const toCSV = (rows: (string | number | null | undefined)[][]) =>
  rows
    .map((r) => r.map((c) => {
      const s = c == null ? "" : String(c);
      if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
        return `"${s.replace(/"/g, "\"\"")}"`;
      }
      return s;
    }).join(","))
    .join("\n");

const download = (filename: string, text: string) => {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ======= Component =======
const NewsletterAdmin: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);

  const [composeOpen, setComposeOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const abortRef = useRef<AbortController | null>(null);

  // ---------- Fetch with retry ----------
  const fetchSubscribers = useCallback(async (retry = 1) => {
    setLoading(true); setError(null);
    abortRef.current?.abort();
    const ctl = new AbortController();
    abortRef.current = ctl;
    try {
      const res = await fetch(ENDPOINTS.list, { signal: ctl.signal, cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load subscribers (${res.status})`);
      const json = await res.json();
      const list: Subscriber[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.subscribers)
          ? json.subscribers
          : [];
      setSubscribers(list);
    } catch (e: unknown) {
      if ((e as Error).name === "AbortError") return; // ignore aborted requests
      if (retry > 0) {
        await new Promise((r) => setTimeout(r, 600));
        return fetchSubscribers(retry - 1);
      }
      setError((e as Error)?.message || "Unknown error fetching subscribers");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSubscribers]);

  useEffect(() => {
    fetchSubscribers();
    return () => abortRef.current?.abort();
  }, [fetchSubscribers]);

  // ---------- Filtering & pagination ----------
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalizedQuery) return subscribers;
    return subscribers.filter((s) =>
      [s.email, s.name, (s.tags || []).join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [subscribers, normalizedQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSafe, pageSize]);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  // ---------- Selection ----------
  const toggleAllPage = (checked: boolean) => {
    const next = { ...selected };
    pageItems.forEach((s) => { next[s.email] = checked; });
    setSelected(next);
  };
  const selectedEmails = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  // ---------- Actions ----------
  const copyEmails = async (mode: "all" | "filtered" | "selected") => {
    const list = mode === "all" ? subscribers : mode === "filtered" ? filtered : subscribers.filter(s => selected[s.email]);
    const text = list.map((s) => s.email).join(", ");
    await navigator.clipboard.writeText(text);
    toast?.success(`Copied ${list.length} email${list.length===1?"":"s"} to clipboard`);
  };

  const exportCSV = (mode: "all" | "filtered" | "selected") => {
    const list = mode === "all" ? subscribers : mode === "filtered" ? filtered : subscribers.filter(s => selected[s.email]);
    const rows = [["email", "name", "tags", "createdAt"], ...list.map((s) => [s.email, s.name || "", (s.tags||[]).join("|"), s.createdAt || ""])];
    download(`subscribers-${mode}-${new Date().toISOString().slice(0,10)}.csv`, toCSV(rows));
  };

  const refresh = () => fetchSubscribers();

  // ---------- Sending ----------
  const resolveRecipients = (mode: "all" | "filtered" | "selected"): string[] => {
    if (mode === "all") return subscribers.map((s) => s.email);
    if (mode === "filtered") return filtered.map((s) => s.email);
    return selectedEmails;
  };

  const [sendScope, setSendScope] = useState<"all" | "filtered" | "selected">("all");

  const doSend = async (opts: { test?: boolean }) => {
    const recipients = opts.test ? (testEmail ? [testEmail] : []) : resolveRecipients(sendScope);
    if (!subject.trim()) { toast?.error("Subject is required"); return; }
    if (!html.trim()) { toast?.error("Message body is required"); return; }
    if (recipients.length === 0) { toast?.error("No recipients"); return; }

    setSending(true);
    try {
      const res = await fetch(ENDPOINTS.send, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, html, recipients, test: !!opts.test }),
      });
      if (!res.ok) throw new Error(`Send failed (${res.status})`);
      const data = await res.json().catch(() => ({}));
      const sent = Number(data?.sent ?? recipients.length);
      toast?.success(opts.test ? `Test email sent to ${recipients[0]}` : `Newsletter sent to ${sent} recipient(s)`);
      if (!opts.test) setComposeOpen(false);
    } catch (e: unknown) {
      toast?.error((e as Error)?.message || "Failed to send newsletter");
    } finally {
      setSending(false);
    }
  };

  // ---------- UI ----------
  return (
    <Card className="mt-6 rounded-2xl shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl tracking-tight">Newsletter Admin</CardTitle>
            <CardDescription>View subscribers, filter, export, and send newsletters.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={refresh} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </Button>
            <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Compose Newsletter</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Compose newsletter</DialogTitle>
                  <DialogDescription>Send an announcement to your community. HTML is allowed (basic inline styles).</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label>Subject</Label>
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Message</Label>
                    <ReactQuill
                      value={html}
                      onChange={setHtml}
                      theme="snow"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link", "image"],
                          ["blockquote", "code-block"],
                          ["clean"],
                          ["divider"]
                        ]
                      }}
                      formats={[
                        "header", "bold", "italic", "underline", "strike",
                        "list", "bullet", "link", "image", "blockquote", "code-block"
                      ]}
                      style={{ minHeight: 200 }}
                    />
                    <div className="text-xs text-muted-foreground">Tip: Format text, insert images, links, dividers, and more. Output is HTML for email.</div>
                  </div>
                  <Separator />
                  <div className="grid sm:grid-cols-3 gap-3 items-end">
                    <div className="grid gap-2">
                      <Label>Send scope</Label>
                      <div className="flex gap-2">
                        <Button type="button" variant={sendScope === "all" ? "default" : "secondary"} onClick={() => setSendScope("all")}>All ({subscribers.length})</Button>
                        <Button type="button" variant={sendScope === "filtered" ? "default" : "secondary"} onClick={() => setSendScope("filtered")}>Filtered ({filtered.length})</Button>
                        <Button type="button" variant={sendScope === "selected" ? "default" : "secondary"} onClick={() => setSendScope("selected")}>Selected ({selectedEmails.length})</Button>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Test to</Label>
                      <Input value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="name@example.com" />
                    </div>
                    <div className="flex gap-2 sm:justify-end">
                      <Button type="button" variant="secondary" onClick={() => doSend({ test: true })} disabled={sending || !testEmail}>Send Test</Button>
                      <Button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => doSend({})} disabled={sending}>
                        {sending ? "Sending…" : "Send Newsletter"}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <Input
            placeholder="Search by email, name, or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-md"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => copyEmails("filtered")}>Copy Emails (Filtered)</Button>
            <Button variant="outline" onClick={() => exportCSV("filtered")}>Export CSV (Filtered)</Button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border bg-card">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 text-sm text-muted-foreground">
            <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
              <Checkbox
                checked={pageItems.every((s) => selected[s.email]) && pageItems.length > 0}
                onCheckedChange={(c) => toggleAllPage(Boolean(c))}
                aria-label="Select all on page"
              />
              <span>Email</span>
            </div>
            <div className="col-span-3 hidden sm:block">Name</div>
            <div className="col-span-2 hidden sm:block">Tags</div>
            <div className="col-span-3 sm:col-span-2 text-right">Joined</div>
          </div>
          <Separator />

          {loading && (
            <div className="p-6 text-sm text-muted-foreground">Loading subscribers…</div>
          )}
          {error && (
            <div className="p-6 text-sm text-red-600">{error}</div>
          )}

          {!loading && !error && pageItems.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground italic">No subscribers match your filter.</div>
          )}

          {!loading && !error && pageItems.length > 0 && (
            <ul className="divide-y">
              {pageItems.map((s) => (
                <li key={s.email} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm">
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
                    <Checkbox
                      checked={!!selected[s.email]}
                      onCheckedChange={(c) => setSelected((prev) => ({ ...prev, [s.email]: Boolean(c) }))}
                      aria-label={`Select ${s.email}`}
                    />
                    <div>
                      <div className="font-medium text-emerald-700">{s.email}</div>
                      <div className="sm:hidden text-xs text-muted-foreground">{s.name || "N/A"}</div>
                    </div>
                  </div>
                  <div className="col-span-3 hidden sm:flex items-center">{s.name || "N/A"}</div>
                  <div className="col-span-2 hidden sm:flex items-center gap-1 flex-wrap">
                    {(s.tags || []).length === 0 ? (
                      <span className="text-muted-foreground">N/A</span>
                    ) : (
                      (s.tags || []).map((t) => <Badge key={t} variant="secondary">{t}</Badge>)
                    )}
                  </div>
                  <div className="col-span-3 sm:col-span-2 flex items-center justify-end text-muted-foreground">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{pageItems.length}</span> of <span className="font-medium">{filtered.length}</span> filtered • Total <span className="font-medium">{subscribers.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => copyEmails("selected")} disabled={selectedEmails.length === 0}>Copy Selected</Button>
            <Button variant="outline" onClick={() => exportCSV("selected")} disabled={selectedEmails.length === 0}>Export Selected</Button>
            <Separator orientation="vertical" className="h-6" />
            <label className="text-sm">Rows
              <select className="ml-2 border rounded-md px-2 py-1" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageSafe === 1}>Prev</Button>
              <span className="text-sm">{pageSafe} / {totalPages}</span>
              <Button variant="ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages}>Next</Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => copyEmails("all")}>Copy All Emails</Button>
        <Button variant="secondary" onClick={() => exportCSV("all")}>Export All CSV</Button>
      </CardFooter>
    </Card>
  );
};

export default NewsletterAdmin;
