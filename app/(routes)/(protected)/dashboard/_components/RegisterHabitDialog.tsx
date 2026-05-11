"use client";

import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import type { Habit } from "@/app/features/habit/habit.type";
import { useHabits } from "@/app/features/habit/habit.state"
import { useState } from "react";

export default function RegisterHabitDialog({ habit }: { habit?: Habit }) {
    const { addNewHabit, updateHabit } = useHabits();

    // 初期値の管理：編集なら既存データ、新規ならデフォルト値
    const [formData, setFormData] = useState<Partial<Habit>>(
        habit ?? { title: "", time_block: "morning", target_days: "7", streak_days: 0, is_completed: false }
    );

    const handleUpdate = (key: keyof Habit, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (habit?.id) {
            await updateHabit(habit.id, formData); // 編集保存
        } else {
            // 新規保存
            await addNewHabit(formData);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {habit ? (
                    <Button variant="ghost" size="sm" className="text-[#345cec] hover:text-[#7aa2f7] hover:bg-[#7aa2f7]/10 rounded-xl">
                        <Pencil size={16} />
                    </Button>
                ) : (
                    <Button className="bg-[#7aa2f7] hover:bg-[#7dcfff] text-white font-bold px-6 py-6 rounded-2xl shadow-lg flex items-center gap-2 transition-all">
                        <Plus size={20} />
                        <span>習慣追加</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm bg-[#1a1b26] border-[#414868] text-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{habit ? "習慣を編集" : "習慣登録"}</DialogTitle>
                        <DialogDescription>
                            {habit ? "内容を変更してください" : "新しい習慣を登録しましょう"}
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="py-4">
                        <Field>
                            <Label>習慣名</Label>
                            <Input
                                value={formData.title ?? ""}
                                onChange={(e) => handleUpdate("title", e.target.value)}
                            />
                        </Field>
                        <Field>
                            <Label>タイムブロック</Label>
                            <TimeBlockSelector
                                value={formData.time_block}
                                onValueChange={(val) => handleUpdate("time_block", val)}
                            />
                        </Field>
                        <Field>
                            <Label>目標日数</Label>
                            <TargetDaysSelector
                                value={formData.target_days}
                                onValueChange={(val) => handleUpdate("target_days", val)}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">キャンセル</Button>
                        </DialogClose>
                        {/* type="submit" で handleSubmit が走る */}
                        <DialogClose asChild>
                            <Button type="submit">保存</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function TimeBlockSelector({
    value,
    onValueChange
}: {
    value: string | undefined,
    onValueChange: (val: string) => void
}) {

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>タイムブロック</SelectLabel>
                    <SelectItem value="morning">morning (6:00 - 9:00)</SelectItem>
                    <SelectItem value="daytime">daytime (12:00 - 15:00)</SelectItem>
                    <SelectItem value="night">night (18:00 - 21:00)</SelectItem>
                    <SelectItem value="midnight">midnight (21:00 - 24:00)</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function TargetDaysSelector({
    value,
    onValueChange
}: {
    value: string | undefined,
    onValueChange: (val: string) => void
}) {
    return (
        <div className="flex gap-2 items-center justify-center">
            <Button variant={value === "7" ? "default" : "outline"} onClick={() => onValueChange("7")}>7日</Button>
            <Button variant={value === "14" ? "default" : "outline"} onClick={() => onValueChange("14")}>14日</Button>
            <Button variant={value === "21" ? "default" : "outline"} onClick={() => onValueChange("21")}>21日</Button>
            <Button variant={value === "30" ? "default" : "outline"} onClick={() => onValueChange("30")}>30日</Button>
        </div>
    )
}
