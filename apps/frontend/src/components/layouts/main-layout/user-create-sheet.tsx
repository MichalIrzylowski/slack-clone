import React from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, UserPlusIcon, MailIcon, LockIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth/useAuth";

export interface CreateUserValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface Props {
  trigger?: React.ReactNode; // custom trigger override
  onCreated?: (user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }) => void;
  open?: boolean; // controlled open state
  onOpenChange?: (open: boolean) => void; // controlled open change
  hideTrigger?: boolean; // when true, do not render a trigger button
}

export const UserCreateSheet: React.FC<Props> = ({
  trigger,
  onCreated,
  open: openProp,
  onOpenChange,
  hideTrigger,
}) => {
  const { token, user } = useAuth();
  const isAdmin = /admin/i.test(user?.role ?? "");
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = (o: boolean) => {
    if (openProp !== undefined) onOpenChange?.(o);
    else setInternalOpen(o);
  };
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserValues>({
    defaultValues: { name: "", email: "", password: "", role: "member" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!isAdmin) return; // extra safeguard
    // Basic validation
    if (!values.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!values.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError("Invalid email format");
      return;
    }
    if (values.password.length < 6) {
      setError("Password min 6 chars");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const base = import.meta.env.VITE_BACKEND_URL;
      if (!base) throw new Error("VITE_BACKEND_URL not set");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${base}/users`, {
        method: "POST",
        headers,
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed (${res.status})`);
      }
      const created = await res.json();
      onCreated?.(created);
      reset();
      setOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setError(null);
          reset();
        }
      }}
    >
      {!hideTrigger && (
        <SheetTrigger asChild>
          {trigger || (
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              disabled={!isAdmin}
              title={!isAdmin ? "Admin only" : undefined}
            >
              <UserPlusIcon className="size-4 mr-1" /> New User
            </Button>
          )}
        </SheetTrigger>
      )}
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle>Create a user</SheetTitle>
          <SheetDescription>Provide basic user information.</SheetDescription>
        </SheetHeader>
        {!isAdmin && (
          <p className="p-4 text-xs text-destructive">
            Only admins can create users.
          </p>
        )}
        {isAdmin && (
          <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="flex items-center gap-1">
                <PlusIcon className="size-4 text-muted-foreground" /> Name
              </Label>
              <Input
                id="name"
                aria-invalid={!!errors.name}
                placeholder="Jane Doe"
                {...register("name")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="flex items-center gap-1">
                <MailIcon className="size-4 text-muted-foreground" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                aria-invalid={!!errors.email}
                placeholder="jane@example.com"
                {...register("email")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="flex items-center gap-1">
                <LockIcon className="size-4 text-muted-foreground" /> Temp
                Password
              </Label>
              <Input
                id="password"
                type="password"
                aria-invalid={!!errors.password}
                placeholder="min 6 chars"
                {...register("password")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role" className="flex items-center gap-1">
                Role
              </Label>
              <select
                id="role"
                className="w-full rounded-md border bg-background px-2 py-1 text-sm"
                {...register("role")}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        )}
        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
};

export default UserCreateSheet;
