"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type {
  ApplicationStatus,
  ParticipationStatus,
  TrainingFormat,
} from "@/lib/types";

export type TrainingActionState = { error: string | null };

function optionalText(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

function optionalNumber(formData: FormData, key: string): number | null {
  const value = optionalText(formData, key);
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildTrainingPayload(formData: FormData) {
  const title = optionalText(formData, "title");
  const eventDate = optionalText(formData, "event_date");

  if (!title || !eventDate) {
    return { error: "研修名と開催日は必須です。" } as const;
  }

  const format = optionalText(formData, "format") as TrainingFormat | null;

  return {
    error: null,
    payload: {
      title,
      event_date: eventDate,
      overview: optionalText(formData, "overview"),
      start_time: optionalText(formData, "start_time"),
      end_time: optionalText(formData, "end_time"),
      format,
      venue: optionalText(formData, "venue"),
      prefecture: optionalText(formData, "prefecture"),
      organizer: optionalText(formData, "organizer"),
      target_occupation: optionalText(formData, "target_occupation"),
      field: optionalText(formData, "field"),
      fee: optionalNumber(formData, "fee"),
      capacity: optionalNumber(formData, "capacity"),
      credit_info: optionalText(formData, "credit_info"),
      apply_url: optionalText(formData, "apply_url"),
      detail_url: optionalText(formData, "detail_url"),
      application_deadline: optionalText(formData, "application_deadline"),
    },
  } as const;
}

export async function createTraining(
  _prevState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  const user = await requireUser();
  const result = buildTrainingPayload(formData);
  if (result.error) return { error: result.error };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trainings")
    .insert({ ...result.payload, user_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "研修の登録に失敗しました。時間をおいて再度お試しください。" };
  }

  revalidatePath("/");
  redirect(`/trainings/${data.id}`);
}

export async function updateTraining(
  id: string,
  _prevState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  await requireUser();
  const result = buildTrainingPayload(formData);
  if (result.error) return { error: result.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("trainings")
    .update(result.payload)
    .eq("id", id);

  if (error) {
    return { error: "研修の更新に失敗しました。時間をおいて再度お試しください。" };
  }

  revalidatePath("/");
  revalidatePath(`/trainings/${id}`);
  redirect(`/trainings/${id}`);
}

export async function deleteTraining(id: string) {
  await requireUser();
  const supabase = await createClient();
  await supabase.from("trainings").delete().eq("id", id);
  revalidatePath("/");
  redirect("/");
}

export async function toggleFavorite(id: string, next: boolean) {
  await requireUser();
  const supabase = await createClient();
  await supabase.from("trainings").update({ is_favorite: next }).eq("id", id);
  revalidatePath("/");
  revalidatePath(`/trainings/${id}`);
  revalidatePath("/schedule");
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
) {
  await requireUser();
  const supabase = await createClient();
  await supabase.from("trainings").update({ application_status: status }).eq("id", id);
  revalidatePath("/");
  revalidatePath(`/trainings/${id}`);
  revalidatePath("/schedule");
}

export async function updateParticipationStatus(
  id: string,
  status: ParticipationStatus,
) {
  await requireUser();
  const supabase = await createClient();
  await supabase
    .from("trainings")
    .update({ participation_status: status })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath(`/trainings/${id}`);
  revalidatePath("/schedule");
  revalidatePath("/learning");
}

export type LearningNoteInput = {
  key_points: string | null;
  learnings: string | null;
  work_application: string | null;
  resource_url: string | null;
};

export async function updateLearningNote(
  id: string,
  _prevState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("trainings")
    .update({
      key_points: optionalText(formData, "key_points"),
      learnings: optionalText(formData, "learnings"),
      work_application: optionalText(formData, "work_application"),
      resource_url: optionalText(formData, "resource_url"),
    })
    .eq("id", id);

  if (error) {
    return { error: "学習メモの保存に失敗しました。" };
  }

  revalidatePath(`/trainings/${id}`);
  revalidatePath("/learning");
  return { error: null };
}
