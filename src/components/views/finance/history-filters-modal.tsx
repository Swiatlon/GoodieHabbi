import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker, { useDefaultClassNames } from 'react-native-ui-datepicker';
import { Ionicons } from '@expo/vector-icons';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import dayjs from '@/configs/day-js-config';
import { IFinanceCategory } from '@/contract/finance/finance.contract';
import { DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';
import { buildDatePickerClassNames, DATE_FORMAT, todayString } from '@/utils/finance/form-helpers';
import { DEFAULT_HISTORY_FILTERS, HistoryRangeMode, IHistoryFilters } from '@/utils/finance/history-filters';

const RANGE_MODES: HistoryRangeMode[] = ['month', 'year', 'all', 'custom'];

const CHIP_ACTIVE_CLASS = 'border-primary bg-blue-50';
const CHIP_INACTIVE_CLASS = 'border-gray-200 bg-white';
const chipClass = (active: boolean) => (active ? CHIP_ACTIVE_CLASS : CHIP_INACTIVE_CLASS);
const chipTextClass = (active: boolean) => (active ? 'text-primary' : 'text-gray-600');

type DateSide = 'from' | 'to';

interface HistoryFiltersModalProps extends IBaseModalProps {
  filters: IHistoryFilters;
  onApply: (filters: IHistoryFilters) => void;
  expenseCategories: IFinanceCategory[];
  incomeCategories: IFinanceCategory[];
}

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} className={`px-3 py-2 rounded-xl border ${chipClass(active)}`}>
    <Text className={`text-xs font-semibold ${chipTextClass(active)}`}>{label}</Text>
  </TouchableOpacity>
);

