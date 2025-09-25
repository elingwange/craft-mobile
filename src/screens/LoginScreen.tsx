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
import { StackActions } from '@react-navigation/native';
import { privacyPolicyContent } from '../const';

// 定义你的导航器中所有页面的类型
type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Register: undefined;
  ResetPassword: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'> & {
  onLogin: () => void;
};

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // ✅ 新增状态：控制隐私政策弹窗的可见性
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

  const toggleShowPassword = (): void => {
    setShowPassword(prevValue => !prevValue);
  };

  // ✅ 新增函数：打开和关闭隐私政策弹窗
  const openPolicyModal = (): void => {
    setPolicyModalVisible(true);
  };

  const closePolicyModal = (): void => {
    setPolicyModalVisible(false);
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
            <Icon name="check-square" size={18} color="#b09971" />
          ) : (
            <Icon name="square" size={18} color="#888" />
          )}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          You have read and agree to the{' '}
          {/* ✅ 关键修复：点击隐私政策文本时打开弹窗 */}
          <Text style={styles.privacyPolicyText} onPress={openPolicyModal}>
            Privacy Policy
          </Text>
        </Text>
      </View>

      {/* ✅ 新增：隐私政策弹窗 */}
      {isPolicyModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.policyScrollView}>
              <Text style={styles.policyText}>{privacyPolicyContent}</Text>
            </ScrollView>
            <TouchableOpacity
              onPress={closePolicyModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
    color: '#b09971',
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
    color: '#b09971',
    fontWeight: 'bold',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
  },
  policyScrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  policyText: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#b09971',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
