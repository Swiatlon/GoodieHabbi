import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import ControlledIconPicker from './icon-picker';
import { useCategoryValidationSchema } from './schema';
import ControlledInput from '@/components/shared/input/controlled-input';
import Modal, { IBaseModalProps } from '@/components/shared/modal/modal';
import ControlledSwatches from '@/components/shared/swatches/controlled-swatches';
import ToggleTab from '@/components/shared/toggle-tab/toggle-tab';
import { FinanceTransactionTypeEnum, IFinanceCategory } from '@/contract/finance/finance.contract';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useCreateFinanceCategoryMutation, useUpdateFinanceCategoryMutation } from '@/redux/api/finance/finance-api';
import { IApiError } from '@/types/global-types';
import { DEFAULT_CATEGORY_COLOR, DEFAULT_CATEGORY_ICON, resolveCategoryIcon } from '@/utils/finance/category-helpers';

interface CategoryFormModalProps extends IBaseModalProps {
  // Active tab type — the default for a brand new top-level category, and (via parentCategory) the fixed,
  // non-editable type for a subcategory, since subcategories always inherit the parent's type server-side.
  type: FinanceTransactionTypeEnum;
  category: IFinanceCategory | null;
  parentCategory: IFinanceCategory | null;
  siblingNames: string[];
}

interface CategoryFormValues {
  name: string;
  color: string;
  icon: string;
  type: FinanceTransactionTypeEnum;
  isSavings: boolean;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isVisible, onClose, type, category, parentCategory, siblingNames }) => {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const [createFinanceCategory, { isLoading: isCreating }] = useCreateFinanceCategoryMutation();
  const [updateFinanceCategory, { isLoading: isUpdating }] = useUpdateFinanceCategoryMutation();
  const categoryValidationSchema = useCategoryValidationSchema();

  const isSubcategory = category ? category.parentCategoryId != null : parentCategory != null;

  const methods = useForm<CategoryFormValues>({
    resolver: yupResolver(categoryValidationSchema(siblingNames, category?.name)),
    defaultValues: { name: '', color: DEFAULT_CATEGORY_COLOR, icon: DEFAULT_CATEGORY_ICON, type, isSavings: false },
  });
  const { handleSubmit, reset: resetForm, watch, setValue, getValues } = methods;
  const selectedColor = watch('color');
  const selectedType = watch('type');
  const isSavings = watch('isSavings');

  useEffect(() => {
    if (!isVisible) return;

    if (category) {
      resetForm({
        name: category.name,
        color: category.color ?? DEFAULT_CATEGORY_COLOR,
        icon: resolveCategoryIcon(category.icon),
        type: category.type,
        isSavings: category.isSavings,
      });
    } else {
      resetForm({
        name: '',
        color: parentCategory?.color ?? DEFAULT_CATEGORY_COLOR,
        icon: DEFAULT_CATEGORY_ICON,
        type: parentCategory?.type ?? type,
        isSavings: false,
      });
    }
  }, [isVisible, category, parentCategory, type, resetForm]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (category) {
        // PUT is a full replace (pułapka 2) — always send name/color/icon/isSavings, never just the changed field.
        await updateFinanceCategory({
          id: category.id,
          data: {
            name: values.name.trim(),
            color: values.color,
            icon: values.icon,
            isSavings: isSubcategory ? category.isSavings : values.isSavings,
          },
        }).unwrap();
        showSnackbar({ text: t('finance.categories.updatedSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      } else {
        await createFinanceCategory({
          name: values.name.trim(),
          type: isSubcategory && parentCategory ? parentCategory.type : values.type,
          parentCategoryId: isSubcategory && parentCategory ? parentCategory.id : undefined,
          color: values.color,
          icon: values.icon,
          isSavings: isSubcategory ? undefined : values.isSavings,
        }).unwrap();
        showSnackbar({ text: t('finance.categories.createdSuccess'), variant: SnackbarVariantEnum.SUCCESS });
      }
      onClose();
    } catch (err) {
      const error = err as IApiError;
      showSnackbar({
        text: error.data?.message || t(category ? 'finance.categories.updatedError' : 'finance.categories.createdError'),
        variant: SnackbarVariantEnum.ERROR,
      });
    }
  };

  const isExpense = selectedType === FinanceTransactionTypeEnum.Expense;

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      isLoading={isCreating || isUpdating}
      loadingMessage={category ? t('finance.categories.updating') : t('finance.categories.creating')}
      footer={
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={onClose} className="flex-row items-center gap-1 border border-primary rounded-lg px-4 py-2">
            <Ionicons name="close-circle-outline" size={18} color="#1987EE" />
            <Text className="text-primary font-semibold">{t('common.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit(onSubmit)} className="flex-row items-center gap-1 rounded-lg px-4 py-2 bg-primary">
            <Ionicons name="checkmark-circle-outline" size={18} color="white" />
            <Text className="text-white font-semibold">{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text className="text-lg font-bold text-gray-800 text-center mb-4">
        {category
          ? t('finance.categories.editTitle')
          : isSubcategory
            ? t('finance.categories.addSubcategoryTitle')
            : t('finance.categories.addTopLevelTitle')}
      </Text>

      <FormProvider {...methods}>
        <View className="gap-5">
          <ControlledInput name="name" label={t('finance.categories.nameLabel')} placeholder={t('finance.categories.namePlaceholder')} isRequired />

          {!isSubcategory && !category && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-gray-500">{t('finance.categories.typeLabel')}</Text>
              <View className="flex-row bg-gray-100 rounded-xl p-1">
                <ToggleTab active={isExpense} onPress={() => setValue('type', FinanceTransactionTypeEnum.Expense)} className="py-2">
                  <Text className={`text-sm font-bold ${isExpense ? 'text-red-500' : 'text-gray-500'}`}>{t('finance.addTransaction.expense')}</Text>
                </ToggleTab>
                <ToggleTab active={!isExpense} onPress={() => setValue('type', FinanceTransactionTypeEnum.Income)} className="py-2">
                  <Text className={`text-sm font-bold ${!isExpense ? 'text-green-600' : 'text-gray-500'}`}>{t('finance.addTransaction.income')}</Text>
                </ToggleTab>
              </View>
            </View>
          )}

          <ControlledSwatches name="color" label={t('finance.categories.colorLabel')} />
          <ControlledIconPicker name="icon" label={t('finance.categories.iconLabel')} accentColor={selectedColor} />

          {!isSubcategory && (
            <TouchableOpacity
              onPress={() => setValue('isSavings', !getValues('isSavings'))}
              className="flex-row items-center justify-between px-3 py-3 bg-gray-50 rounded-xl"
            >
              <View className="flex-1 pr-3">
                <Text className="text-sm font-semibold text-gray-700">{t('finance.categories.isSavingsLabel')}</Text>
                <Text className="text-xs text-gray-400 mt-0.5">{t('finance.categories.isSavingsHint')}</Text>
              </View>
              <Ionicons name={isSavings ? 'toggle' : 'toggle-outline'} size={32} color={isSavings ? '#10B981' : '#9ca3af'} />
            </TouchableOpacity>
          )}
        </View>
      </FormProvider>
    </Modal>
  );
};

export default CategoryFormModal;
