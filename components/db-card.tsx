"use client";
import { handleDbDelete } from "@/actions/deleteDb";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import prettyBytes from "pretty-bytes";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

type Props = {
  name: string;
  collections: string;
  sizeOnDisk: number;
};

export default function DbCard({ name, collections, sizeOnDisk }: Props) {
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the database <b>{name}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                await handleDbDelete(name);
                toast.success(
                  `The database "${name}" was deleted successfully.`,
                );
              } catch (error) {
                console.error(error);
                toast.error("Error deleting database");
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

      <Card
        className="group flex flex-col justify-between h-full transition-all hover:shadow-md hover:border-primary relative cursor-pointer"
        onClick={() => router.push(`/main/${name}`)}
      >
        <CardHeader className="font-medium text-base">{name}</CardHeader>
        {/* delete */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 hover:opacity-100 transition-all">
          <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button size={"icon"} variant={"destructive"}>
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
        </div>
        <CardContent className="space-y-1">
          <div className="text-xs text-muted-foreground">
            Collections: {collections}
          </div>
          <div className="text-sm font-medium">{prettyBytes(sizeOnDisk)}</div>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
