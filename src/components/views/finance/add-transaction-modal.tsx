import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import { Ionicons } from '@expo/vector-icons';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import dayjs from '@/configs/day-js-config';
import { FinanceTransactionTypeEnum, IFinanceCategory } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateTransactionMutation, useGetFinanceCategoriesQuery } from '@/redux/api/finance/finance-api';
import { DEFAULT_CATEGORY_COLOR, resolveCategoryIcon } from '@/utils/finance/category-helpers';

interface AddTransactionModalProps extends IBaseModalProps {
  recentCategoryIds?: Partial<Record<FinanceTransactionTypeEnum, number[]>>;
}

const DATE_FORMAT = 'YYYY-MM-DD';
const CHIP_ACTIVE_CLASS = 'border-primary bg-blue-50';
const CHIP_INACTIVE_CLASS = 'border-gray-200 bg-white';
const chipClass = (active: boolean) => (active ? CHIP_ACTIVE_CLASS : CHIP_INACTIVE_CLASS);
const chipTextClass = (active: boolean) => (active ? 'text-primary' : 'text-gray-600');
const todayString = () => dayjs().format(DATE_FORMAT);

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isVisible, onClose, recentCategoryIds = {} }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const descriptionRef = useRef<TextInput>(null);

  const [type, setType] = useState<FinanceTransactionTypeEnum>(FinanceTransactionTypeEnum.Expense);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [occurredOn, setOccurredOn] = useState(todayString);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const { data: categories = [] } = useGetFinanceCategoriesQuery({ type });
  const topLevelCategories = categories.filter(c => !c.parentCategoryId);
  const selectedCategory = topLevelCategories.find(c => c.id === selectedCategoryId) ?? null;
  const subCategories = selectedCategory?.subCategories ?? [];
  const recentCategories = (recentCategoryIds[type] ?? [])
    .map(id => topLevelCategories.find(c => c.id === id))
    .filter((c): c is IFinanceCategory => !!c);

  const isExpense = type === FinanceTransactionTypeEnum.Expense;
  const finalCategoryId = selectedSubcategoryId ?? selectedCategoryId;

  const reset = () => {
    setType(FinanceTransactionTypeEnum.Expense);
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setAmount('');
    setDescription('');
    setOccurredOn(todayString());
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectType = (nextType: FinanceTransactionTypeEnum) => {
    setType(nextType);
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
  };

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
  };

  const parsedAmount = parseFloat(amount.replace(',', '.'));
  const canSubmit = !!finalCategoryId && !isNaN(parsedAmount) && parsedAmount > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      await createTransaction({
        type,
        amount: parsedAmount,
        categoryId: finalCategoryId,
        note: description.trim() || undefined,
        occurredOn,
      }).unwrap();
      showSnackbar({
        text: isExpense ? t('finance.addTransaction.expenseAddedSuccess') : t('finance.addTransaction.incomeAddedSuccess'),
        variant: SnackbarVariantEnum.SUCCESS,
      });
      handleClose();
    } catch {
      showSnackbar({ text: t('finance.addTransaction.addedError'), variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onClose={handleClose}
      isLoading={isLoading}
      loadingMessage={t('finance.addTransaction.adding')}
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={handleClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            className={`flex-row items-center gap-1 rounded-lg px-4 py-2 ${canSubmit ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <Ionicons name="add-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('finance.addTransaction.addButton')}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View key={type}>
        <Text className="text-lg font-bold text-center mb-4">{t('finance.addTransaction.title')}</Text>

        <View className="flex-row bg-gray-100 rounded-xl p-1 mb-4">
          <ToggleTab active={isExpense} onPress={() => handleSelectType(FinanceTransactionTypeEnum.Expense)} className="py-2.5">
            <Text className={`text-sm font-bold ${isExpense ? 'text-red-500' : 'text-gray-500'}`}>{t('finance.addTransaction.expense')}</Text>
          </ToggleTab>
          <ToggleTab active={!isExpense} onPress={() => handleSelectType(FinanceTransactionTypeEnum.Income)} className="py-2.5">
            <Text className={`text-sm font-bold ${!isExpense ? 'text-green-600' : 'text-gray-500'}`}>{t('finance.addTransaction.income')}</Text>
          </ToggleTab>
        </View>

        {recentCategories.length > 0 && (
          <>
            <Text className="text-sm font-semibold text-gray-600 mb-2">{t('finance.addTransaction.recentlyUsed')}</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {recentCategories.map(category => {
                const active = selectedCategoryId === category.id;
                return (
                  <TouchableOpacity
                    key={`recent-${category.id}`}
                    onPress={() => handleSelectCategory(category.id)}
                    className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${chipClass(active)}`}
                  >
                    <Ionicons
                      name={resolveCategoryIcon(category.icon)}
                      size={14}
                      color={active ? '#1987EE' : (category.color ?? DEFAULT_CATEGORY_COLOR)}
                    />
                    <Text className={`text-xs font-semibold ${chipTextClass(active)}`}>{category.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <Text className="text-sm font-semibold text-gray-600 mb-2">
          {isExpense ? t('finance.addTransaction.category') : t('finance.addTransaction.source')}
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {topLevelCategories.map(category => {
            const active = selectedCategoryId === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleSelectCategory(category.id)}
                className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${chipClass(active)}`}
              >
                <Ionicons
                  name={resolveCategoryIcon(category.icon)}
                  size={14}
                  color={active ? '#1987EE' : (category.color ?? DEFAULT_CATEGORY_COLOR)}
                />
                <Text className={`text-xs font-semibold ${chipTextClass(active)}`}>{category.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {subCategories.length > 0 && (
          <>
            <Text className="text-sm font-semibold text-gray-600 mb-2">{t('finance.addTransaction.subcategory')}</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {subCategories.map(sub => {
                const active = selectedSubcategoryId === sub.id;
                return (
                  <TouchableOpacity
                    key={sub.id}
                    onPress={() => setSelectedSubcategoryId(sub.id)}
                    className={`px-3 py-2 rounded-xl border ${chipClass(active)}`}
                  >
                    <Text className={`text-xs font-semibold ${chipTextClass(active)}`}>{sub.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <Text className="text-sm font-semibold text-gray-600 mb-2">{t('common.amountPLN')}</Text>
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 mb-3 bg-white"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          returnKeyType="next"
          onSubmitEditing={() => descriptionRef.current?.focus()}
          blurOnSubmit={false}
        />

        <Text className="text-sm font-semibold text-gray-600 mb-2">{t('finance.addTransaction.date')}</Text>
        <TouchableOpacity
          onPress={() => setDatePickerVisible(true)}
          className="flex-row items-center justify-between border border-gray-200 rounded-xl px-4 py-3 mb-3 bg-white"
        >
          <Text className="text-base text-gray-800">{dayjs(occurredOn).format('DD.MM.YYYY')}</Text>
          <Ionicons name="calendar-outline" size={18} color="#6b7280" />
        </TouchableOpacity>

        <Text className="text-sm font-semibold text-gray-600 mb-2">{t('common.descriptionOptional')}</Text>
        <TextInput
          ref={descriptionRef}
          className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-white"
          placeholder={t('common.addNote')}
          value={description}
          onChangeText={setDescription}
          maxLength={120}
          returnKeyType="done"
        />
      </View>

      <Modal isVisible={isDatePickerVisible} onClose={() => setDatePickerVisible(false)} className="pt-14 px-6">
        <DateTimePicker
          mode="single"
          date={occurredOn}
          maxDate={todayString()}
          onChange={({ date }) => {
            setOccurredOn(dayjs(date).format(DATE_FORMAT));
            setDatePickerVisible(false);
          }}
        />
      </Modal>
    </Modal>
  );
};

export default AddTransactionModal;
