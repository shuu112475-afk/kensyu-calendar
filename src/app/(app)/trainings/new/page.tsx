import { TrainingForm } from "@/components/training-form";
import { createTraining } from "@/lib/actions/trainings";

export default function NewTrainingPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">研修を登録</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        気になる研修の情報を登録すると、カレンダーに反映されます。
      </p>
      <div className="mt-6">
        <TrainingForm action={createTraining} submitLabel="登録する" />
      </div>
    </div>
  );
}
