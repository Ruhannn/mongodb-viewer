"use client";
import { handleDeleteCollection } from "@/actions/deleteCollection";
import { motion } from "framer-motion";
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
  dbName: string;
  collectionName: string;
  storageSize: number;
  count: number;
};

export default function CollectionCard({
  collectionName,
  dbName,
  count,
  storageSize,
}: Props) {
  const router = useRouter();

  const MotionCard = motion.create(Card);

  return (
    <AlertDialog>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the Collection <b>{collectionName}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                await handleDeleteCollection(dbName, collectionName);
                toast.success(
                  `The collection "${collectionName}" was deleted successfully.`
                );
              } catch (error) {
                console.error(error);
                toast.error("Error deleting collection");
              }
            }}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

      <MotionCard
        className="group flex flex-col justify-between h-full transition-all hover:shadow-md hover:border-primary relative cursor-pointer"
        onClick={() => router.push(`/main/${dbName}/${collectionName}`)}>
        <CardHeader className="font-medium text-base">
          {collectionName}
        </CardHeader>
        {/* delete */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 hover:opacity-100 transition-all">
          <AlertDialogTrigger
            asChild
            onClick={(e) => e.stopPropagation()}>
            <Button
              size={"icon"}
              variant={"destructive"}>
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
        </div>
        <CardContent className="space-y-1">
          <div className="text-xs text-muted-foreground">
            Documents: {count}
          </div>
          <div className="text-sm font-medium">
            Storage: {prettyBytes(storageSize)}
          </div>
        </CardContent>
      </MotionCard>
    </AlertDialog>
  );
}
