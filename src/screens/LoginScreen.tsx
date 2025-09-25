import React, { useState, type FC } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { login } from '../services/AuthApi';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { privacyPolicyContent } from '../const';
import { useTheme } from '../contexts/ThemeContext';

// 定义你的导航器中所有页面的类型
type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Register: undefined;
  ResetPassword: undefined;
};

// 关键修正：LoginScreenProps 类型中，onLogin 是一个必需的函数
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'> & {
  onLogin: () => void;
};

const LoginScreen: FC<LoginScreenProps> = ({ navigation, onLogin }) => {
  const { theme, isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPolicyModalVisible, setPolicyModalVisible] = useState(false);

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
      // 关键修正：登录成功后，调用 onLogin prop
      // 这会通知 RootNavigator 登录状态已改变
      onLogin();
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

  const toggleShowPassword = (): void => {
    setShowPassword(prevValue => !prevValue);
  };

  const openPolicyModal = (): void => {
    setPolicyModalVisible(true);
  };

  const closePolicyModal = (): void => {
    setPolicyModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerLogoContainer}>
        <Image
          source={require('../../assets/images/app_logo2.png')}
          style={styles.logo}
        />
        <Text style={[styles.craftText, { color: theme.text }]}>Craft</Text>
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.inputBackground,
            borderColor: isDarkMode ? theme.border : 'transparent',
          },
        ]}
      >
        <Icon
          name="mail"
          size={20}
          color={theme.subText}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Email"
          placeholderTextColor={theme.subText}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.inputBackground,
            borderColor: isDarkMode ? theme.border : 'transparent',
          },
        ]}
      >
        <Icon
          name="lock"
          size={20}
          color={theme.subText}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Password"
          placeholderTextColor={theme.subText}
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
            color={theme.subText}
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
        <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
          Forget Password?
        </Text>
      </TouchableOpacity>

      <Text style={[styles.orText, { color: theme.subText }]}>or</Text>

      <TouchableOpacity
        onPress={handleSignUp}
        style={[styles.signUpButton, { borderColor: theme.primary }]}
      >
        <Text style={[styles.signUpButtonText, { color: theme.primary }]}>
          Sign Up
        </Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={toggleAgreeToTerms} style={styles.checkbox}>
          {agreeToTerms ? (
            <Icon name="check-square" size={18} color={theme.primary} />
          ) : (
            <Icon name="square" size={18} color={theme.subText} />
          )}
        </TouchableOpacity>
        <Text style={[styles.termsText, { color: theme.subText }]}>
          You have read and agree to the{' '}
          <Text
            style={[styles.privacyPolicyText, { color: theme.primary }]}
            onPress={openPolicyModal}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>

      {isPolicyModalVisible && (
        <View
          style={[
            styles.modalOverlay,
            {
              backgroundColor: isDarkMode
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(0, 0, 0, 0.5)',
            },
          ]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <ScrollView contentContainerStyle={styles.policyScrollView}>
              <Text style={[styles.policyText, { color: theme.text }]}>
                {privacyPolicyContent}
              </Text>
            </ScrollView>
            <TouchableOpacity
              onPress={closePolicyModal}
              style={[styles.closeButton, { backgroundColor: theme.primary }]}
            >
              <Text
                style={[styles.closeButtonText, { color: theme.buttonText }]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderWidth: 1,
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
    fontSize: 14,
    marginBottom: 30,
  },
  orText: {
    fontSize: 16,
    marginBottom: 20,
  },
  signUpButton: {
    width: '100%',
    height: 55,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  signUpButtonText: {
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
    fontSize: 13,
  },
  privacyPolicyText: {
    fontWeight: 'bold',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
    padding: 20,
  },
  policyScrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  policyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
