import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ApplicationStatusBadge,
  FavoriteBadge,
  ParticipationStatusBadge,
} from "@/components/training-status-badge";
import { TrainingQuickActions } from "@/components/training-quick-actions";
import { TrainingNoteForm } from "@/components/training-note-form";
import { FORMAT_LABEL, type Training } from "@/lib/types";
import { deleteTraining } from "@/lib/actions/trainings";

function formatDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default async function TrainingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase.from("trainings").select("*").eq("id", id).single();
  const training = data as Training | null;

  if (!training) {
    notFound();
  }

  const deleteWithId = deleteTraining.bind(null, training.id);

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{training.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate(training.event_date)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {training.is_favorite && <FavoriteBadge />}
          <ApplicationStatusBadge status={training.application_status} />
          <ParticipationStatusBadge status={training.participation_status} />
        </div>
      </div>

      {training.overview && (
        <p className="mt-4 whitespace-pre-wrap text-sm text-foreground">{training.overview}</p>
      )}

      <div className="mt-4">
        <TrainingQuickActions
          trainingId={training.id}
          isFavorite={training.is_favorite}
          applicationStatus={training.application_status}
          participationStatus={training.participation_status}
        />
      </div>

      <Separator className="my-6" />

      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        <InfoRow label="開始・終了時刻">
          {training.start_time ?? "-"} 〜 {training.end_time ?? "-"}
        </InfoRow>
        <InfoRow label="開催形式">
          {training.format ? FORMAT_LABEL[training.format] : "-"}
        </InfoRow>
        <InfoRow label="会場">{training.venue ?? "-"}</InfoRow>
        <InfoRow label="都道府県">{training.prefecture ?? "-"}</InfoRow>
        <InfoRow label="主催者">{training.organizer ?? "-"}</InfoRow>
        <InfoRow label="対象職種">{training.target_occupation ?? "-"}</InfoRow>
        <InfoRow label="分野">{training.field ?? "-"}</InfoRow>
        <InfoRow label="参加費">
          {training.fee != null ? `${training.fee.toLocaleString()}円` : "-"}
        </InfoRow>
        <InfoRow label="定員">{training.capacity ?? "-"}</InfoRow>
        <InfoRow label="単位情報">{training.credit_info ?? "-"}</InfoRow>
        <InfoRow label="申込期限">
          {training.application_deadline ? formatDate(training.application_deadline) : "-"}
        </InfoRow>
        <InfoRow label="詳細URL">
          {training.detail_url ? (
            <a
              href={training.detail_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              公式ページを見る
            </a>
          ) : (
            "-"
          )}
        </InfoRow>
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        {training.apply_url && (
          <Button
            nativeButton={false}
            render={<a href={training.apply_url} target="_blank" rel="noopener noreferrer" />}
          >
            申込ページを開く
          </Button>
        )}
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/trainings/${training.id}/edit`} />}
        >
          編集する
        </Button>
        <form action={deleteWithId}>
          <Button variant="destructive" type="submit">
            削除する
          </Button>
        </form>
      </div>

      <Separator className="my-6" />

      <div>
        <h2 className="text-base font-semibold">受講メモ</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          参加後の要点・学び・業務への活用を記録できます。
        </p>
        <div className="mt-4">
          <TrainingNoteForm training={training} />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{children}</dd>
    </div>
  );
}
