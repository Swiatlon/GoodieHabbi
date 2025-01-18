import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import userLogo from '@/assets/images/exampleUserIconLogin.png';

const Login = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  return (
    <View className="flex-1 justify-center px-12">
      <View className="items-center gap-8">
        <Image source={userLogo} style={{ width: 80, height: 80 }} resizeMode="contain" />
        <Text className="text-2xl font-bold text-primary text-center">Login Form</Text>
        <TextInput
          className="w-full border border-gray-300 rounded bg-white px-3 py-3"
          placeholder="Login"
          placeholderTextColor="#aaa"
        />
        <TextInput
          className="w-full border border-gray-300 rounded bg-white px-3 py-3"
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
        />
        <Text
          className="text-md text-blue-300"
          onPress={() => {
            navigation.navigate('register');
          }}
        >
          You don't have an account?
        </Text>
        <TouchableOpacity className="bg-primary py-2 px-4 rounded-md w-8/12">
          <Text className="text-white font-semibold text-center">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
