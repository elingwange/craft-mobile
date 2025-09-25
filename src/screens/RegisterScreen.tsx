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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signup } from '../services/AuthApi';
import { privacyPolicyContent } from '../const';
import { useTheme } from '../contexts/ThemeContext';

// 定义你的导航器中所有页面的类型
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: undefined; // 底部标签导航器
};

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

const RegisterScreen: FC<RegisterScreenProps> = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPolicyModalVisible, setPolicyModalVisible] = useState(false);

  const handleSignUp = async (): Promise<void> => {
    if (!agreeToTerms) {
      Alert.alert('提示', '请阅读并同意隐私政策');
      return;
    }
    if (!username || !email || !password) {
      Alert.alert('错误', '所有字段都不能为空');
      return;
    }

    const userData = await signup(username, email, password);
    if (userData) {
      Alert.alert('成功', '注册成功！请登录');
      navigation.replace('Login'); // 注册成功后返回登录界面
    } else {
      Alert.alert('注册失败', '请检查注册信息并重试');
    }
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
          name="user"
          size={20}
          color={theme.subText}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Username"
          placeholderTextColor={theme.subText}
          autoCapitalize="none"
          onChangeText={setUsername}
          value={username}
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
        onPress={handleSignUp}
        style={styles.signInButtonWrapper}
      >
        <LinearGradient
          colors={['#b09971', '#ffc371']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.signInButton}
        >
          <Text style={styles.signInButtonText}>Sign Up</Text>
        </LinearGradient>
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

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.signInLink}
      >
        <Text style={[styles.signInLinkText, { color: theme.subText }]}>
          Already have an account?{' '}
          <Text style={[styles.signInLinkHighlight, { color: theme.primary }]}>
            Sign In
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
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
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
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
  signInLink: {
    marginTop: 30,
  },
  signInLinkText: {
    fontSize: 14,
  },
  signInLinkHighlight: {
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

export default RegisterScreen;
