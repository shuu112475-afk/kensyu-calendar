"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  toggleFavorite,
  updateApplicationStatus,
  updateParticipationStatus,
} from "@/lib/actions/trainings";
import {
  APPLICATION_STATUS_LABEL,
  PARTICIPATION_STATUS_LABEL,
  type ApplicationStatus,
  type ParticipationStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export function TrainingQuickActions({
  trainingId,
  isFavorite,
  applicationStatus,
  participationStatus,
}: {
  trainingId: string;
  isFavorite: boolean;
  applicationStatus: ApplicationStatus;
  participationStatus: ParticipationStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => startTransition(() => toggleFavorite(trainingId, !isFavorite))}
        className={cn(isFavorite && "border-amber-300 text-amber-700")}
      >
        <Star className={cn("h-4 w-4", isFavorite && "fill-amber-400 text-amber-400")} />
        {isFavorite ? "お気に入り済み" : "お気に入りに追加"}
      </Button>

      <Select
        value={applicationStatus}
        onValueChange={(value) =>
          value &&
          startTransition(() =>
            updateApplicationStatus(trainingId, value as ApplicationStatus),
          )
        }
      >
        <SelectTrigger size="sm" className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(APPLICATION_STATUS_LABEL).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={participationStatus}
        onValueChange={(value) =>
          value &&
          startTransition(() =>
            updateParticipationStatus(trainingId, value as ParticipationStatus),
          )
        }
      >
        <SelectTrigger size="sm" className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PARTICIPATION_STATUS_LABEL).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
