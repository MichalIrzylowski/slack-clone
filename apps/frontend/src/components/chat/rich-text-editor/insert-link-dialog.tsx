import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export interface InsertLinkFormValues {
  onSubmit: (data: { url: string }) => void;
  isOpen: boolean;
  onOpenChange: () => void;
}

const schema = z.object({
  url: z.url(),
});

export const InsertLinkDialog = ({
  onSubmit,
  isOpen,
  onOpenChange,
}: InsertLinkFormValues) => {
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { url: "" },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <LinkIcon />
              <DialogTitle>Insert Link</DialogTitle>
            </div>
          </DialogHeader>
          <Controller
            control={control}
            name="url"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="url">URL</FieldLabel>
                <Input id="url" {...field} placeholder="www.example.com" />
                {fieldState.invalid && (
                  <FieldError>
                    {fieldState.error && "This field is required"}
                  </FieldError>
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Insert link</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