const HistoryFiltersModal: React.FC<HistoryFiltersModalProps> = ({ isVisible, onClose, filters, onApply, expenseCategories, incomeCategories }) => {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<IHistoryFilters>(filters);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [pickingSide, setPickingSide] = useState<DateSide | null>(null);
  const defaultDatePickerClassNames = useDefaultClassNames();

  // Re-synced on every open, so edits abandoned by dismissing the sheet never come back.
  useEffect(() => {
    if (!isVisible) return;

    setDraft(filters);
    // Open the mains whose subs are selected, otherwise a picked sub would be hidden behind a collapsed row.
    const allMains = [...expenseCategories, ...incomeCategories].filter(c => !c.parentCategoryId);
    setExpandedIds(allMains.filter(main => (main.subCategories ?? []).some(sub => filters.categoryIds.includes(sub.id))).map(main => main.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  // A main covers its subs server-side, so the set never holds both: picking one drops whatever it implies or is implied by.
  const toggleCategory = (category: IFinanceCategory, parent: IFinanceCategory | null) =>
    setDraft(prev => {
      if (prev.categoryIds.includes(category.id)) return { ...prev, categoryIds: prev.categoryIds.filter(id => id !== category.id) };

      const impliedIds = parent ? [parent.id] : (category.subCategories ?? []).map(sub => sub.id);
      return { ...prev, categoryIds: [...prev.categoryIds.filter(id => !impliedIds.includes(id)), category.id] };
    });

  const toggleExpanded = (categoryId: number) =>
    setExpandedIds(prev => (prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]));

  const setDateSide = (side: DateSide, value: string) =>
    setDraft(prev => (side === 'from' ? { ...prev, customFrom: value } : { ...prev, customTo: value }));

  // Type isn't edited here (it has its own toggle on the screen), so Reset keeps it.
  const handleReset = () => setDraft(prev => ({ ...DEFAULT_HISTORY_FILTERS, type: prev.type }));

  const handleApply = () => {
    // Picked back to front is still an obvious range, so swap it rather than send one that can't match anything.
    const isInverted = draft.customFrom !== '' && draft.customTo !== '' && draft.customFrom > draft.customTo;
    onApply(isInverted ? { ...draft, customFrom: draft.customTo, customTo: draft.customFrom } : draft);
    onClose();
  };

  const renderDateButton = (side: DateSide) => {
    const value = side === 'from' ? draft.customFrom : draft.customTo;

    return (
      <View className="flex-1 flex-row items-center border border-gray-200 rounded-xl bg-white">
        <TouchableOpacity onPress={() => setPickingSide(side)} className="flex-1 flex-row items-center gap-2 px-3 py-2.5">
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text className={`text-sm ${value ? 'text-gray-800' : 'text-gray-400'}`} numberOfLines={1}>
            {value ? dayjs(value).format('DD.MM.YYYY') : t(side === 'from' ? 'finance.history.filters.anyStart' : 'finance.history.filters.anyEnd')}
          </Text>
        </TouchableOpacity>
        {value ? (
          <TouchableOpacity onPress={() => setDateSide(side, '')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} className="pr-3">
            <Ionicons name="close-circle" size={16} color="#9ca3af" />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const renderCategorySection = (title: string, categories: IFinanceCategory[]) => {
    const mains = categories.filter(c => !c.parentCategoryId);
    if (mains.length === 0) return null;

    return (
      <View className="mb-3">
        <Text className="text-xs font-semibold text-gray-500 uppercase mb-1">{title}</Text>
        {mains.map(main => {
          const subs = main.subCategories ?? [];
          const isChecked = draft.categoryIds.includes(main.id);
          const isExpanded = expandedIds.includes(main.id);

          return (
            <View key={main.id}>
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => toggleCategory(main, null)} className="flex-1 flex-row items-center gap-2 py-2">
                  <Ionicons name={isChecked ? 'checkbox' : 'square-outline'} size={20} color={isChecked ? '#1987EE' : '#d1d5db'} />
                  <Ionicons name={resolveCategoryIcon(main.icon)} size={16} color={main.color ?? DEFAULT_CATEGORY_COLOR} />
                  <Text className="text-sm text-gray-800 flex-1" numberOfLines={1}>
                    {main.name}
                  </Text>
                </TouchableOpacity>
                {subs.length > 0 && (
                  <TouchableOpacity
                    onPress={() => toggleExpanded(main.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    className="px-2 py-2"
                  >
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
              {isExpanded &&
                subs.map(sub => {
                  const isSubChecked = draft.categoryIds.includes(sub.id);

                  return (
                    <TouchableOpacity key={sub.id} onPress={() => toggleCategory(sub, main)} className="flex-row items-center gap-2 py-2 pl-7">
                      <Ionicons name={isSubChecked ? 'checkbox' : 'square-outline'} size={18} color={isSubChecked ? '#1987EE' : '#d1d5db'} />
                      <Text className="text-sm text-gray-700 flex-1" numberOfLines={1}>
                        {sub.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          );
        })}
      </View>
    );
  };

  const pickedDate = pickingSide === 'from' ? draft.customFrom : draft.customTo;

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={handleReset} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="refresh-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('finance.history.filters.reset')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleApply}
            className="flex-row items-center gap-1 rounded-lg px-4 py-2 bg-primary"
            testID="history-filters-apply"
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('finance.history.filters.apply')}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View>
        <Text className="text-lg font-bold text-center mb-4">{t('finance.history.filters.title')}</Text>

        <Text className="text-sm font-semibold text-gray-600 mb-2">{t('finance.history.filters.range')}</Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
          {RANGE_MODES.map(mode => (
            <Chip
              key={mode}
              label={t(`finance.history.filters.range_${mode}`)}
              active={draft.rangeMode === mode}
              onPress={() => setDraft(prev => ({ ...prev, rangeMode: mode }))}
            />
          ))}
        </View>
        {draft.rangeMode === 'custom' && (
          <View className="flex-row gap-2 mb-3">
            {renderDateButton('from')}
            {renderDateButton('to')}
          </View>
        )}

        <Text className="text-sm font-semibold text-gray-600 mb-2 mt-1">{t('finance.history.filters.paidStatus')}</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          <Chip
            label={t('finance.history.filters.paidAny')}
            active={draft.isPaid === null}
            onPress={() => setDraft(prev => ({ ...prev, isPaid: null }))}
          />
          <Chip
            label={t('finance.history.filters.unpaidOnly')}
            active={draft.isPaid === false}
            onPress={() => setDraft(prev => ({ ...prev, isPaid: false }))}
          />
          <Chip
            label={t('finance.history.filters.paidOnly')}
            active={draft.isPaid === true}
            onPress={() => setDraft(prev => ({ ...prev, isPaid: true }))}
          />
        </View>

        <Text className="text-sm font-semibold text-gray-600 mb-2">{t('finance.history.filters.categories')}</Text>
        {renderCategorySection(t('finance.history.filters.expenseCategories'), expenseCategories)}
        {renderCategorySection(t('finance.history.filters.incomeCategories'), incomeCategories)}
        <Text className="text-xs text-gray-500">{t('finance.history.filters.categoryRollupHint')}</Text>
      </View>

      <Modal isVisible={pickingSide !== null} onClose={() => setPickingSide(null)} className="pt-14 px-6">
        <DateTimePicker
          classNames={buildDatePickerClassNames(defaultDatePickerClassNames)}
          mode="single"
          date={pickedDate || todayString()}
          onChange={({ date }) => {
            if (pickingSide) setDateSide(pickingSide, dayjs(date).format(DATE_FORMAT));
            setPickingSide(null);
          }}
        />
      </Modal>
    </Modal>
  );
};

export default HistoryFiltersModal;
