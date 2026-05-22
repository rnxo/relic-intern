import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "motion/react";
import { useHabits } from "@/app/features/habit/habit.state";
import { Habit } from "@/app/features/habit/habit.type";
import { PetSvg } from "./PetSvg";
import { usePet, initPetAtom } from "@/app/features/pet/pet.state";
import { useSetAtom } from "jotai";
import { Award } from "lucide-react";
import { PetEmotionStatusCard } from "./PetEmotionStatusCard";

//PetSvgの表示
//今日の完了habit数表示
//Lumi感情ステータス表示


export default function PetView() {
  const { habits } = useHabits();
  const { pet } = usePet();
  const initPet = useSetAtom(initPetAtom);

  useEffect(() => {
    initPet();
  }, []);

  const todayTotalCompletedHabits: Habit[] =
    habits?.filter((h) => h.is_completed) || [];
  const todayTotalHabitsCount: number = todayTotalCompletedHabits?.length || 0;

  return (
    <div className="flex flex-col items-center py-12 px-4 space-y-8 min-h-screen bg-[#1a1b26]">
      <motion.div
        className="relative group cursor-pointer"
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <div className="absolute -inset-4 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-linear-to-r from-[#7aa2f7] to-[#7dcfff]" />
        <div className="relative">
          <AnimatePresence mode="wait">
            {
              <motion.div
                key="lumi"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <PetSvg />
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </motion.div>


      {/* Level Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 bg-[#7aa2f7] text-white px-6 py-2 rounded-full shadow-lg"
      >
        <Award size={18} />
        <span className="font-bold text-sm">
          Level {pet?.intimate_level || 1}
        </span>
      </motion.div>

      {/* Completion Count Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-[320px]"
      >
        <Card className="w-full text-white bg-[#24283b]/50 backdrop-blur-md border border-[#414868] rounded-3xl p-8 hover:border-[#7aa2f7]/30 transition-all">
          <CardContent className="flex flex-col items-center justify-center p-0 space-y-2">
            <motion.span
              key={todayTotalHabitsCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-extrabold text-[#7aa2f7]"
            >
              {todayTotalHabitsCount}
            </motion.span>
            <span className="text-sm font-medium text-gray-400">
              今日のタスク達成数
            </span>
          </CardContent>
        </Card>
      </motion.div>
      {/*Lumi感情ステータスブロック*/}
      {pet && <PetEmotionStatusCard pet={pet} />}
      {/* <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-[320px]"
      >
        <PetEmotionStatus />
      </motion.div> */}
    </div>
  );
}

