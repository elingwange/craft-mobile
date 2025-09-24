import React, { useState } from 'react';
import type { FC } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { login } from '../services/AuthApi'; // Import the new login function
// 从 @react-navigation/native-stack 导入 NativeStackScreenProps
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 定义你的导航器中所有页面的类型
type RootStackParamList = {
  Login: undefined;
  Issues: undefined;
};

// 确保 LoginScreenProps 包含 navigation 和 route
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSignIn = async (): Promise<void> => {
    if (!agreeToTerms) {
      Alert.alert('提示', '请阅读并同意隐私政策');
      return;
    }
    // ✅ 正确做法：直接使用新的值
    const newUserName = 'Rain';
    const newEmail = 'rain@gmail.com';
    const newPassword = 'Abc123@';

    // 可选：如果 UI 绑定了这些值，你仍然可以更新状态
    setUserName(newUserName);
    setEmail(newEmail);
    setPassword(newPassword);

    // Call the login API with the new values
    const token = await login(newUserName, newEmail, newPassword);

    if (token) {
      await AsyncStorage.setItem('userToken', token);
      navigation.replace('Issues');
    } else {
      console.log('Login failed');
    }
  };

  const handleSignUp = (): void => {
    Alert.alert('提示', '前往注册页面');
    console.log('注册');
  };

  const handleForgotPassword = (): void => {
    Alert.alert('提示', '前往找回密码页面');
    console.log('忘记密码');
  };

  const toggleAgreeToTerms = (): void => {
    setAgreeToTerms(prevValue => !prevValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerLogoContainer}>
        <Image
          source={require('../../assets/images/app_logo2.png')}
          style={styles.logo}
        />
        <Text style={styles.craftText}>Craft</Text>
      </View>

      <View style={styles.inputContainer}>
        <Icon name="mail" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={true}
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.passwordToggleIcon}>
          <Icon name="eye-off" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSignIn}
        style={styles.signInButtonWrapper}
      >
        <LinearGradient
          colors={['#b09971', '#ffc371']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.signInButton}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forget Password?</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={toggleAgreeToTerms} style={styles.checkbox}>
          {agreeToTerms ? (
            <Icon name="check-square" size={18} color="#007bff" />
          ) : (
            <Icon name="square" size={18} color="#888" />
          )}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          You have read and agree to the{' '}
          <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  craftText: {
    fontSize: 38,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoPlaceholder: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
  },
  passwordToggleIcon: {
    paddingLeft: 10,
  },
  signInButtonWrapper: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 15,
  },
  signInButton: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
    marginBottom: 30,
  },
  orText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 20,
  },
  signUpButton: {
    width: '100%',
    height: 55,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#b09971',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  signUpButtonText: {
    color: '#b09971',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  termsText: {
    color: '#888',
    fontSize: 13,
  },
  privacyPolicyText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
