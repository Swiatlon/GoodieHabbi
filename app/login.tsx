import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Text, Image, Pressable } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import userLogo from '@/assets/images/exampleUserIconLogin.png';
import ControlledInput from '@/components/shared/input/controlled-input';
import { loginValidationSchema } from '@/components/views/login/schema/schema';
import { IPostLoginRequest } from '@/contract/login/login';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';

const Login = () => {
  const { showSnackbar } = useSnackbar();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

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
      console.log(data);
      // await createQuest(data).unwrap();
      showSnackbar({ text: 'Quest added successfully!', variant: SnackbarVariantEnum.SUCCESS });
    } catch {
      showSnackbar({ text: 'Failed to add quest. Please try again.', variant: SnackbarVariantEnum.ERROR });
    }
  };

  return (
    <View className="flex-1 justify-center px-4">
      <FormProvider {...methods}>
        <View className="place-self-center place-items-center gap-6 px-8">
          <Image source={userLogo} style={{ width: 80, height: 80 }} resizeMode="contain" />
          <Text className="text-2xl font-bold text-primary">Login Form</Text>
          <ControlledInput name="login" className="py-1" placeholder="Login" placeholderTextColor="#aaa" />
          <ControlledInput name="password" className="py-1" placeholder="Password" placeholderTextColor="#aaa" secureTextEntry={true} />
          <Text
            className="text-sm text-blue-300"
            onPress={() => {
              navigation.navigate('register');
            }}
          >
            You don't have an account?
          </Text>
          <Pressable onPress={handleSubmit(onSubmit)} className="bg-blue-500 w-full py-2 rounded">
            <Text className="text-white font-bold text-center">Login</Text>
          </Pressable>
        </View>
      </FormProvider>
    </View>
  );
};

export default Login;
