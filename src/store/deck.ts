import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "@/game/types";
import { serializeDeck, deserializeDeck } from "@/game/utils";

interface DeckState {
  deckNames: string[];
  currentDeckName: string | null;
  currentDeck: Card[];
}

interface DeckActions {
  // 基础操作
  setCurrentDeckName: (name: string | null) => void;
  setCurrentDeck: (cards: Card[]) => void;
  createDeck: (name: string, cards: Card[]) => void;
  renameDeck: (oldName: string, newName: string) => void;
  deleteDeck: (name: string) => void;

  // 卡牌编辑操作
  addCard: (card: Card) => void;
  removeCard: (cardId: string, removeAll?: boolean) => void;
  saveDeck: () => void;
  renameDeckTo: (newName: string) => boolean;
  loadDecks: () => void; // 重命名并添加加载方法
}

export const useDeckStore = create<DeckState & DeckActions>()(
  persist(
    (set, get) => ({
      // 初始状态
      deckNames: [],
      currentDeckName: null,
      currentDeck: [],

      // 基础操作
      setCurrentDeckName: (name) => {
        const deckData = name ? localStorage.getItem(`deck:${name}`) : null;
        set({
          currentDeckName: name,
          currentDeck: deckData ? deserializeDeck(deckData) : [],
        });
      },

      setCurrentDeck: (cards) => {
        const { currentDeckName } = get();
        if (currentDeckName) {
          localStorage.setItem(`deck:${currentDeckName}`, serializeDeck(cards));
        }
        set({ currentDeck: cards });
      },

      createDeck: (name, cards) => {
        const { deckNames } = get();
        if (!deckNames.includes(name)) {
          localStorage.setItem(`deck:${name}`, serializeDeck(cards));
          set({ deckNames: [...deckNames, name] });
        }
      },

      renameDeck: (oldName, newName) => {
        const { deckNames } = get();
        const data = localStorage.getItem(`deck:${oldName}`);
        if (data) {
          localStorage.setItem(`deck:${newName}`, data);
          localStorage.removeItem(`deck:${oldName}`);
          set({
            deckNames: deckNames.map((n) => (n === oldName ? newName : n)),
          });
        }
      },

      deleteDeck: (name) => {
        const { deckNames, currentDeckName } = get();
        localStorage.removeItem(`deck:${name}`);
        set({
          deckNames: deckNames.filter((n) => n !== name),
          ...(currentDeckName === name
            ? {
                currentDeckName: null,
                currentDeck: [],
              }
            : {}),
        });
      },

      // 卡牌编辑操作
      addCard: (card) => {
        const { currentDeck } = get();
        set({ currentDeck: [...currentDeck, card] });
      },

      removeCard: (cardId, removeAll = false) => {
        const { currentDeck } = get();
        const targetCard = currentDeck.find((card) => card.id === cardId);
        if (!targetCard) return;

        set({
          currentDeck: removeAll
            ? currentDeck.filter((card) => card.name !== targetCard.name)
            : currentDeck.filter(
                (_, i) => i !== currentDeck.findIndex((c) => c.id === cardId),
              ),
        });
      },

      saveDeck: () => {
        const { currentDeckName, currentDeck } = get();
        if (!currentDeckName) return;
        get().createDeck(currentDeckName, currentDeck);
      },

      renameDeckTo: (newName) => {
        const { currentDeckName } = get();
        if (!currentDeckName || !newName?.trim() || newName === currentDeckName)
          return false;
        get().renameDeck(currentDeckName, newName);
        return true;
      },

      loadDecks: () => {
        const prefix = "deck:";
        const decks: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(prefix)) {
            decks.push(key.slice(prefix.length));
          }
        }
        set({ deckNames: decks });
      },
    }),
    {
      name: "deck-storage",
      partialize: (state) => ({ deckNames: state.deckNames }),
    },
  ),
);
