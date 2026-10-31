"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session, SESSION_TITLE_MAX_LENGTH } from "@/app/features/consultation/consultation.type";
import { useUpdateSessionTitleMutation } from "@/app/features/consultation/consultation.state";

interface Props {
  session: Session;
  onDelete: (sessionId: string) => Promise<void>;
}

// 履歴項目の「…」メニュー（タイトル編集・削除）
export function SessionItemMenu({ session, onDelete }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState(session.title);
  const updateTitle = useUpdateSessionTitleMutation();

  const trimmed = title.trim();
  const isValid = trimmed.length > 0 && trimmed.length <= SESSION_TITLE_MAX_LENGTH;

  const handleOpenEdit = () => {
    setTitle(session.title);
    setEditOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || updateTitle.isPending) return;
    try {
      await updateTitle.mutateAsync({ sessionId: session.id, title: trimmed });
      setEditOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    // 行全体のクリック（相談への移動）が発火しないように止める
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1 text-lumi-muted hover:text-lumi-fg rounded transition-colors"
            aria-label="メニューを開く"
          >
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-60 bg-lumi-base border-lumi-border/30">
          <DropdownMenuItem onSelect={handleOpenEdit}>
            <Pencil size={14} />
            タイトル編集
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <Trash2 size={14} />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* タイトル編集 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm bg-lumi-base border border-lumi-border/30">
          <form onSubmit={handleSave} className="space-y-4">
            <DialogHeader>
              <DialogTitle>タイトルを編集</DialogTitle>
            </DialogHeader>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={SESSION_TITLE_MAX_LENGTH}
              disabled={updateTitle.isPending}
              aria-label="相談タイトル"
            />
            <p className="text-xs text-lumi-muted text-right">
              {trimmed.length}/{SESSION_TITLE_MAX_LENGTH}
            </p>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={updateTitle.isPending}>
                  キャンセル
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-lumi-primary"
                disabled={!isValid || updateTitle.isPending}
              >
                {updateTitle.isPending ? "保存中..." : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 削除確認 */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-lumi-base">
          <AlertDialogHeader>
            <AlertDialogTitle>この相談を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{session.title}」のメッセージもすべて削除され、元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => onDelete(session.id)}>
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
