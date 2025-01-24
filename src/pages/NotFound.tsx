import { Background } from "@/components/ui/Background";
import { Card } from "@/components/ui/Card";
import { Link } from "react-router";
import { motion } from "motion/react";

export default function NotFound() {
  const MotionLink = motion(Link);

  return (
    <Background className="flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <div className="space-y-2">
            <p className="text-xl font-bold text-white">啊哦，页面不见了</p>
            <p className="text-sm text-gray-300">
              看起来你访问的页面已经离开了这个世界
            </p>
          </div>
          <MotionLink
            to="/"
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary w-full"
          >
            返回主页
          </MotionLink>
        </div>
      </Card>
    </Background>
  );
}
