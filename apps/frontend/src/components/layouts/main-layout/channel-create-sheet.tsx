import React, { useEffect } from "react";
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
import { usePostChannel } from "@/api/channels";

export interface CreateChannelValues {
  name: string;
  isPrivate: boolean;
}

export const ChannelCreateSheet = () => {
  const postChannel = usePostChannel();
  const [open, setOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateChannelValues>({
    defaultValues: { name: "", isPrivate: false },
  });

  const isPrivate = watch("isPrivate");

  const onSubmit = handleSubmit(async (values) => {
    postChannel.mutate(values);
  });

  useEffect(() => {
    if (postChannel.isSuccess) {
      setOpen(false);
    }
  }, [postChannel.isSuccess]);

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
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
          {postChannel.error && (
            <p className="text-xs text-destructive" role="alert">
              {postChannel.error.message}
            </p>
          )}
          <div className="flex gap-2 pt-2">
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={postChannel.isPending}
              >
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={postChannel.isPending}>
              {postChannel.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
        <SheetFooter />
      </SheetContent>
    </Sheet>
  );
};

export default ChannelCreateSheet;
