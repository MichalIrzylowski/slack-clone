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
import { PlusIcon, LockIcon, HashIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/auth/useAuth";

export interface CreateChannelValues {
  name: string;
  isPrivate: boolean;
}

interface Props {
  onCreated?: (channel: {
    id: string;
    name: string;
    isPrivate: boolean;
  }) => void;
}

export const ChannelCreateSheet: React.FC<Props> = ({ onCreated }) => {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateChannelValues>({
    defaultValues: { name: "", isPrivate: false },
  });

  const isPrivate = watch("isPrivate");

  const onSubmit = handleSubmit(async (values) => {
    // Basic validation
    if (!values.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!/^[a-z0-9-_]+$/i.test(values.name)) {
      setError("Only letters, numbers, dash, underscore");
      return;
    }
    if (values.name.length > 50) {
      setError("Max 50 chars");
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
      const res = await fetch(`${base}/channels`, {
        method: "POST",
        headers,
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Failed (${res.status})`);
      }
      const channel = await res.json();
      onCreated?.(channel);
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
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          aria-label="Add channel"
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Login required" : undefined}
        >
          <PlusIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0">
        <SheetHeader>
          <SheetTitle>Create a channel</SheetTitle>
          <SheetDescription>
            Channels help organize conversations.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
          <div className="space-y-1">
            <Label htmlFor="name" className="flex items-center gap-1">
              <HashIcon className="size-4 text-muted-foreground" /> Name
            </Label>
            <Input
              id="name"
              placeholder="channel-name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isPrivate"
              type="checkbox"
              className="size-4 accent-primary"
              {...register("isPrivate")}
            />
            <Label
              htmlFor="isPrivate"
              className="flex items-center gap-1 select-none"
            >
              <LockIcon className="size-4 text-muted-foreground" /> Private
            </Label>
          </div>
          {isPrivate && (
            <p className="text-xs text-muted-foreground -mt-2">
              Only invited members can view or join this channel.
            </p>
          )}
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
              {submitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
};

export default ChannelCreateSheet;
