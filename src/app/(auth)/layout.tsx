export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">研修カレンダー</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            医療従事者向け勉強会・研修管理システム
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
