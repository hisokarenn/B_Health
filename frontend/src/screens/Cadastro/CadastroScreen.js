// frontend/src/screens/Cadastro/CadastroScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { cadastrarPaciente } from '../../services/authService';

const CadastroScreen = ({ setScreen }) => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [cns, setCns] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    
    const handleCadastro = async () => {
        if (!nome || !cpf || !cns || !email || !senha) {
            Alert.alert('Erro', 'Nome, CPF, CNS, E-mail e Senha são campos obrigatórios para o cadastro.');
            return;
        }

        try {
            const response = await cadastrarPaciente({ nome, cpf, cns, email, senha });

            Alert.alert('Sucesso B Health!', `Cadastro do paciente ${response.data.paciente.nome} realizado com sucesso!`);
            
            // Limpa o formulário e redireciona para Login
            setNome(''); setCpf(''); setCns(''); setEmail(''); setSenha('');
            setScreen('login');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Não foi possível se conectar com a API ou erro de rede.';
            Alert.alert('Erro no Cadastro', errorMessage);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Novo Cadastro (RF01)</Text>
                
                <TextInput style={styles.input} placeholder="Nome Completo *" value={nome} onChangeText={setNome} />
                <TextInput style={styles.input} placeholder="CPF *" keyboardType="numeric" value={cpf} onChangeText={setCpf} maxLength={14} />
                <TextInput style={styles.input} placeholder="CNS *" keyboardType="numeric" value={cns} onChangeText={setCns} />
                <TextInput style={styles.input} placeholder="E-mail *" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Senha *" secureTextEntry={true} value={senha} onChangeText={setSenha} />
                
                <Button title="Cadastrar Paciente" onPress={handleCadastro} />
                
                <TouchableOpacity style={styles.switchButton} onPress={() => setScreen('login')}>
                    <Text style={styles.switchButtonText}>Já tenho conta. Fazer login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// ** ATENÇÃO: Estilos movidos para o final deste arquivo por simplicidade **
const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 30, },
    container: { flex: 1, justifyContent: 'center', },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#007AFF', },
    input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#f9f9f9', },
    switchButton: { marginTop: 20, alignItems: 'center', },
    switchButtonText: { color: '#007AFF', fontSize: 14, }
});

export default CadastroScreen;