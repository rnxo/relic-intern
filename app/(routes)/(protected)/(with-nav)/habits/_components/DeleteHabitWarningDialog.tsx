"use client";

import { useRef } from "react";

export function DeleteHabitWarningDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <button onClick={() => dialogRef.current?.showModal()}>削除</button>

            <dialog ref={dialogRef} className="rounded-xl p-6 backdrop:bg-black/50">
                <p>本当に削除しますか？</p>
                <div className="flex gap-2 mt-4">
                    <button onClick={() => dialogRef.current?.close()}>キャンセル</button>
                    <button onClick={() => {
                        /* 削除処理 */
                        dialogRef.current?.close();
                    }}>削除</button>
                </div>
            </dialog>
        </>
    );
}
