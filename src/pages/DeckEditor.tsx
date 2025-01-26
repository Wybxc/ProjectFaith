import { cards } from "@/game/cards";
import type { Card, Faith } from "@/game/types";
import { useMemo, useState, useEffect, useCallback } from "react";

import {
  BiSearch,
  BiFilter,
  BiSave,
  BiEdit,
  BiMinus,
  BiTrash,
  BiX,
  BiCopy, // 添加复制图标
  BiArrowBack, // 添加返回图标
} from "react-icons/bi";
import {
  canAfford,
  faithProvide,
  minFaith,
  minFaithReduce,
  totalFaith,
  serializeDeck, // 添加序列化函数
  deserializeDeck, // 添加反序列化函数
} from "@/game/utils";
import { useTypedParams } from "react-router-typesafe-routes";
import { root } from "@/routes";
import { useNavigate } from "react-router";
import { Title, Subtitle } from "@/components/ui/Typography";
import { CardScrollbar } from "@/components/ui/Scrollbar"; // 移除 Scrollbar
import { GlassPanel, CardHover } from "@/components/ui/Panel";
import { Input, InputSmall, Select } from "@/components/ui/Input";
import { GameButton, IconButton } from "@/components/ui/Button";
import { LandscapeStyles } from "@/components/ui/MediaQuery";

const FAITH_COLORS: Record<Faith, string> = {
  正义: "badge-warning text-warning-content",
  元素: "badge-primary text-primary-content",
  自然: "badge-success text-success-content",
  任意: "badge-neutral text-neutral-content",
};

const getFaithId = (cardId: string, faith: Faith, position: number) =>
  `${cardId}-${faith}-pos${position}`;

