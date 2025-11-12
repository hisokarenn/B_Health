import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, Platform,
  KeyboardAvoidingView, ScrollView,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { realizarLogin } from '../../services/authService';

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
      const response = await realizarLogin({ email, senha });
      onLoginSuccess(response.data.usuario);
      setEmail('');
      setSenha('');
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || 'Erro de rede ou servidor.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -50}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.container}>
            <LinearGradient
              colors={['#1a1e52ff', '#2d3387ff', '#c14e1dff']}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eef1f4',
  },

  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 1 : 0,
    backgroundColor: '#ffffff',
  },

  cabecalho: {
    height: 320,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 150,
    height: 150,
    tintColor: 'white',
  },

  titulo: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15,
  },

  loginTitulo: {
    marginTop: 20,
    fontSize: 23,
    fontWeight: 'bold',
    color: '#57636C',
    textAlign: 'center',
  },

  containerLogin: {
    backgroundColor: '#ffffff',
    margin: 30,
    padding: 20,
    marginTop: 10,
  },

  emaileSenha: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#e9ecee',
    borderRadius: 20,
    height: 47,
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
    backgroundColor: '#3a445d',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
    height: 45,
    margin: 30,
  },

  btnTexto: {
    color: '#ffffff',
    fontSize: 16,
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