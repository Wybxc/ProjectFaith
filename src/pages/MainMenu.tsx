import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AppTitle } from "@/components/ui/AppTitle";
import { Card } from "@/components/ui/Card";
import { TabButton } from "@/components/ui/TabButton";
import { Background } from "@/components/ui/Background";

interface DeckForm {
  deck: string;
}

export default function MainMenu() {
  const [activeTab, setActiveTab] = useState<"select" | "edit">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<DeckForm>({
    defaultValues: {
      deck: "",
    },
  });

  const onSubmit = async (data: DeckForm) => {
    setIsSubmitting(true);
    try {
      if (activeTab === "select") {
        const savedDeck = localStorage.getItem(`deck:${data.deck}`);
        if (!savedDeck) {
          setError("deck", { message: "卡组不存在" });
          return;
        }
        navigate(`/game/${data.deck}`);
      } else {
        navigate(`/deck-builder/${data.deck}`);
      }
    } catch (error) {
      setError("deck", { message: "操作失败，请重试" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab: "select" | "edit") => {
    setActiveTab(tab);
    reset();
  };

  return (
    <Background className="flex flex-col items-center justify-center p-2 sm:p-4">
      <AppTitle title="信念计划" subtitle="卡牌对战游戏" />
      <Card className="max-w-md landscape:max-w-[460px] animate-fade-in">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="tabs tabs-boxed glass-panel mb-3 gap-2 flex p-1 rounded-lg">
            <TabButton
              active={activeTab === "select"}
              label="选择卡组"
              onClick={() => handleTabChange("select")}
              className="flex-1 transition-all duration-300"
            />
            <TabButton
              active={activeTab === "edit"}
              label="编辑卡组"
              onClick={() => handleTabChange("edit")}
              className="flex-1 transition-all duration-300"
            />
          </div>

          <div className="form-control">
            <input
              type="text"
              placeholder={
                activeTab === "select" ? "输入卡组名称" : "创建或选择卡组"
              }
              className="input-primary"
              {...register("deck", { required: "请输入卡组名称" })}
              aria-invalid={errors.deck ? "true" : "false"}
              aria-describedby={errors.deck ? "deck-error" : undefined}
            />
            {errors.deck && (
              <div
                id="deck-error"
                className="text-error text-sm mt-1.5 pl-1"
                role="alert"
              >
                {errors.deck.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-game disabled:bg-gray-600/40 disabled:border-gray-500"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner" />
            ) : activeTab === "select" ? (
              "进入游戏"
            ) : (
              "进入编辑器"
            )}
          </button>
        </form>
      </Card>
    </Background>
  );
}
