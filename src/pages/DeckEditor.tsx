import { Card as CardUI } from "@/components/ui/Card";
import { cards } from "@/game/cards";
import type { Card, Faith } from "@/game/types";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Background } from "@/components/ui/Background";
import { Router } from "@/routes";
import {
  BiSearch,
  BiFilter,
  BiSave,
  BiEdit,
  BiMinus,
  BiTrash,
} from "react-icons/bi";
import typia from "typia";

const FAITH_COLORS: Record<Faith, string> = {
  正义: "badge-warning text-warning-content",
  元素: "badge-primary text-primary-content",
  自然: "badge-success text-success-content",
  任意: "badge-neutral text-neutral-content",
};

const getFaithId = (cardId: string, faith: Faith, position: number) =>
  `${cardId}-${faith}-pos${position}`;

// 提取本地存储操作
const deckStorage = {
  get: (name: string) => {
    try {
      const data = localStorage.getItem(`deck:${name}`);
      return data ? typia.json.assertParse<Card[]>(data) : null;
    } catch (e) {
      console.error("Failed to load deck:", e);
      return null;
    }
  },
  save: (name: string, cards: Card[]) => {
    try {
      localStorage.setItem(`deck:${name}`, JSON.stringify(cards));
      return true;
    } catch (e) {
      console.error("Failed to save deck:", e);
      return false;
    }
  },
  remove: (name: string) => {
    localStorage.removeItem(`deck:${name}`);
  },
};

