import { Background } from "@/components/ui/Background";
import { Card } from "@/components/ui/Card";
import { Router } from "@/routes";
import { Link } from "@swan-io/chicane";
import { motion } from "motion/react";

export default function NotFound() {
  const MotionLink = motion(Link);

  return (
    <Background className="flex items-center justify-center p-4">
      <title>404 - 页面不存在</title>
      <Card className="max-w-md w-full animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <div className="space-y-2">
            <p className="text-xl font-bold text-white">啊哦，页面不见了</p>
            <p className="text-sm text-gray-300">
              看起来你访问的页面已经离开了这个世界
            </p>
          </div>
          <MotionLink
            to={Router.MainMenu()}
            whileTap={{ scale: 0.98 }}
            className="btn-game"
          >
            返回主页
          </MotionLink>
        </div>
      </Card>
    </Background>
  );
}
