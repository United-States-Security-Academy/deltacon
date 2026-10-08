import { LogOut } from "lucide-react";

import { signOutAdmin } from "@/server/actions/admin/admin-auth-actions";

export function SignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-navy-100 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut aria-hidden="true" className="size-5" />
        Sign out
      </button>
    </form>
  );
}
