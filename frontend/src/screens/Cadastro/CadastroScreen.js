// frontend/src/screens/Cadastro/CadastroScreen.js

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator,
  Alert, Platform, KeyboardAvoidingView, ScrollView,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';
import { cadastrarPaciente } from '../../services/authService';

const CadastroScreen = ({ setScreen }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cns, setCns] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !cpf || !cns || !email || !senha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios para o cadastro.');
      return;
    }

    setLoading(true);
    try {
      const response = await cadastrarPaciente({ nome, cpf, cns, email, senha });
      Alert.alert(
        'Sucesso B Health!',
        `Cadastro de ${response.data.paciente.nome} realizado com sucesso!`
      );
      setNome('');
      setCpf('');
      setCns('');
      setEmail('');
      setSenha('');
      setScreen('login');
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        'Não foi possível se conectar';
      Alert.alert('Erro no Cadastro', errorMessage);
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <LinearGradient
              colors={['#1a1e52ff', '#2d3387ff', '#c14e1dff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cabecalho}
            >
                <View style={styles.cabecalho2}>
                    <Image
                    source={require('../../../assets/bhealth.png')}
                    style={styles.logo}
                    />
                    <Text style={styles.titulo}>B Health</Text>
                </View>
            </LinearGradient>

            <Text style={styles.loginTitulo}>Cadastro</Text>

            <View style={styles.containerCadastro}>
              <Text style={styles.label}>Nome completo*</Text>
              <TextInput
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
                style={styles.input}
                value={nome}
                onChangeText={setNome}
              />

              <Text style={styles.label}>CPF*</Text>
              <TextInput
                placeholder="Digite seu CPF"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={14}
                style={styles.input}
                value={cpf}
                onChangeText={setCpf}
              />

              <Text style={styles.label}>CNS*</Text>
              <TextInput
                placeholder="Digite seu CNS"
                placeholderTextColor="#999"
                keyboardType="numeric"
                style={styles.input}
                value={cns}
                onChangeText={setCns}
              />

              <Text style={styles.label}>E-mail*</Text>
              <TextInput
                placeholder="Digite seu e-mail"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Senha*</Text>
              <View style={styles.senhaContainer}>
                <TextInput
                  placeholder="Crie uma senha"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={senha}
                  onChangeText={setSenha}
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
                onPress={handleCadastro}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnTexto}>Cadastrar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setScreen('login')}>
                <Text style={styles.voltarLogin}>Já tem conta? Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CadastroScreen;

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
    height: 160,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 25,
  },

  cabecalho2: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 65,
    height: 65,
    tintColor: '#fff',
    marginRight: 15,
    marginLeft: 15,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  loginTitulo: {
    marginTop: 20,
    fontSize: 23,
    fontWeight: 'bold',
    color: '#57636C',
    textAlign: 'center',
  },

  containerCadastro: {
    backgroundColor: '#ffffff',
    margin: 30,
    padding: 20,
    marginTop: 10,
  },

  label: {
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
    margin: -5,
  },

  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecee',
    borderRadius: 20,
    marginBottom: 15,
    height: 51,
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

  voltarLogin: {
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});