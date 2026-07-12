import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { TrainingForm } from "@/components/training-form";
import { updateTraining } from "@/lib/actions/trainings";
import type { Training } from "@/lib/types";

export default async function EditTrainingPage({
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

  const updateWithId = updateTraining.bind(null, training.id);

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">研修を編集</h1>
      <div className="mt-6">
        <TrainingForm action={updateWithId} training={training} submitLabel="更新する" />
      </div>
    </div>
  );
}
