import React from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, 
    Dimensions, Alert, StatusBar, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../../components/BarraNavegacao';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get("window");

const PerfilScreen = ({ setScreen, pacienteInfo }) => {

    const [loading, setLoading] = useState(false);

    if (loading && !pacienteInfo) {
        return (
            <SafeAreaView style={styles.safe}>
                <Text style={{ color: 'white', textAlign: 'center', marginTop: 50 }}>Carregando...</Text>
            </SafeAreaView>
        );
    }

    // Função para pegar as iniciais do nome
    const getInitials = (name) => {
        if (!name) return "P";
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Data desconhecida";
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const handleLogout = () => {
        Alert.alert(
            "Desconectar",
            "Deseja realmente sair da sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", style: "destructive", onPress: () => setScreen("login") }
            ]
        );
    };

    // Dados de fallback para evitar erro se pacienteInfo vier vazio
    const user = pacienteInfo || {
        nome: "Não informado",
        email: "Não informado",
        cpf: "Não informado",
        cns: "Não informado",
        createdAt: new Date().toISOString()
    };

    // Componente auxiliar para Linha de Dados
    const InfoItem = ({ icon, label, value, isCopyable = false }) => (
        <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={22} color={"#1d4886ff"} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
            {isCopyable && (
                <TouchableOpacity>
                    <Ionicons name="copy-outline" size={18} color={"#718096"} />
                </TouchableOpacity>
            )}
        </View>
    );

    console.log("pacienteInfo:", pacienteInfo);
    console.log("user do AsyncStorage:", user);


    return (
        <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={"#052858ff"} />
            
            <ScrollView 
                contentContainerStyle={{ paddingBottom: 100 }} 
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/*cabecalho*/}
                <LinearGradient
                    colors={["rgba(4, 29, 54, 1)", "rgba(13, 48, 82, 0.89)", "rgba(32, 79, 126, 0.81)", "rgba(83, 142, 201, 0.76)","rgba(235, 245, 255, 0.14)"]}
                    style={styles.cabecalho}
                >
                    <SafeAreaView edges={['top']}>
                        <View style={styles.cabecalhoContent}>
                            <Text style={styles.cabecalhoTitulo}>Meu Perfil</Text>
                            
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarTexto}>{getInitials(user.nome)}</Text>
                            </View>
                            
                            <Text style={styles.userNome}>{user.nome}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                            <Text style={styles.tempoDeUso}>Membro desde {formatDate(user.createdAt)}</Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                {/*informações*/}
                <View style={styles.body}>
                    
                    <Text style={styles.secaoTitulo}>Documentação Pessoal</Text>
                    <View style={styles.divisor} />
                    <View style={styles.card}>
                        <InfoItem 
                            icon="card-outline" 
                            label="CPF" 
                            value={user.cpf} 
                        />
                        <View style={styles.divisor2} />
                        <InfoItem 
                            icon="medical-outline" 
                            label="Cartão Nacional de Saúde (CNS)" 
                            value={user.cns} 
                        />
                    </View>

                    <Text style={styles.secaoTitulo}>Dados da Conta</Text>
                    <View style={styles.divisor} />
                    <View style={styles.card}>
                        <InfoItem 
                            icon="mail-outline" 
                            label="E-mail Cadastrado" 
                            value={user.email} 
                        />
                        <View style={styles.divisor2} />
                        <InfoItem 
                            icon="shield-checkmark-outline" 
                            label="Status da Conta" 
                            value="Ativa / Verificada" 
                        />
                    </View>

                    {/*sair*/}
                    <TouchableOpacity style={styles.sairBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={22} color={"#E53E3E"} />
                        <Text style={styles.sairTexto}>Sair da Conta</Text>
                    </TouchableOpacity>

                    <Text style={styles.versaoTexto}>B Health App v1.0.2</Text>
                </View>
            </ScrollView>

            {/*barra de navegação*/}
            <BottomNav active="perfil" setScreen={setScreen} />
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#081d35ff"
    },

    container: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 1)",
    },
    
    cabecalho: {
        paddingBottom: 40,
        alignItems: 'center',
    },

    cabecalhoContent: {
        alignItems: 'center',
        paddingTop: 10,
    },

    cabecalhoTitulo: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },

    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 15,
    },

    avatarTexto: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
    },

    userNome: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },

    userEmail: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold'
    },

    tempoDeUso: {
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 12,
        fontStyle: 'italic',
        fontWeight: 'bold'
    },

    body: {
        paddingHorizontal: 20,
        marginTop: -20,
    },

    secaoTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: "#718096",
        marginTop: 35,
        marginLeft: 5,
        marginBottom: 15,
        letterSpacing: 0.5,
    },

    card: {
        backgroundColor: "#FFFFFF",
        padding: 5,
    },

    divisor: { 
        height: 1, 
        backgroundColor: '#a5a8bdb4', 
        borderRadius: 10, 
    },
    
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },

    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    infoContent: {
        flex: 1,
    },

    infoLabel: {
        fontSize: 14,
        color: "#113160c2",
        marginBottom: 2,
        fontWeight: '600'
    },

    infoValue: {
        fontSize: 14,
        color: "#141e34a5",
    },

    divisor2: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginLeft: 76,
        marginRight: 20,
    },

    // Logout Button
    sairBtn: {
        marginTop: 20,
        backgroundColor: '#FFF5F5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 13,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#FED7D7',
    },

    sairTexto: {
        color: "#E53E3E",
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },

    versaoTexto: {
        textAlign: 'center',
        color: "#718096",
        fontSize: 12,
        marginTop: 10,
        opacity: 0.6
    }
});

export default PerfilScreen;