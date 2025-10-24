// frontend/src/screens/Login/LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { realizarLogin } from '../../services/authService';

// MODIFICAÇÃO: onLoginSuccess adicionado como prop
const LoginScreen = ({ setScreen, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'E-mail e Senha são obrigatórios para o Login.');
      return;
    }

    setLoading(true);
    try {
      const response = await realizarLogin({ email, senha });

      // CÓDIGO ANTERIOR: Alert.alert('Sucesso!', `Bem-vindo(a), ${response.data.usuario.nome}!`);
      
      // MODIFICAÇÃO: Chamada para a função de sucesso que está no App.js
      onLoginSuccess(response.data.usuario); 
      
      setEmail('');
      setSenha('');
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro de rede ou servidor.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acessar Conta (RF02)</Text>
      
      <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry={true} value={senha} onChangeText={setSenha} />
      
      <Button title={loading ? "Entrando..." : "Acessar"} onPress={handleLogin} disabled={loading} />

      <TouchableOpacity style={styles.switchButton} onPress={() => setScreen('cadastro')}>
        <Text style={styles.switchButtonText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};



// ... (Estilos) ...
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 30, },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#007AFF', },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#f9f9f9', },
    switchButton: { marginTop: 20, alignItems: 'center', },
    switchButtonText: { color: '#007AFF', fontSize: 14, }
});

export default LoginScreen;