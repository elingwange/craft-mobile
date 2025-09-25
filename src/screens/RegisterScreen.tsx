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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  // 新增状态：控制密码可见性
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

  // 新增函数：切换密码可见性
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
        {/* 使用与登录界面相同的 logo 和样式 */}
        <Image
          source={require('../../assets/images/app_logo2.png')}
          style={styles.logo}
        />
        <Text style={styles.craftText}>Craft</Text>
      </View>
      {/* 用户名输入框 */}
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          autoCapitalize="none"
          onChangeText={setUsername}
          value={username}
        />
      </View>

      {/* 邮箱输入框 */}
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

      {/* 密码输入框 */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          // 根据 showPassword 状态动态设置 secureTextEntry
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
        />
        {/* 密码显示/隐藏按钮 */}
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

      {/* 注册按钮 */}
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

      {/* 隐私政策复选框 */}
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

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.signInLink}
      >
        <Text style={styles.signInLinkText}>
          Already have an account?{' '}
          <Text style={styles.signInLinkHighlight}>Sign In</Text>
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
    backgroundColor: '#1c1c1c',
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
    color: '#fff',
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 30,
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
  signInLink: {
    marginTop: 30,
  },
  signInLinkText: {
    color: '#888',
    fontSize: 14,
  },
  signInLinkHighlight: {
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

export default RegisterScreen;
