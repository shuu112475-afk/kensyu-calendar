import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { getMonthGrid, toDateKey, WEEKDAY_LABELS } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import { TrainingFilterBar } from "@/components/training-filter-bar";
import { FORMAT_LABEL, type Training } from "@/lib/types";
import { cn } from "@/lib/utils";

function monthLink(
  year: number,
  month: number,
  filters: { field?: string; format?: string } = {},
) {
  const params = new URLSearchParams({ y: String(year), m: String(month) });
  if (filters.field) params.set("field", filters.field);
  if (filters.format) params.set("format", filters.format);
  return `/?${params.toString()}`;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string; field?: string; format?: string }>;
}) {
  await requireUser();
  const { y, m, field, format } = await searchParams;

  const today = new Date();
  const year = y ? Number(y) : today.getFullYear();
  const month = m ? Number(m) : today.getMonth() + 1;

  const { monthStart, gridStart, gridEnd, weeks } = getMonthGrid(year, month);

  const supabase = await createClient();
  let query = supabase
    .from("trainings")
    .select("*")
    .gte("event_date", toDateKey(gridStart))
    .lte("event_date", toDateKey(gridEnd))
    .order("start_time", { ascending: true, nullsFirst: false });

  if (field) query = query.eq("field", field);
  if (format) query = query.eq("format", format);

  const { data } = await query;

  const trainings = (data ?? []) as Training[];
  const trainingsByDate = new Map<string, Training[]>();
  for (const training of trainings) {
    const list = trainingsByDate.get(training.event_date) ?? [];
    list.push(training);
    trainingsByDate.set(training.event_date, list);
  }

  const prevMonth = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">研修カレンダー</h1>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            render={<Link href={monthLink(prevMonth.year, prevMonth.month, { field, format })} />}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="w-28 text-center text-sm font-medium">
            {year}年{month}月
          </span>
          <Button
            variant="outline"
            size="icon"
            render={<Link href={monthLink(nextMonth.year, nextMonth.month, { field, format })} />}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            render={
              <Link
                href={monthLink(today.getFullYear(), today.getMonth() + 1, { field, format })}
              />
            }
          >
            今月
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <Suspense fallback={null}>
          <TrainingFilterBar />
        </Suspense>
      </div>

      <div className="mt-4 grid grid-cols-7 overflow-hidden rounded-lg border text-sm">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-b bg-muted px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}

        {weeks.flat().map((date) => {
          const dateKey = toDateKey(date);
          const dayTrainings = trainingsByDate.get(dateKey) ?? [];
          const isCurrentMonth = date.getMonth() === monthStart.getMonth();
          const isToday = dateKey === toDateKey(today);

          return (
            <div
              key={dateKey}
              className={cn(
                "min-h-24 border-b border-r p-1.5 align-top last:border-r-0",
                !isCurrentMonth && "bg-muted/30 text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  isToday && "bg-primary text-primary-foreground",
                )}
              >
                {date.getDate()}
              </span>
              <div className="mt-1 flex flex-col gap-1">
                {dayTrainings.map((training) => (
                  <Link
                    key={training.id}
                    href={`/trainings/${training.id}`}
                    className="block truncate rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary hover:bg-primary/20"
                    title={training.title}
                  >
                    {training.format && (
                      <span className="mr-1 text-[10px] text-muted-foreground">
                        [{FORMAT_LABEL[training.format]}]
                      </span>
                    )}
                    {training.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
