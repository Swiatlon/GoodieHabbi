import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

const Register = () => {
  return (
    <View className="flex justify-center px-4">
      <View className="place-self-center place-items-center gap-6 p-8">
        <Text className="text-2xl font-bold text-primary">Register Form</Text>
        <TextInput
          className="w-full h-10 border border-gray-300 rounded bg-white px-3"
          placeholder="Login"
          placeholderTextColor="#aaa"
        />
        <TextInput
          className="w-full h-10 border border-gray-300 rounded bg-white px-3"
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
        />
        <Text className="text-sm text-blue-300">Do you have an account?</Text>
        <Pressable onPress={() => alert('Register button pressed')} className="bg-blue-500 w-full py-2 rounded">
          <Text className="text-white font-bold text-center">Register</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Register;
