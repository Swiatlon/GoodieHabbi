import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Text, Image } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import userLogo from '@/assets/images/exampleUserIconLogin.png';
import Button from '@/components/shared/button/button';
import ControlledInput from '@/components/shared/input/controlled-input';
import ControlledPasswordInput from '@/components/shared/password/controlled-password-input';
import { registerValidationSchema } from '@/components/views/register/schema/schema';
import { IPostRegisterRequest } from '@/contract/auth/auth';
import { useTypedDispatch } from '@/hooks/use-store-hooks';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useRegisterAccountMutation } from '@/redux/api/auth/auth-api';
import { handleAuthSuccess } from '@/redux/state/auth/auth-state';
import { IApiError } from '@/types/global-types';

const Register = () => {
  const dispatch = useTypedDispatch();
  const { showSnackbar } = useSnackbar();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [createAccount, { isLoading }] = useRegisterAccountMutation();

  const methods = useForm<IPostRegisterRequest>({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: IPostRegisterRequest) => {
    try {
      const response = await createAccount(data).unwrap();
      showSnackbar({ text: 'Account added successfully!', variant: SnackbarVariantEnum.SUCCESS });
      await dispatch(handleAuthSuccess(response));
      navigation.navigate('(authorized)/dashboard');
      reset();
    } catch (error: unknown) {
      const typedError = error as IApiError;
      const errorMessage = typedError.data?.message || 'Failed to add account. Please try again.';
      showSnackbar({ text: errorMessage, variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <View className="flex-1 justify-center px-4">
      <FormProvider {...methods}>
        <View className="place-self-center items-center place-items-center gap-6 px-8 w-[300px] mx-auto">
          <Image source={userLogo} style={{ width: 80, height: 80 }} resizeMode="contain" />
          <Text className="text-2xl font-bold text-primary">Register Form</Text>
          <ControlledInput name="email" className="py-1" placeholder="Email" placeholderTextColor="#aaa" />
          <ControlledPasswordInput name="password" className="py-1" placeholder="Password" placeholderTextColor="#aaa" />
          <Text
            className="text-sm text-blue-300"
            onPress={() => {
              navigation.navigate('(not-authorized)/login');
            }}
          >
            Do you have an account?
          </Text>
          <Button label="Register" disabled={isLoading} onPress={handleSubmit(onSubmit)} className="px-8 py-3" />
        </View>
      </FormProvider>
    </View>
  );
};

export default Register;
