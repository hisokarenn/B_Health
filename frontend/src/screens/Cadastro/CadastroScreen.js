import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator,
  Alert, Platform, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { cadastrarPaciente } from '../../services/authService';
import { Dimensions } from 'react-native';

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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!emailRegex.test(email)) {
        Alert.alert('Erro', 'Por favor, insira um endereço de e-mail Gmail válido (ex: usuario@gmail.com).');
        return;
    }

    setLoading(true);
    try {
      // A função cadastrarPaciente agora retorna o objeto 'user' do Firebase Auth
      const user = await cadastrarPaciente({ nome, cpf, cns, email, senha });
      
      // CORREÇÃO AQUI: Usamos o nome do estado local, pois o user do Firebase pode não ter o displayName atualizado instantaneamente
      Alert.alert(
        'Sucesso B Health!',
        `Cadastro de ${nome} realizado com sucesso!`
      );
      
      setNome('');
      setCpf('');
      setCns('');
      setEmail('');
      setSenha('');
      setScreen('login');
    } catch (error) {
      // Tratamento de erro robusto para capturar mensagens do Firebase ou da API
      const errorMessage = error.message || 'Não foi possível se conectar';
      Alert.alert('Erro no Cadastro', errorMessage);
      console.error("Erro detalhado no cadastro:", error);
    } finally {
      setLoading(false);
    }
  };


  //CPF
  const formatarCPF = (value) => {
    let raw = value.replace(/\D/g, "");

    if (raw.length > 11) raw = raw.substring(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return raw.replace(/(\d{3})(\d+)/, "$1.$2");
    if (raw.length <= 9) return raw.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");

    return raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const validarCPF = (cpf) => {
    const somenteNumeros = cpf.replace(/\D/g, ""); //isso faz q tenha a contagem somente dos números
    return somenteNumeros.length === 11;
  };


  //CNS
  const formatarCNS = (value) => {
    let raw = value.replace(/\D/g, "");

    if (raw.length > 15) raw = raw.substring(0, 15);
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return raw.replace(/(\d{3})(\d+)/, "$1 $2");
    if (raw.length <= 11) return raw.replace(/(\d{3})(\d{4})(\d+)/, "$1 $2 $3");

    return raw.replace(/(\d{3})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
  };

  const validarCNS = (cns) => {
    const somenteNumeros = cns.replace(/\D/g, "");
    return somenteNumeros.length === 15;
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 0 : -50}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <LinearGradient
              colors={['#0b4786ff', '#001c42ff']}
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
                placeholderTextColor= "#999"
                keyboardType="numeric"
                maxLength={14}
                style={styles.input}
                value={cpf}
                onChangeText={(text) => setCpf(formatarCPF(text))}

                onBlur={() => {
                  if (!validarCPF(cpf)) {
                    Alert.alert("Erro", "O CPF deve conter 11 dígitos.");
                    return;
                  }
                }}
              />

              <Text style={styles.label}>CNS*</Text>
              <TextInput
                placeholder="Digite seu CNS"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={19} //isso dos espaços
                style={styles.input}
                value={cns}
                onChangeText={(text) => setCns(formatarCNS(text))}

                onBlur={() => {
                  if (!validarCNS(cns)) {
                    Alert.alert("Erro", "O CNS deve conter 15 dígitos.");
                    setCns(""); 
                  }
                }}
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
    height: height * 0.18,
    maxHeight: 150,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomLeftRadius: width * 0.10,
    borderBottomRightRadius: width * 0.10,
    paddingHorizontal: width * 0.06,
  },
  
  cabecalho2: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: width * 0.15,
    height: width * 0.15,
    tintColor: '#fff',
    marginRight: width * 0.04,
    marginLeft: width * 0.04,
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },

  titulo: {
    fontSize: Math.min(width * 0.07, 35),
    fontWeight: 'bold',
    color: '#fff',
  },

  loginTitulo: {
    marginTop: height * 0.02,
    fontSize: Math.min(width * 0.055, 28),
    fontWeight: 'bold',
    color: '#192f3fff',
    textAlign: 'center',
  },

  containerCadastro: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: width * 0.05,
    marginTop: height * 0.01,
  },

  label: {
    fontSize: Math.min(width * 0.035, 18),
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
  },

  input: {
    backgroundColor: '#e9ecee',
    borderRadius: width * 0.05,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333',
  },

  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecee',
    borderRadius: width * 0.05,
    marginBottom: 15,
    height: 50,
  },

  botao: {
    backgroundColor: '#00245aff',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
    height: 50,
  },

  btnTexto: {
    color: '#ffffff',
    fontSize: Math.min(width * 0.04, 20),
    fontWeight: 'bold',
    marginTop: height * 0.004
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
    fontSize: Math.min(width * 0.035, 18),
  },
});

export default CadastroScreen;