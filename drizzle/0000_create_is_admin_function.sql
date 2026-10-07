-- Returns true when the signed-in Supabase user has a row in public.admin_users.
--
-- SECURITY DEFINER lets the function read admin_users without going through
-- that table's own RLS policies (which themselves call is_admin(), and would
-- otherwise loop forever). An empty search_path stops anyone from hijacking
-- the lookup with a same-named table in another schema.
--
-- plpgsql is used because it does not require admin_users to exist yet when
-- this function is created; that table is created by the next migration.
create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  );
end;
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
