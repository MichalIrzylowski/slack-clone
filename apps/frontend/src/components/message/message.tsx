import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { MessageResponseDto } from "@/api/__generated__/Api";
import { MoreVertical, Edit, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/format-date";
import { MessageParser } from "../chat/message-parser/message.parser";

type MessageProps = Pick<
  MessageResponseDto,
  | "id"
  | "serializedMessage"
  | "plainTextMessage"
  | "htmlMessage"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "author"
  | "isSilentDeleted"
>;

export function Message({
  id,
  author,
  plainTextMessage,
  serializedMessage,
  htmlMessage,
  createdAt,
  updatedAt,
  deletedAt,
  isSilentDeleted,
}: MessageProps) {
  const [copied, setCopied] = useState(false);

  const isEdited = createdAt !== updatedAt && !deletedAt;
  const isDeleted = !!deletedAt || isSilentDeleted;

  const initials = (author.name || author.email || "?")
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  function handleCopy() {
    navigator.clipboard
      .writeText(plainTextMessage)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <div
      className="group relative flex w-full gap-3 px-3 py-2 text-sm hover:bg-accent/40 rounded-md"
      data-message-id={id}
    >
      <Avatar className="mt-0.5">
        {/* In future we can pass an avatar URL via author */}
        <AvatarImage alt={author.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline gap-2">
          <span className="font-medium leading-none truncate">
            {author.name || author.email}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <time
                className="text-xs text-muted-foreground cursor-default"
                dateTime={createdAt}
              >
                {formatDate(createdAt)}
              </time>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <div>Sent: {new Date(createdAt).toLocaleString()}</div>
                {isEdited && (
                  <div>Edited: {new Date(updatedAt).toLocaleString()}</div>
                )}
                {isDeleted && (
                  <div>
                    Deleted: {deletedAt && new Date(deletedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
          {isEdited && !isDeleted && (
            <span className="text-[10px] text-muted-foreground">(edited)</span>
          )}
          {isDeleted && (
            <span className="text-[10px] text-muted-foreground">(deleted)</span>
          )}
        </div>
        <div className="mt-1 whitespace-pre-wrap break-words">
          {isDeleted ? (
            <em className="text-muted-foreground/70">Message removed</em>
          ) : (
            <MessageParser text={htmlMessage} />
          )}
        </div>
      </div>
      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-sm" variant="ghost" aria-label="Message actions">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isDeleted}
              onSelect={(e) => e.preventDefault()}
            >
              <Edit className="size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isDeleted}
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="size-4" /> Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleCopy();
              }}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}{" "}
              {copied ? "Copied" : "Copy text"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator className="absolute -bottom-px left-14 right-0" />
    </div>
  );
}
