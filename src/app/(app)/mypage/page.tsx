import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";
import { logout } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

export default async function MyPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = data as Profile | null;

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold">マイページ</h1>
      <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>

      <div className="mt-6">
        <ProfileForm profile={profile} />
      </div>

      <form action={logout} className="mt-8">
        <Button variant="outline" type="submit">
          ログアウト
        </Button>
      </form>
    </div>
  );
}
