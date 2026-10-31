import { signout } from "@/app/auth/actions";
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react';

export function AlertSignoutDialog() {
  const handleSignOut = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await signout();
  }
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <LogOut size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-lumi-base">
        <AlertDialogHeader>
          <AlertDialogTitle>サインアウトをしますか？</AlertDialogTitle>
          <AlertDialogDescription>
            サインアウトすると、次回ログイン時に再度認証が必要になります。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => handleSignOut(e)}>サインアウト</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
