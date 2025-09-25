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
import { login } from '../services/AuthApi';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackActions } from '@react-navigation/native';

// 定义你的导航器中所有页面的类型
type RootStackParamList = {
  Login: undefined;
  Issues: undefined;
  MainApp: undefined;
  Register: undefined;
};

// 确保 LoginScreenProps 包含 navigation 和 route
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'> & {
  onLogin: () => void;
};

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  // 新增状态：控制密码可见性
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (): Promise<void> => {
    if (!agreeToTerms) {
      Alert.alert('提示', '请阅读并同意隐私政策');
      return;
    }

    if (!email || !password) {
      Alert.alert('错误', '邮箱和密码不能为空。');
      return;
    }

    const userData = await login('Rain', email, password);
    if (userData) {
      console.log('Login successful');
      // ✅ 关键修复：使用 StackActions.replace 替换整个堆栈
      navigation.dispatch(StackActions.replace('MainApp'));
    } else {
      console.log('Login failed');
    }
  };

  const handleSignUp = (): void => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = (): void => {
    navigation.navigate('ResetPassword');
  };

  const toggleAgreeToTerms = (): void => {
    setAgreeToTerms(prevValue => !prevValue);
  };

  // 新增函数：切换密码可见性
  const toggleShowPassword = (): void => {
    setShowPassword(prevValue => !prevValue);
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
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity
          style={styles.passwordToggleIcon}
          onPress={toggleShowPassword}
        >
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#888"
          />
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
    paddingRight: 30,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  craftText: {
    fontSize: 38,
    color: '#fff',
    fontWeight: 'bold',
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
