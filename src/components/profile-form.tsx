"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { updateProfile } from "@/lib/actions/profile";
import type { TrainingActionState } from "@/lib/actions/trainings";
import type { Profile } from "@/lib/types";

const initialState: TrainingActionState = { error: null };

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="occupation">職種</Label>
        <Input
          id="occupation"
          name="occupation"
          placeholder="診療放射線技師 / 看護師 など"
          defaultValue={profile?.occupation ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialty">専門分野</Label>
        <Input
          id="specialty"
          name="specialty"
          placeholder="CT / MRI / 核医学 など"
          defaultValue={profile?.specialty ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="region">地域</Label>
        <Input
          id="region"
          name="region"
          placeholder="都道府県など"
          defaultValue={profile?.region ?? ""}
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>保存する</SubmitButton>
    </form>
  );
}
