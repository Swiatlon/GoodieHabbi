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
import { loginValidationSchema } from '@/components/views/login/schema/schema';
import { IPostLoginRequest } from '@/contract/account/account';
import { useTypedDispatch } from '@/hooks/use-store-hooks';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';
import { useLoginAccountMutation } from '@/redux/api/accounts-api';
import { handleAuthSuccess } from '@/redux/state/auth/auth-state';
import { IApiError } from '@/types/global-types';

const Login = () => {
  const dispatch = useTypedDispatch();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { showSnackbar } = useSnackbar();
  const [loginAccount, { isLoading }] = useLoginAccountMutation();

  const methods = useForm<IPostLoginRequest>({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: IPostLoginRequest) => {
    try {
      const response = await loginAccount(data).unwrap();
      showSnackbar({ text: 'Logged successfully!', variant: SnackbarVariantEnum.SUCCESS });
      dispatch(handleAuthSuccess(response));
      navigation.navigate('(authorized)/dashboard');
    } catch (error: unknown) {
      const typedError = error as IApiError;
      const errorMessage = typedError.data?.message || 'Failed to login. Please try again.';
      showSnackbar({ text: errorMessage, variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <View className="flex-1 justify-center px-4">
      <FormProvider {...methods}>
        <View className="place-self-center items-center place-items-center gap-6 px-8 w-[300px] mx-auto">
          <Image source={userLogo} style={{ width: 80, height: 80 }} resizeMode="contain" />
          <Text className="text-2xl font-bold text-primary">Login Form</Text>
          <ControlledInput name="login" placeholder="Login" placeholderTextColor="#aaa" />
          <ControlledPasswordInput name="password" placeholder="Password" placeholderTextColor="#aaa" />
          <Text
            className="text-sm text-blue-300"
            onPress={() => {
              navigation.navigate('(not-authorized)/register');
            }}
          >
            You don't have an account?
          </Text>
          <Button label="Login" disabled={isLoading} onPress={handleSubmit(onSubmit)} className="px-8 py-3" />
        </View>
      </FormProvider>
    </View>
  );
};

export default Login;