export default function DeckEditor({ deckName }: { deckName: string }) {
  const [search, setSearch] = useState("");
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<"全部" | "角色" | "指令" | "信念">(
    "全部",
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(deckName || "");

  // 优化useEffect依赖
  useEffect(() => {
    if (!deckName) {
      Router.push("MainMenu");
      return;
    }

    const deck = deckStorage.get(deckName);
    if (deck) {
      setSelectedCards(deck);
    }
  }, [deckName]);

  // 优化添加卡牌逻辑
  const handleAddCard = useCallback((card: Card) => {
    setSelectedCards((prev) => {
      if (prev.length >= 30) return prev;
      return [...prev, card];
    });
  }, []);

  // 优化移除卡牌逻辑
  const handleRemoveCard = useCallback((cardId: string, removeAll = false) => {
    setSelectedCards((prev) => {
      const cardToRemove = prev.find((card) => card.id === cardId);
      if (!cardToRemove) return prev;

      return removeAll
        ? prev.filter((card) => card.name !== cardToRemove.name)
        : prev.filter(
            (_, index) =>
              index !== prev.findIndex((card) => card.id === cardId),
          );
    });
  }, []);

  // 优化过滤逻辑
  const filteredCards = useMemo(
    () =>
      cards
        .filter((card) => {
          const nameMatch = card.name
            .toLowerCase()
            .includes(search.toLowerCase());
          const typeMatch = filter === "全部" || card.subtype.type === filter;
          return nameMatch && typeMatch;
        })
        .sort((a, b) => a.id.localeCompare(b.id)),
    [search, filter],
  );

  // 优化分组逻辑
  const groupedSelectedCards = useMemo(() => {
    const grouped = selectedCards.reduce(
      (acc, card) => {
        if (!acc[card.name]) {
          acc[card.name] = { card, count: 0 };
        }
        acc[card.name].count += 1;
        return acc;
      },
      {} as Record<string, { card: Card; count: number }>,
    );

    return Object.values(grouped).sort((a, b) =>
      a.card.id.localeCompare(b.card.id),
    );
  }, [selectedCards]);

  // 优化保存逻辑
  const handleSaveDeck = useCallback(() => {
    if (!deckName) return;

    if (deckStorage.save(deckName, selectedCards)) {
      Router.push("MainMenu");
    } else {
      // 这里可以添加错误提示UI
      console.error("保存失败");
    }
  }, [deckName, selectedCards]);

  // 优化重命名逻辑
  const handleSaveDeckName = useCallback(() => {
    const newName = editedName.trim();
    if (!newName || newName === deckName) {
      setIsEditingName(false);
      return;
    }

    if (deckName) {
      const deck = deckStorage.get(deckName);
      if (deck) {
        deckStorage.save(newName, deck);
        deckStorage.remove(deckName);
      }
    }

    Router.replace("DeckEditor", { deckName: newName });
    setIsEditingName(false);
  }, [deckName, editedName]);

  const getFaithCost = (faiths: Faith[], cardId: string) =>
    faiths.map((faith, pos) => (
      <span
        key={getFaithId(cardId, faith, pos)}
        className={`badge ${FAITH_COLORS[faith]} badge-sm mx-0.5 font-medium`}
      >
        {faith}
      </span>
    ));

  return (
    <Background>
      <title>{deckName ? `编辑卡组 - ${deckName}` : "新建卡组"}</title>
      <CardUI className="flex-1" variant="fill">
        <div className="flex h-full gap-3">
          {/* 左侧卡牌列表 */}
          <div className="flex flex-col min-h-0 basis-3/4 lg:basis-2/3 xl:basis-3/4">
            {/* 搜索和筛选区域 */}
            <div className="flex flex-col sm:flex-row gap-2 flex-none">
              <div className="relative w-full">
                <BiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
                <input
                  type="text"
                  placeholder="输入卡牌名称搜索..."
                  className="input-primary w-full pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <BiFilter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" />
                <select
                  className="select-primary w-full pl-9"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as typeof filter)}
                >
                  <option value="全部">全部卡牌</option>
                  <option value="角色">仅角色牌</option>
                  <option value="指令">仅指令牌</option>
                  <option value="信念">仅信念牌</option>
                </select>
              </div>
            </div>

            {/* 卡牌列表区域 */}
            <div className="flex-1 overflow-auto mt-2 min-h-0 scrollbar-card">
              <div className="grid auto-rows-max grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 p-2">
                {filteredCards.map((card) => (
                  <button
                    key={card.id}
                    className="p-3 card-hover cursor-pointer"
                    onClick={() => handleAddCard(card)}
                    type="button"
                    tabIndex={0}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-title text-primary-content font-medium">
                        {card.name}
                      </span>
                      {"cost" in card.subtype && (
                        <div className="flex flex-wrap justify-end">
                          {getFaithCost(card.subtype.cost, card.id)}
                        </div>
                      )}
                    </div>
                    <div className="text-subtitle text-sm mt-2 text-base-content opacity-90">
                      {card.description}
                    </div>
                    <div className="text-xs text-base-content opacity-75 mt-1">
                      {card.subtype.type}
                      {"rarity" in card.subtype && ` - ★${card.subtype.rarity}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧卡组列表 */}
          <div className="flex flex-col min-h-0 basis-1/4 lg:basis-1/3 xl:basis-1/4">
            <div className="flex flex-col gap-3 mb-4 flex-none">
              <div className="flex justify-between items-center">
                {isEditingName ? (
                  <div className="flex gap-3 items-center flex-1">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="input-sm-primary w-full"
                      placeholder="请输入新的卡组名称"
                    />
                    <button
                      onClick={handleSaveDeckName}
                      className="btn btn-primary btn-sm gap-2"
                      type="button"
                    >
                      <BiSave className="w-4 h-4" />
                      确定
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-primary-content">
                      {deckName}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="btn-icon"
                      type="button"
                      title="编辑卡组名称"
                    >
                      <BiEdit className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <span className="badge badge-primary ml-3" title="卡组数量">
                  {selectedCards.length}/30
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-auto min-h-0 border border-base-300 glass-panel mb-4 rounded-lg scrollbar-card">
              <div className="space-y-1 p-2">
                {groupedSelectedCards.map(({ card, count }) => (
                  <div
                    key={card.id}
                    className="flex justify-between items-center p-2 text-sm card-hover rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-base-content">
                        {card.name}{" "}
                        {count > 1 && (
                          <span className="text-primary font-bold">
                            x{count}
                          </span>
                        )}
                      </span>
                      {"cost" in card.subtype && (
                        <div className="flex">
                          {getFaithCost(card.subtype.cost, card.id)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 min-w-[80px] justify-end">
                      <button
                        type="button"
                        className="btn-icon text-error hover:bg-error hover:text-error-content transition-colors"
                        onClick={() => handleRemoveCard(card.id)}
                        title="移除一张"
                      >
                        <BiMinus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="btn-icon text-error hover:bg-error hover:text-error-content transition-colors"
                        onClick={() => handleRemoveCard(card.id, true)}
                        title="移除全部"
                      >
                        <BiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn-game gap-2"
              onClick={handleSaveDeck}
            >
              <BiSave className="w-5 h-5" />
              保存卡组
            </button>
          </div>
        </div>
      </CardUI>
    </Background>
  );
}
