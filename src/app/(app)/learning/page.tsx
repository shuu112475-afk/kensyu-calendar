import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import type { Training } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function LearningPage() {
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("trainings")
    .select("*")
    .eq("participation_status", "attended")
    .order("event_date", { ascending: false });

  const attended = (data ?? []) as Training[];

  const byYear = new Map<number, Training[]>();
  for (const training of attended) {
    const year = new Date(`${training.event_date}T00:00:00`).getFullYear();
    const list = byYear.get(year) ?? [];
    list.push(training);
    byYear.set(year, list);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">学習記録</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        参加済みの研修を年度・分野別に振り返り、受講メモは研修詳細から確認・編集できます。
      </p>

      {attended.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">
          まだ参加済みの研修がありません。研修詳細で「参加済み」に更新すると、ここに記録されます。
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {years.map((year) => {
            const trainingsInYear = byYear.get(year)!;
            const fieldCounts = new Map<string, number>();
            for (const training of trainingsInYear) {
              const field = training.field ?? "未分類";
              fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1);
            }

            return (
              <section key={year}>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold">{year}年</h2>
                  <span className="text-xs text-muted-foreground">
                    {trainingsInYear.length}件参加
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[...fieldCounts.entries()].map(([field, count]) => (
                    <Badge key={field} variant="secondary">
                      {field} {count}
                    </Badge>
                  ))}
                </div>
                <ul className="mt-3 divide-y rounded-lg border">
                  {trainingsInYear.map((training) => (
                    <li key={training.id} className="p-3">
                      <Link
                        href={`/trainings/${training.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {training.title}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatDate(training.event_date)}</span>
                        {training.field && <span>{training.field}</span>}
                        {training.key_points && <span>メモあり</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
