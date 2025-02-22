import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { View, Text, Pressable, Image } from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import userLogo from '@/assets/images/exampleUserIconLogin.png';
import ControlledInput from '@/components/shared/input/controlled-input';
import { registerValidationSchema } from '@/components/views/register/schema/schema';
import { IPostRegisterRequest } from '@/contract/register/register';
import { SnackbarVariantEnum, useSnackbar } from '@/providers/snackbar/snackbar-context';

const Register = () => {
  const { showSnackbar } = useSnackbar();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const methods = useForm<IPostRegisterRequest>({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: IPostRegisterRequest) => {
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
        <View className="place-self-center place-items-center gap-6 px-8 w-[300px]">
          <Image source={userLogo} style={{ width: 80, height: 80 }} resizeMode="contain" />
          <Text className="text-2xl font-bold text-primary">Register Form</Text>
          <ControlledInput name="email" className="py-1" placeholder="Email" placeholderTextColor="#aaa" />
          <ControlledInput name="password" className="py-1" placeholder="Password" placeholderTextColor="#aaa" secureTextEntry={true} />
          <Text
            className="text-sm text-blue-300"
            onPress={() => {
              navigation.navigate('email');
            }}
          >
            Do you have an account?
          </Text>
          <Pressable onPress={handleSubmit(onSubmit)} className="bg-blue-500 w-full py-2 rounded">
            <Text className="text-white font-bold text-center">Register</Text>
          </Pressable>
        </View>
      </FormProvider>
    </View>
  );
};

export default Register;
