import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, Platform,
  KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { realizarLogin } from '../../services/authService'; // Certifique-se de que o caminho está correto
import { Dimensions } from 'react-native';

const LoginScreen = ({ setScreen, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'E-mail e senha são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      // Chama a função de login do authService
      const response = await realizarLogin(email, senha);
      
      // Verifica se o login foi bem-sucedido e chama onLoginSuccess com os dados do usuário
      if (response && response.user) {
          onLoginSuccess(response.user);
      } else {
          // Fallback caso a estrutura da resposta seja diferente (ex: apenas user)
           onLoginSuccess(response);
      }

      setEmail('');
      setSenha('');
    } catch (error) {
      const errorMessage =
        error.message || 'Erro de rede ou servidor.'; // Usa a mensagem de erro direta se disponível
      Alert.alert('Erro no Login', errorMessage);
      console.error("Erro de login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 0 : -50}
      >
        <ScrollView
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
              <Text style={styles.titulo}>B Health</Text>
            </LinearGradient>

            <Text style={styles.loginTitulo}>Login</Text>

            <View style={styles.containerLogin}>
              <Text style={styles.emaileSenha}>E-mail*</Text>
              <TextInput
                placeholder="Digite o seu usuário"
                placeholderTextColor="#999"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.emaileSenha}>Senha*</Text>
              <View style={styles.senhaContainer}>
                <TextInput
                  placeholder="Digite a sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={senha}
                  onChangeText={setSenha}
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                />
                <TouchableOpacity
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

              <TouchableOpacity
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

              <TouchableOpacity onPress={() => setScreen('cadastro')}>
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
    backgroundColor: 'transparent',
  },

  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
    backgroundColor: '#ffffff',
  },

  cabecalho: {
    height: height * 0.35,
    borderBottomLeftRadius: width * 0.12,
    borderBottomRightRadius: width * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: width * 0.32,
    height: width * 0.32,
    tintColor: 'white',
  },

  titulo: {
    fontSize: width * 0.085,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15,
  },

  loginTitulo: {
    marginTop: 20,
    fontSize: width * 0.06,
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
    fontSize: width * 0.035,
    color: '#181818ff',
    marginBottom: 5,
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#e9ecee',
    borderRadius: 20,
    height: height * 0.055,
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
  },

  botao: {
    backgroundColor: '#00245aff',
    borderRadius: 20,
    paddingVertical: height * 0.015,
    alignItems: 'center',
    marginVertical: 10,
  },

  btnTexto: {
    color: '#ffffff',
    fontSize: width * 0.04,
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
  },
});