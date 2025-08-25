"use client";

import { Check, Edit2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { updateDocument } from "@/actions/updateDocument";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditableCellProps {
  documentId: string | undefined;
  field: string;
  // biome-ignore lint/suspicious/noExplicitAny: idk
  value: any;
  databaseName: string;
  collectionName: string;
}

export function EditableCell({
  documentId,
  field,
  value,
  databaseName,
  collectionName,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value || ""));
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!documentId) return;

    startTransition(async () => {
      try {
        await updateDocument({
          databaseName,
          collectionName,
          documentId,
          field,
          value: editValue,
        });

        setIsEditing(false);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    });
  };

  const handleCancel = () => {
    setEditValue(String(value || ""));
    setIsEditing(false);
  };

  if (!documentId || field === "_id") {
    return <span>{String(value || "")}</span>;
  }

  if (isEditing) {
    const isLongText = String(value || "").length > 50;

    return (
      <div className="flex items-center gap-1 min-w-0">
        {isLongText ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="min-h-[60px] text-xs"
            disabled={isPending}
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-xs"
            disabled={isPending}
          />
        )}
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={isPending}
            className="h-6 w-6 p-0"
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={isPending}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-1 min-w-0">
      <span className="truncate flex-1">{String(value || "")}</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
