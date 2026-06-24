import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, Platform,
  KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { realizarLogin, solicitarRecuperacaoSenha } from '../../services/authService'; 
import { Dimensions } from 'react-native';
import { salvarCredenciais, obterCredenciais, limparCredenciais } from "../../utilitarios/Seguranca";

const LoginScreen = ({ setScreen, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRecuperacao, setLoadingRecuperacao] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lembrarMe, setLembrarMe] = useState(false);
  const [erroLogin, setErroLogin] = useState('');
  const [erroRecuperacao, setErroRecuperacao] = useState('');
  const [mensagemLembrarMe, setMensagemLembrarMe] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const limparFeedback = () => {
    setErroLogin('');
    setErroRecuperacao('');
    setMensagemLembrarMe('');
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const creds = await obterCredenciais();
        if (mounted && creds) {
          setEmail(creds.email);
          setSenha(creds.senha);
          setLembrarMe(true);
          setMensagemLembrarMe('E-mail e senha preenchidos pelo lembrar-me.');
        }
      } catch (error) {
        if (mounted) {
          const mensagem = error.message || 'Não foi possível carregar as credenciais salvas.';
          setErroLogin(mensagem);
          Alert.alert('Atenção', mensagem);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async () => {
    const emailLimpo = email.trim().toLowerCase();

    limparFeedback();

    if (!emailLimpo || !senha) {
      const mensagem = 'E-mail e senha são obrigatórios.';
      setErroLogin(mensagem);
      Alert.alert('Erro', mensagem);
      return;
    }

    if (!emailRegex.test(emailLimpo)) {
      const mensagem = 'E-mail inválido. Verifique o endereço informado.';
      setErroLogin(mensagem);
      Alert.alert('Erro', mensagem);
      return;
    }

    setLoading(true);
    try {
      const response = await realizarLogin(emailLimpo, senha);

      try {
        if (lembrarMe) {
          await salvarCredenciais(emailLimpo, senha);
        } else {
          await limparCredenciais();
        }
      } catch (storageError) {
        Alert.alert(
          'Atenção',
          storageError.message || 'Não foi possível atualizar as credenciais salvas.'
        );
      }

      if (response?.user) onLoginSuccess(response.user);
      else onLoginSuccess(response);

    } catch (error) {
      const mensagem = error.message || 'Não foi possível fazer login. Tente novamente.';
      setErroLogin(mensagem);
      Alert.alert('Erro no Login', mensagem);
    } finally {
      setLoading(false);
    }
  };

  const handleEsqueciSenha = async () => {
    const emailLimpo = email.trim().toLowerCase();

    limparFeedback();

    if (!emailLimpo) {
      const mensagem = 'Digite seu e-mail para recuperar a senha.';
      setErroRecuperacao(mensagem);
      Alert.alert('Atenção', mensagem);
      return;
    }

    if (!emailRegex.test(emailLimpo)) {
      const mensagem = 'E-mail inválido. Verifique o endereço informado.';
      setErroRecuperacao(mensagem);
      Alert.alert('Erro', mensagem);
      return;
    }

    setLoadingRecuperacao(true);
    try {
      await solicitarRecuperacaoSenha(emailLimpo);
      Alert.alert(
        'E-mail Enviado', 
        'Verifique sua caixa de entrada (e spam). O link para criar uma nova senha foi enviado!'
      );
    } catch (error) {
      const mensagem = error.message || 'Não foi possível enviar o e-mail de recuperação.';
      setErroRecuperacao(mensagem);
      Alert.alert('Erro', mensagem);
    } finally {
      setLoadingRecuperacao(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} testID="tela-login" accessibilityLabel="tela-login">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 0 : -50}
      >
        <ScrollView
          testID="login-scroll"
          accessibilityLabel="login-scroll"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.container}>
            <LinearGradient
              colors={['#0b4786ff', '#001c42ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cabecalho}
            >
              <Image
                source={require('../../../assets/bhealth.png')}
                style={styles.logo}
              />
              <Text testID="login-logo-texto" accessibilityLabel="login-logo-texto" style={styles.titulo}>B Health</Text>
            </LinearGradient>

            <Text style={styles.loginTitulo}>Login</Text>

            <View style={styles.containerLogin}>
              <Text style={styles.emaileSenha}>E-mail*</Text>
              <TextInput
                testID="login-input-email" // <--- ADICIONADO PARA O APPIUM
                accessibilityLabel="login-input-email"
                placeholder="Digite o seu usuário"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  limparFeedback();
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.emaileSenha}>Senha*</Text>
              <View style={styles.senhaContainer}>
                <TextInput
                  testID="login-input-senha" // <--- ADICIONADO PARA O APPIUM
                  accessibilityLabel="login-input-senha"
                  placeholder="Digite a sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={senha}
                  onChangeText={(text) => {
                    setSenha(text);
                    limparFeedback();
                  }}
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                />
                <TouchableOpacity
                  testID="login-botao-mostrar-senha"
                  accessibilityLabel="login-botao-mostrar-senha"
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ marginHorizontal: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {erroLogin ? (
                <Text style={styles.feedbackErro}>{erroLogin}</Text>
              ) : null}

              {mensagemLembrarMe ? (
                <Text style={styles.feedbackInfo}>{mensagemLembrarMe}</Text>
              ) : null}

              <TouchableOpacity
                testID="login-checkbox-lembrarme" // <--- ADICIONADO PARA O APPIUM
                accessibilityLabel="login-checkbox-lembrarme"
                style={styles.checkboxContainer}
                onPress={() => {
                  setLembrarMe(!lembrarMe);
                  limparFeedback();
                }}
              >
                <Ionicons
                  name={lembrarMe ? "checkbox" : "square-outline"}
                  size={15}
                  color="#00245a"
                />
                <Text style={styles.checkboxTexto}>Lembrar-me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="login-botao-entrar" // <--- ADICIONADO PARA O APPIUM
                accessibilityLabel="login-botao-entrar"
                style={[styles.botao, loading && styles.btnDesativado]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnTexto}>Entrar</Text>
                )}
              </TouchableOpacity>

              {/* 3. Botão de Esqueci Minha Senha adicionado aqui */}
              <TouchableOpacity
                testID="login-botao-esqueci-senha" // <--- ADICIONADO PARA O APPIUM
                accessibilityLabel="login-botao-esqueci-senha"
                style={[styles.esqueciSenhaButton, loadingRecuperacao && styles.linkDesativado]}
                onPress={handleEsqueciSenha}
                disabled={loadingRecuperacao}
              >
                <Text style={styles.esqueciSenhaTexto}>
                  {loadingRecuperacao ? 'Enviando e-mail...' : 'Esqueceu a sua senha? Clique aqui'}
                </Text>
              </TouchableOpacity>

              {erroRecuperacao ? (
                <Text style={styles.feedbackErro}>{erroRecuperacao}</Text>
              ) : null}

              <TouchableOpacity 
                testID="login-botao-cadastro" // <--- ADICIONADO PARA O APPIUM
                accessibilityLabel="login-botao-cadastro"
                onPress={() => setScreen('cadastro')}
              >
                <Text style={styles.cadastroDois}>É novo aqui? Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#08366171" ,
  },

  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
    backgroundColor: '#ffffff',
  },

  cabecalho: {
    height: height * 0.30,
    maxHeight: 300, 
    borderBottomLeftRadius: width * 0.12,
    borderBottomRightRadius: width * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
},

  logo: {
    width: width * 0.28,
    height: width * 0.28,
    tintColor: 'white',
  },

  titulo: {
    fontSize: Math.min(width * 0.08, 40),
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15,
  },

  loginTitulo: {
    marginTop: 20,
    fontSize: Math.min(width * 0.06, 30),
    fontWeight: 'bold',
    color: '#192f3fff',
    textAlign: 'center',
  },

  containerLogin: {
    backgroundColor: '#ffff',
    margin: width * 0.08,
    padding: width * 0.05,
    marginTop: 10,
  },

  emaileSenha: {
    fontSize: Math.min(width * 0.035, 18),
    color: '#181818ff',
    marginBottom: 5,
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#e9ecee',
    borderRadius: 20,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333',
  },

  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecee',
    borderRadius: 20,
    marginBottom: 15,
    height: 50,
  },

  esqueciSenhaButton: {
    alignSelf: 'center', 
    marginTop: 10,
    textAlign: 'center',
  },

  linkDesativado: {
    opacity: 0.7,
  },

  esqueciSenhaTexto: {
    color: '#c53939', 
    fontSize: Math.min(width * 0.035, 18),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  feedbackErro: {
    color: '#c53939',
    fontSize: Math.min(width * 0.033, 16),
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },

  feedbackInfo: {
    color: '#245e35',
    fontSize: Math.min(width * 0.032, 15),
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },

  botao: {
    backgroundColor: '#00245aff',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 10,
    marginTop: 30,
  },

  btnTexto: {
    color: '#ffffff',
    fontSize: Math.min(width * 0.04, 20),
    fontWeight: 'bold',
  },

  btnDesativado: {
    backgroundColor: '#9aa0b1',
  },

  cadastroDois: {
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: Math.min(width * 0.035, 18),
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },

  checkboxTexto: {
    marginLeft: 8,
    color: "#868383ff",
    fontSize: 12,
    fontWeight: "bold",
  },

});
