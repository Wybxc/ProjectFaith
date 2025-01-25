import { AppTitle } from "@/components/ui/AppTitle";
import { Card } from "@/components/ui/Card";
import { Background } from "@/components/ui/Background";
import { Router } from "@/routes";

export default function MainMenu() {
  return (
    <Background className="flex flex-col items-center justify-center p-2 sm:p-4">
      <title>信念计划</title>
      <AppTitle title="信念计划" subtitle="卡牌对战游戏" />
      <Card className="w-[90%] max-w-[360px] landscape:max-w-[420px] animate-fade-in">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => Router.push("Decks")}
            className="btn btn-primary bg-primary/90 backdrop-blur text-primary-content shadow-lg shadow-primary/20 border-primary/50 hover:bg-primary hover:border-primary hover:shadow-primary/40 w-full text-lg font-medium"
          >
            开始游戏
          </button>
          <button
            type="button"
            className="btn glass bg-base-100/20 text-base-content border-base-content/20 hover:bg-base-100/30 hover:border-base-content/30 hover:text-base-content/90 w-full"
          >
            游戏说明
          </button>
          <button
            type="button"
            className="btn glass bg-base-100/20 text-base-content border-base-content/20 hover:bg-base-100/30 hover:border-base-content/30 hover:text-base-content/90 w-full"
          >
            设置
          </button>
        </div>
      </Card>
    </Background>
  );
}
