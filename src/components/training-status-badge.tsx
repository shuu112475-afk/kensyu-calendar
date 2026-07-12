import { Badge } from "@/components/ui/badge";
import {
  APPLICATION_STATUS_LABEL,
  PARTICIPATION_STATUS_LABEL,
  type ApplicationStatus,
  type ParticipationStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const APPLICATION_STYLE: Record<ApplicationStatus, string> = {
  not_applied: "bg-muted text-muted-foreground",
  applied: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  not_needed: "bg-muted text-muted-foreground",
};

const PARTICIPATION_STYLE: Record<ParticipationStatus, string> = {
  none: "hidden",
  planned: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  attended: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  absent: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge className={cn("border-transparent", APPLICATION_STYLE[status])}>
      {APPLICATION_STATUS_LABEL[status]}
    </Badge>
  );
}

export function ParticipationStatusBadge({ status }: { status: ParticipationStatus }) {
  if (status === "none") return null;
  return (
    <Badge className={cn("border-transparent", PARTICIPATION_STYLE[status])}>
      {PARTICIPATION_STATUS_LABEL[status]}
    </Badge>
  );
}

export function FavoriteBadge() {
  return (
    <Badge className="border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
      お気に入り
    </Badge>
  );
}
