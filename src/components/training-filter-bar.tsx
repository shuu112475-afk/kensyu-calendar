"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TRAINING_FIELDS, FORMAT_LABEL } from "@/lib/types";

export function TrainingFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const field = searchParams.get("field") ?? "";
  const format = searchParams.get("format") ?? "";
  const hasFilter = field !== "" || format !== "";

  function updateParam(key: "field" | "format", value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={field} onValueChange={(value) => updateParam("field", value)}>
        <SelectTrigger className="w-36" size="sm">
          <SelectValue placeholder="分野で絞り込み" />
        </SelectTrigger>
        <SelectContent>
          {TRAINING_FIELDS.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={format} onValueChange={(value) => updateParam("format", value)}>
        <SelectTrigger className="w-40" size="sm">
          <SelectValue placeholder="開催形式で絞り込み" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="online">{FORMAT_LABEL.online}</SelectItem>
          <SelectItem value="onsite">{FORMAT_LABEL.onsite}</SelectItem>
        </SelectContent>
      </Select>

      {hasFilter && (
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          絞り込みを解除
        </Button>
      )}
    </div>
  );
}
