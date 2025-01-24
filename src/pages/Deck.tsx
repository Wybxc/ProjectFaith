import { Card as CardUI } from "@/components/ui/Card";
import { cards } from "@/game/card";
import type { Card, Faith } from "@/game/types";
import { useState } from "react";
import { HiShoppingCart } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

export default function Deck() {
  const [search, setSearch] = useState("");
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<
    "all" | "character" | "action" | "faith"
  >("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleAddCard = (card: Card) => {
    if (selectedCards.length < 30) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleRemoveCard = (cardId: string) => {
    const index = selectedCards.findIndex((card) => card.id === cardId);
    if (index !== -1) {
      const newSelectedCards = [...selectedCards];
      newSelectedCards.splice(index, 1);
      setSelectedCards(newSelectedCards);
    }
  };

  const filteredCards = cards
    .filter(
      (card) =>
        card.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "all" || card.subtype.type === filter),
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const getFaithCost = (faiths: Faith[]) => {
    return faiths.map((faith) => {
      const faithColors: Record<Faith, string> = {
        justice: "badge-warning",
        element: "badge-primary",
        nature: "badge-success",
        any: "badge-neutral",
      };
      return (
        <span
          key={faith}
          className={`badge ${faithColors[faith]} badge-sm mx-0.5`}
        >
          {faith}
        </span>
      );
    });
  };

  const groupedSelectedCards = Object.values(
    selectedCards.reduce(
      (acc, card) => {
        if (!acc[card.name]) {
          acc[card.name] = {
            card,
            count: 1,
          };
        } else {
          acc[card.name].count++;
        }
        return acc;
      },
      {} as Record<string, { card: Card; count: number }>,
    ),
  ).sort((a, b) => a.card.id.localeCompare(b.card.id));

  return (
    <div className="min-h-screen bg-base-200 p-4 lg:p-6">
      {/* 主要卡牌列表区域 */}
      <div className="w-full">
        <CardUI className="p-3 lg:p-4">
          <div className="space-y-3 lg:space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                type="text"
                placeholder="搜索卡牌..."
                className="input input-bordered w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="select select-bordered w-full sm:w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
              >
                <option value="all">全部</option>
                <option value="character">角色</option>
                <option value="action">指令</option>
                <option value="faith">信念</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-h-[80vh] overflow-y-auto">
              {filteredCards.map((card) => (
                <button
                  key={card.id}
                  className="bg-base-300 p-4 rounded-lg cursor-pointer hover:bg-base-100 transition-colors"
                  onClick={() => handleAddCard(card)}
                  type="button"
                  tabIndex={0}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold">{card.name}</span>
                    {"cost" in card.subtype && (
                      <div className="flex flex-wrap justify-end">
                        {getFaithCost(card.subtype.cost)}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-base-content/70 mt-2">
                    {card.description}
                  </div>
                  <div className="text-xs text-base-content/50 mt-1">
                    {card.subtype.type}
                    {"rarity" in card.subtype && ` - ★${card.subtype.rarity}`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </CardUI>
      </div>

      {/* 浮动的抽屉开关按钮 */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-4 right-4 btn btn-primary btn-circle shadow-lg"
      >
        <span className="relative">
          <span className="absolute -top-2 -right-2 badge badge-sm badge-accent">
            {selectedCards.length}
          </span>
          <HiShoppingCart className="h-6 w-6" />
        </span>
      </button>

      {/* 卡组抽屉 */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"} z-50`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">当前卡组</h2>
            <div className="flex items-center gap-4">
              <span className="badge badge-primary">
                {selectedCards.length}/30
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsDrawerOpen(false)}
              >
                <IoClose className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {groupedSelectedCards.map(({ card, count }) => (
                <div
                  key={card.id}
                  className="flex justify-between items-center bg-base-300 p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {card.name}{" "}
                      {count > 1 && (
                        <span className="text-primary">x{count}</span>
                      )}
                    </span>
                    {"cost" in card.subtype && (
                      <div className="flex">
                        {getFaithCost(card.subtype.cost)}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => handleRemoveCard(card.id)}
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-base-300">
            <button type="button" className="btn btn-primary w-full">
              保存卡组
            </button>
          </div>
        </div>
      </div>

      {/* 背景遮罩 */}
      {isDrawerOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
}