// 修改本地存储操作使用序列化
const deckStorage = {
  get: (name: string) => {
    try {
      const data = localStorage.getItem(`deck:${name}`);
      return data ? deserializeDeck(data) : null;
    } catch (e) {
      console.error("Failed to load deck:", e);
      return null;
    }
  },
  save: (name: string, cards: Card[]) => {
    try {
      localStorage.setItem(`deck:${name}`, serializeDeck(cards));
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

// 添加卡组验证函数
const validateDeck = (cards: Card[]) => {
  const errors: string[] = [];

  // 需要有27张卡牌
  if (cards.length !== 27) {
    errors.push("卡组数量不足");
  }

  // 启言不能超过1张
  const prefaceCount = cards.filter((card) => card.preface).length;
  if (prefaceCount > 1) {
    errors.push("启言卡牌多于1张");
  }

  // 需要有三张信念牌
  const faithCards = cards.filter((card) => card.subtype.type === "信念");
  if (faithCards.length !== 3) {
    errors.push("需要三张信念牌");
  }

  // 卡牌费用需要被信念牌覆盖
  const faithProvides = faithProvide(cards);
  for (const card of cards) {
    if (!canAfford(faithProvides, card)) {
      errors.push(`卡牌 ${card.name} 的信念要求不满足`);
    }
  }

  return Array.from(new Set(errors));
};

export default function DeckEditor() {
  const { deckName } = useTypedParams(root.deck.edit);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [filter, setFilter] = useState<"全部" | "角色" | "指令" | "信念">(
    "全部",
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(deckName);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false); // 添加复制成功状态

  const deckFaithCost = useMemo(() => minFaith(selectedCards), [selectedCards]);
  const availableCardIds = useMemo(
    () =>
      cards
        .filter((card) => totalFaith(minFaithReduce(deckFaithCost, card)) <= 3)
        .map((card) => card.id),
    [deckFaithCost],
  );

  // 优化useEffect依赖
  useEffect(() => {
    const deck = deckStorage.get(deckName);
    if (deck) {
      setSelectedCards(deck);
    }
  }, [deckName]);

  // 更新验证状态
  useEffect(() => {
    const errors = validateDeck(selectedCards);
    setValidationErrors(errors);
  }, [selectedCards]);

  // 优化添加卡牌逻辑
  const handleAddCard = useCallback((card: Card) => {
    setSelectedCards((prev) => {
      if (prev.length >= 27) return prev;

      // 检查同名卡牌数量
      const sameNameCount = prev.filter((c) => c.name === card.name).length;
      if (sameNameCount >= 3) return prev;

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

  // 添加检查卡牌是否达到上限的函数
  const isCardUnavailable = useCallback(
    (card: Card) => {
      const sameNameCount = selectedCards.filter(
        (c) => c.name === card.name,
      ).length;
      return sameNameCount >= 3;
    },
    [selectedCards],
  );

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
        .sort((a, b) => {
          // 检查卡牌是否可用
          const aUnavailable = isCardUnavailable(a);
          const bUnavailable = isCardUnavailable(b);
          if (aUnavailable !== bUnavailable) {
            return aUnavailable ? 1 : -1;
          }
          // 再按信仰需求排序
          const aHasFaith = availableCardIds.includes(a.id);
          const bHasFaith = availableCardIds.includes(b.id);
          if (aHasFaith !== bHasFaith) {
            return aHasFaith ? -1 : 1;
          }
          return a.id.localeCompare(b.id);
        }),
    [search, filter, availableCardIds, isCardUnavailable],
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

    const errors = validateDeck(selectedCards);
    if (errors.length > 0) {
      return; // 如果有错误，阻止保存
    }

    if (!deckStorage.save(deckName, selectedCards)) {
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

    navigate(root.deck.edit.$buildPath({ params: { deckName: newName } }), {
      replace: true,
    });
    setIsEditingName(false);
  }, [deckName, editedName, navigate]);

  // 添加复制卡组代码的函数
  const handleCopyDeck = useCallback(async () => {
    const deckCode = serializeDeck(selectedCards);
    try {
      await navigator.clipboard.writeText(deckCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // 2秒后隐藏提示
    } catch (err) {
      console.error("Failed to copy deck code:", err);
    }
  }, [selectedCards]);

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
    <LandscapeStyles>
      <title>{deckName ? `编辑卡组 - ${deckName}` : "新建卡组"}</title>

      <div className="flex h-full gap-3">
        <div className="flex flex-col min-h-0 basis-3/4 lg:basis-2/3 xl:basis-3/4">
          <div className="flex flex-col sm:flex-row gap-2 flex-none">
            <IconButton
              onClick={() => navigate(-1)}
              className="btn-circle lf-start sm:self-center landscape:btn-sm"
              title="返回"
            >
              <BiArrowBack className="w-5 h-5 landscape:w-4 landscape:h-4" />
            </IconButton>
            <div className="relative w-full">
              <BiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-200/60" />
              <Input
                type="text"
                placeholder="输入卡牌名称搜索..."
                className="w-full pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <BiFilter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-200/60" />
              <Select
                className="w-full pl-9"
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
              >
                <option value="全部">全部卡牌</option>
                <option value="角色">仅角色牌</option>
                <option value="指令">仅指令牌</option>
                <option value="信念">仅信念牌</option>
              </Select>
            </div>
          </div>

          <CardScrollbar className="flex-1 overflow-auto mt-2 min-h-0">
            <div className="grid auto-rows-max grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 landscape:grid-cols-3 gap-2 p-2">
              {filteredCards.map((card) => {
                const hasFaith = availableCardIds.includes(card.id);
                const isUnavailable = isCardUnavailable(card);
                const isAvailable = hasFaith && !isUnavailable;
                return (
                  <CardHover
                    key={card.id}
                    as="button"
                    className={`p-3 landscape:p-2 ${
                      !isAvailable && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => isAvailable && handleAddCard(card)}
                    disabled={!isAvailable}
                    title={
                      isUnavailable
                        ? "已达到最大数量限制"
                        : !hasFaith
                          ? "信仰要求不满足"
                          : undefined
                    }
                  >
                    <div className="flex justify-between items-start">
                      <Title className="landscape:text-sm">{card.name}</Title>
                      {"cost" in card.subtype && (
                        <div className="flex flex-wrap justify-end">
                          {getFaithCost(card.subtype.cost, card.id)}
                        </div>
                      )}
                    </div>
                    <Subtitle className="text-sm mt-2 landscape:text-xs landscape:mt-1">
                      {card.description}
                    </Subtitle>
                    <div className="text-xs text-slate-200 opacity-75 mt-1 landscape:text-[10px]">
                      {card.subtype.type}
                      {"rarity" in card.subtype && ` - ★${card.subtype.rarity}`}
                    </div>
                  </CardHover>
                );
              })}
            </div>
          </CardScrollbar>
        </div>

        <div className="flex flex-col min-h-0 basis-1/4 lg:basis-1/3 xl:basis-1/4">
          <div className="flex flex-col gap-2 mb-3 flex-none landscape:gap-1">
            <div className="flex justify-between items-center">
              {isEditingName ? (
                <div className="flex gap-3 items-center flex-1">
                  <InputSmall
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="请输入新的卡组名称"
                  />
                  <GameButton
                    onClick={handleSaveDeckName}
                    className="btn-sm gap-2"
                  >
                    <BiSave className="w-4 h-4" />
                    确定
                  </GameButton>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Title className="text-lg">{deckName}</Title>
                  <IconButton
                    onClick={() => setIsEditingName(true)}
                    title="编辑卡组名称"
                  >
                    <BiEdit className="w-4 h-4" />
                  </IconButton>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="badge badge-primary" title="卡组数量">
                  {selectedCards.length}/27
                </span>
                <IconButton
                  onClick={handleCopyDeck}
                  title={copySuccess ? "已复制卡组代码" : "复制卡组代码"}
                  className={copySuccess ? "text-success" : ""}
                >
                  <BiCopy className="w-4 h-4" />
                </IconButton>
              </div>
            </div>

            <GlassPanel className="flex items-center justify-between gap-2 p-2 landscape:p-1.5">
              <span className="text-sm text-slate-200 landscape:text-xs">
                信念组成：
              </span>
              <div className="flex gap-1">
                {(Object.entries(deckFaithCost) as [Faith, number][]).map(
                  ([faith, cost]) =>
                    cost > 0 && (
                      <span
                        key={faith}
                        className={`badge ${FAITH_COLORS[faith]} badge-sm font-medium`}
                      >
                        {faith} x{cost}
                      </span>
                    ),
                )}
                {Object.values(deckFaithCost).every((v) => v === 0) && (
                  <span className="text-sm text-slate-400">无</span>
                )}
              </div>
            </GlassPanel>
          </div>

          <CardScrollbar className="flex-1 overflow-auto min-h-0 mb-3 landscape:mb-2">
            <GlassPanel className="h-full">
              <div className="space-y-1 p-2">
                {groupedSelectedCards.map(({ card, count }) => (
                  <CardHover
                    key={card.id}
                    className="flex justify-between items-center p-2 text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="truncate">
                        <span className="font-medium text-slate-100">
                          {card.name}{" "}
                          {count > 1 && (
                            <span className="text-slate-100 font-bold">
                              x{count}
                            </span>
                          )}
                        </span>
                      </div>
                      {"cost" in card.subtype && (
                        <div className="flex flex-none">
                          {getFaithCost(card.subtype.cost, card.id)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-none ml-2">
                      <IconButton
                        onClick={() => handleRemoveCard(card.id)}
                        title="移除一张"
                        className="text-error hover:bg-error hover:text-error-content transition-colors"
                      >
                        <BiMinus className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemoveCard(card.id, true)}
                        title="移除全部"
                        className="text-error hover:bg-error hover:text-error-content transition-colors"
                      >
                        <BiTrash className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </CardHover>
                ))}
              </div>
            </GlassPanel>
          </CardScrollbar>

          {validationErrors.length > 0 && (
            <div className="mb-3 p-3 landscape:p-2 landscape:mb-2 bg-error/10 border border-error/20 rounded-lg">
              <div className="text-error font-medium mb-2 landscape:text-sm">
                卡组存在以下问题：
              </div>
              <ul className="text-sm space-y-1 landscape:text-xs">
                {validationErrors.map((error) => (
                  <li
                    key={error}
                    className="flex items-center gap-2 text-error/90"
                  >
                    <BiX className="flex-none w-4 h-4" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <GameButton
            onClick={handleSaveDeck}
            disabled={validationErrors.length > 0}
            className={
              validationErrors.length > 0
                ? "btn-disabled landscape:text-sm"
                : "landscape:text-sm"
            }
          >
            <BiSave className="w-5 h-5 landscape:w-4 landscape:h-4" />
            保存卡组
            {validationErrors.length > 0 && (
              <span className="text-sm landscape:text-xs">
                （请先修正错误）
              </span>
            )}
          </GameButton>
        </div>
      </div>
    </LandscapeStyles>
  );
}
