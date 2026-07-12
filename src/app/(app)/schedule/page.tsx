import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ApplicationStatusBadge,
  FavoriteBadge,
  ParticipationStatusBadge,
} from "@/components/training-status-badge";
import { toDateKey } from "@/lib/calendar";
import type { Training } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function TrainingList({ trainings, emptyText }: { trainings: Training[]; emptyText: string }) {
  if (trainings.length === 0) {
    return <p className="py-6 text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <ul className="divide-y rounded-lg border">
      {trainings.map((training) => (
        <li key={training.id} className="p-3">
          <Link
            href={`/trainings/${training.id}`}
            className="font-medium text-foreground hover:underline"
          >
            {training.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDate(training.event_date)}</span>
            {training.application_deadline && (
              <span>申込期限: {formatDate(training.application_deadline)}</span>
            )}
            {training.is_favorite && <FavoriteBadge />}
            <ApplicationStatusBadge status={training.application_status} />
            <ParticipationStatusBadge status={training.participation_status} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function SchedulePage() {
  await requireUser();
  const supabase = await createClient();

  const [favoritesRes, appliedRes, deadlineRes] = await Promise.all([
    supabase
      .from("trainings")
      .select("*")
      .eq("is_favorite", true)
      .order("event_date", { ascending: true }),
    supabase
      .from("trainings")
      .select("*")
      .eq("application_status", "applied")
      .order("event_date", { ascending: true }),
    supabase
      .from("trainings")
      .select("*")
      .not("application_deadline", "is", null)
      .eq("application_status", "not_applied")
      .gte("application_deadline", toDateKey(new Date()))
      .order("application_deadline", { ascending: true }),
  ]);

  const favorites = (favoritesRes.data ?? []) as Training[];
  const applied = (appliedRes.data ?? []) as Training[];
  const deadlines = (deadlineRes.data ?? []) as Training[];

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">参加予定</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        お気に入り・申込済みの研修や、申込期限が近い研修を確認できます。
      </p>

      <Tabs defaultValue="favorites" className="mt-6">
        <TabsList>
          <TabsTrigger value="favorites">お気に入り（{favorites.length}）</TabsTrigger>
          <TabsTrigger value="applied">申込済み（{applied.length}）</TabsTrigger>
          <TabsTrigger value="deadline">申込期限順（{deadlines.length}）</TabsTrigger>
        </TabsList>
        <TabsContent value="favorites" className="mt-4">
          <TrainingList trainings={favorites} emptyText="お気に入りに追加した研修はありません。" />
        </TabsContent>
        <TabsContent value="applied" className="mt-4">
          <TrainingList trainings={applied} emptyText="申込済みの研修はありません。" />
        </TabsContent>
        <TabsContent value="deadline" className="mt-4">
          <TrainingList trainings={deadlines} emptyText="申込期限が近い研修はありません。" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
