"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/submit-button";
import { TRAINING_FIELDS, type Training } from "@/lib/types";
import type { TrainingActionState } from "@/lib/actions/trainings";

const initialState: TrainingActionState = { error: null };

export function TrainingForm({
  action,
  training,
  submitLabel,
}: {
  action: (state: TrainingActionState, formData: FormData) => Promise<TrainingActionState>;
  training?: Training;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">研修名 *</Label>
          <Input id="title" name="title" defaultValue={training?.title} required />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="overview">概要</Label>
          <Textarea id="overview" name="overview" defaultValue={training?.overview ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_date">開催日 *</Label>
          <Input
            id="event_date"
            name="event_date"
            type="date"
            defaultValue={training?.event_date}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="application_deadline">申込期限</Label>
          <Input
            id="application_deadline"
            name="application_deadline"
            type="date"
            defaultValue={training?.application_deadline ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">開始時刻</Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={training?.start_time ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">終了時刻</Label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={training?.end_time ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">開催形式</Label>
          <Select name="format" defaultValue={training?.format ?? undefined}>
            <SelectTrigger id="format" className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">オンライン</SelectItem>
              <SelectItem value="onsite">現地開催</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="field">分野</Label>
          <Select name="field" defaultValue={training?.field ?? undefined}>
            <SelectTrigger id="field" className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {TRAINING_FIELDS.map((field) => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="venue">会場</Label>
          <Input id="venue" name="venue" defaultValue={training?.venue ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prefecture">都道府県</Label>
          <Input id="prefecture" name="prefecture" defaultValue={training?.prefecture ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizer">主催者</Label>
          <Input id="organizer" name="organizer" defaultValue={training?.organizer ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_occupation">対象職種</Label>
          <Input
            id="target_occupation"
            name="target_occupation"
            defaultValue={training?.target_occupation ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fee">参加費（円）</Label>
          <Input id="fee" name="fee" type="number" min={0} defaultValue={training?.fee ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">定員</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={0}
            defaultValue={training?.capacity ?? ""}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="credit_info">単位情報</Label>
          <Input id="credit_info" name="credit_info" defaultValue={training?.credit_info ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apply_url">申込URL</Label>
          <Input
            id="apply_url"
            name="apply_url"
            type="url"
            placeholder="https://"
            defaultValue={training?.apply_url ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="detail_url">詳細URL</Label>
          <Input
            id="detail_url"
            name="detail_url"
            type="url"
            placeholder="https://"
            defaultValue={training?.detail_url ?? ""}
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
