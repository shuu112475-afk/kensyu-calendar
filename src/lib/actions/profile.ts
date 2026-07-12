"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { TrainingActionState } from "@/lib/actions/trainings";

export async function updateProfile(
  _prevState: TrainingActionState,
  formData: FormData,
): Promise<TrainingActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const occupation = String(formData.get("occupation") ?? "").trim() || null;
  const specialty = String(formData.get("specialty") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, occupation, specialty, region });

  if (error) {
    return { error: "プロフィールの保存に失敗しました。" };
  }

  revalidatePath("/mypage");
  return { error: null };
}
