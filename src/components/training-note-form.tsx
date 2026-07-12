"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { updateLearningNote, type TrainingActionState } from "@/lib/actions/trainings";
import type { Training } from "@/lib/types";

const initialState: TrainingActionState = { error: null };

export function TrainingNoteForm({ training }: { training: Training }) {
  const action = updateLearningNote.bind(null, training.id);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="key_points">要点</Label>
        <Textarea id="key_points" name="key_points" defaultValue={training.key_points ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="learnings">学び</Label>
        <Textarea id="learnings" name="learnings" defaultValue={training.learnings ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="work_application">業務への活用</Label>
        <Textarea
          id="work_application"
          name="work_application"
          defaultValue={training.work_application ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resource_url">資料URL</Label>
        <Input
          id="resource_url"
          name="resource_url"
          type="url"
          placeholder="https://"
          defaultValue={training.resource_url ?? ""}
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>メモを保存</SubmitButton>
    </form>
  );
}
