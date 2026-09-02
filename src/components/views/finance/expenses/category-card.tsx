import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SwipeableRow from '@/components/shared/swipeable-row/swipeable-row';
import AddTransactionModal from '@/components/views/finance/add-transaction-modal';
import CopyTransactionModal from '@/components/views/finance/copy-transaction-modal';
import CorrectionSummary from '@/components/views/finance/shared/correction-summary';
import UnpaidBadge from '@/components/views/finance/shared/unpaid-badge';
import { FinanceTransactionTypeEnum, IFinanceCategory, ITransaction } from '@/contract/finance/finance.contract';
import { useFinanceDisplay } from '@/providers/finance-display-context';
import { useDeleteTransactionMutation } from '@/redux/api/finance/finance-api';
import { DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';
import { formatPLN, formatPLNCompact } from '@/utils/finance/format-pln';

interface BudgetIndicatorProps {
  showBudget: boolean;
  budgetAmount: number;
  progress: number;
  barColor: string;
  shareOfTotal: number;
  isAutoBudget: boolean;
}

// Isolated so the branching around "has a budget vs. income (no budget concept) vs. no budget set yet"
// doesn't count against the parent component's cognitive complexity budget.
// No budget set yet: instead of repeating a "no budget" hint on every card (dead text once you've read it
// once — the settings icon next to the amount already lets you set one), show how big a slice of this
// month's total this category is, which is new information on every row.
const BudgetIndicator: React.FC<BudgetIndicatorProps> = ({ showBudget, budgetAmount, progress, barColor, shareOfTotal, isAutoBudget }) => {
  if (!showBudget) return null;
  if (budgetAmount > 0) {
    // A lighter fill for an auto-suggested budget — it's a proposal from your history, not something you
    // committed to, so it shouldn't read with the same visual weight as a budget you deliberately set.
    return (
      <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <View className="h-full rounded-full" style={{ width: `${progress * 100}%`, backgroundColor: barColor, opacity: isAutoBudget ? 0.55 : 1 }} />
      </View>
    );
  }
  if (shareOfTotal <= 0) return null;
  return (
    <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <View className="h-full rounded-full" style={{ width: `${Math.min(shareOfTotal, 1) * 100}%`, backgroundColor: barColor, opacity: 0.45 }} />
    </View>
  );
};

interface BudgetSummaryProps {
  isOver: boolean;
  isSavings: boolean;
  totalSpent: number;
  budgetAmount: number;
  mask: (v: string) => string;
}

// For a savings/investment category, "spent" is money you put aside — going over the goal is the good
// outcome, so it gets the same green the rest of the app already uses for savings, not the expense-category
// red.
const BudgetSummary: React.FC<BudgetSummaryProps> = ({ isOver, isSavings, totalSpent, budgetAmount, mask }) => {
  const { t } = useTranslation();
  const overColor = isSavings ? '#10B981' : '#EF4444';
  return (
    <View className="px-4 py-2.5 border-t border-gray-50 flex-row justify-end">
      <Text className="text-xs font-medium" style={{ color: isOver ? overColor : '#4b5563' }}>
        {isOver
          ? `+${mask(formatPLNCompact(totalSpent - budgetAmount))} zł`
          : `${mask(formatPLNCompact(budgetAmount - totalSpent))} zł ${t('finance.expenses.free')}`}
      </Text>
    </View>
  );
};

interface CategoryCardProps {
  category: IFinanceCategory;
  transactions: ITransaction[];
  actualAmount: number;
  budgetAmount: number;
  onSetBudget?: () => void;
  showBudget?: boolean;
  emptyLabel?: string;
  totalForShare?: number;
  // budgetAmount came from your history (median/mean), not a budget you deliberately set — shown lighter,
  // with a small hint icon, so it reads as a proposal you can tap the settings icon to override.
  isAutoBudget?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  transactions,
  actualAmount,
  budgetAmount,
  onSetBudget,
  showBudget = true,
  emptyLabel,
  totalForShare = 0,
  isAutoBudget = false,
}) => {
  const { t } = useTranslation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [copyingTransaction, setCopyingTransaction] = useState<ITransaction | null>(null);

  const color = category.color ?? DEFAULT_CATEGORY_COLOR;
  const icon = resolveCategoryIcon(category.icon);
  const totalSpent = actualAmount;
  const { mask } = useFinanceDisplay();

  if (totalSpent === 0 && budgetAmount === 0) return null;

  const progress = budgetAmount > 0 ? Math.min(totalSpent / budgetAmount, 1) : 0;
  const isOver = budgetAmount > 0 && totalSpent > budgetAmount;
  // Going over the goal is the point for a savings/investment category — you saved more than planned — so
  // it earns the app's savings green instead of the expense-category alarm red.
  const overColor = category.isSavings ? '#10B981' : '#EF4444';
  const shareOfTotal = totalForShare > 0 ? totalSpent / totalForShare : 0;

  const categoriesById = new Map<number, IFinanceCategory>([
    [category.id, category],
    ...(category.subCategories ?? []).map(sub => [sub.id, sub] as const),
  ]);
  const getTransactionLabel = (transaction: ITransaction) =>
    (transaction.categoryId != null ? categoriesById.get(transaction.categoryId)?.name : undefined) ?? category.name;

  const handleDelete = (id: number) => {
    Alert.alert(t('finance.expenses.deleteTitle'), t('finance.expenses.deleteMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: async () => deleteTransaction({ id }) },
    ]);
  };

  return (
    <View className="mb-2 bg-white rounded-2xl shadow-sm overflow-hidden">
      <TouchableOpacity
        onPress={() => setIsExpanded(v => !v)}
        className="flex-row items-center px-4 py-3 gap-3"
        testID={`category-row-${category.id}`}
      >
        <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Ionicons name={icon} size={15} color={color} />
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold text-gray-600 uppercase tracking-wide" numberOfLines={1}>
              {category.name}
            </Text>
            {/* "949 zł z 900 zł", not "949 / 900 zł" — a slash between two same-weight numbers leaves it
                ambiguous which one is "what I spent"; the word makes that unambiguous without relying on
                color alone. Red only ever touches the spent figure, so a single number carries the alarm,
                not the whole row. */}
            <Text className="text-sm font-bold ml-2" numberOfLines={1}>
              <Text style={{ color: isOver ? overColor : '#1a1a2e' }}>{mask(formatPLNCompact(totalSpent))} zł</Text>
              {showBudget && budgetAmount > 0 && (
                <Text className="text-gray-400 font-semibold text-xs">
                  {' '}
                  {t('finance.expenses.ofBudgetLabel')} {mask(formatPLNCompact(budgetAmount))} zł
                </Text>
              )}
            </Text>
          </View>
          <BudgetIndicator
            showBudget={showBudget}
            budgetAmount={budgetAmount}
            progress={progress}
            barColor={color}
            shareOfTotal={shareOfTotal}
            isAutoBudget={isAutoBudget}
          />
        </View>

        {showBudget && onSetBudget && (
          <TouchableOpacity
            onPress={onSetBudget}
            className="w-8 h-8 rounded-full items-center justify-center bg-gray-50"
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
            accessibilityLabel={t('finance.expenses.setBudget')}
          >
            <Ionicons name="options-outline" size={15} color="#6b7280" />
          </TouchableOpacity>
        )}

        <Ionicons name={isExpanded ? 'chevron-down' : 'chevron-forward'} size={16} color="#9ca3af" />
      </TouchableOpacity>

      {isExpanded && (
        <View className="border-t border-gray-50">
          {transactions.length === 0 ? (
            <View className="px-4 py-4 items-center">
              <Text className="text-xs text-gray-400">{emptyLabel ?? t('finance.expenses.noExpenses')}</Text>
            </View>
          ) : (
            transactions.map((transaction, idx) => (
              <SwipeableRow key={transaction.id} onDelete={() => handleDelete(transaction.id)} onCopy={() => setCopyingTransaction(transaction)}>
                <TouchableOpacity
                  onPress={() => setEditingTransaction(transaction)}
                  activeOpacity={0.7}
                  className="flex-row items-center px-4 py-3 bg-white"
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: color,
                    // Kept as explicit borderBottom*, not a `border-b border-gray-50` className — Tailwind's
                    // border-gray-50 sets the generic (all-sides) borderColor, which was clobbering the
                    // borderLeftColor above on every row except the last (the only one without that class).
                    borderBottomWidth: idx < transactions.length - 1 ? 1 : 0,
                    borderBottomColor: '#F9FAFB',
                  }}
                >
                  <View className="flex-1 gap-0.5">
                    <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                      {getTransactionLabel(transaction)}
                    </Text>
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-xs text-gray-500">{transaction.occurredOn}</Text>
                      {transaction.note ? (
                        <Text className="text-xs text-gray-500 italic" numberOfLines={1}>
                          · {transaction.note}
                        </Text>
                      ) : null}
                      {transaction.type === FinanceTransactionTypeEnum.Expense && !transaction.isPaid && (
                        <UnpaidBadge transactionId={transaction.id} />
                      )}
                    </View>
                    {/* Informational only here — refunds are added and managed from History, which keeps the
                        dashboard to a single reading of "where does my budget stand". */}
                    <CorrectionSummary transaction={transaction} />
                  </View>
                  <Text className="text-sm font-bold mr-3" style={{ color }}>
                    {mask(formatPLN(transaction.netAmount))}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCopyingTransaction(transaction)}
                    hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
                    accessibilityLabel={t('finance.copyTransaction.action')}
                    className="mr-3"
                  >
                    <Ionicons name="copy-outline" size={16} color="#9ca3af" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(transaction.id)}
                    hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                    accessibilityLabel={t('common.delete')}
                  >
                    <Ionicons name="trash-outline" size={16} color="#d1d5db" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </SwipeableRow>
            ))
          )}

          {showBudget && budgetAmount > 0 && (
            <BudgetSummary isOver={isOver} isSavings={category.isSavings} totalSpent={totalSpent} budgetAmount={budgetAmount} mask={mask} />
          )}
        </View>
      )}

      <AddTransactionModal isVisible={editingTransaction !== null} onClose={() => setEditingTransaction(null)} transaction={editingTransaction} />
      <CopyTransactionModal
        isVisible={copyingTransaction !== null}
        onClose={() => setCopyingTransaction(null)}
        transaction={copyingTransaction}
        categoriesById={categoriesById}
      />
    </View>
  );
};

export default CategoryCard;
