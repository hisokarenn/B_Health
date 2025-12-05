import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, 
    Dimensions, Alert, StatusBar, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getPerfil } from '../../services/authService'; 

const { width, height } = Dimensions.get("window");

const PerfilScreen = ({ setScreen, pacienteInfo }) => {

    const [perfilCompleto, setPerfilCompleto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDadosDoServidor = async () => {
            if (pacienteInfo?.uid) {
                try {
                    const response = await getPerfil(pacienteInfo.uid);
                    setPerfilCompleto(response.data);
                } catch (error) {
                    console.error("Erro ao atualizar perfil:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        carregarDadosDoServidor();
    }, [pacienteInfo]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <ActivityIndicator size="large" color="#1d4886ff" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

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
    const dadosBackend = perfilCompleto || {};
    
    const user = {
        nome: dadosBackend.nome || pacienteInfo?.displayName || pacienteInfo?.nome || "Usuário",
        email: dadosBackend.email || pacienteInfo?.email || "Email não disponível",
        cpf: dadosBackend.cpf || "Não cadastrado",
        cns: dadosBackend.cns || "Não cadastrado",
        createdAt: pacienteInfo?.metadata?.creationTime || new Date().toISOString()
    };

    const InfoItem = ({ icon, label, value, isCopyable = false }) => (
        <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={width * 0.055} color={"#1d4886ff"} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
            {isCopyable && (
                <TouchableOpacity>
                    <Ionicons name="copy-outline" size={width * 0.045} color={"#718096"} />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={"#052858ff"} />
            
            <ScrollView 
                contentContainerStyle={{ paddingBottom: height * 0.12 }} 
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/*cabecalho*/}
                <LinearGradient
                    colors={["rgba(4, 29, 54, 1)", "rgba(13, 48, 82, 0.89)", "rgba(32, 79, 126, 0.81)", "rgba(83, 142, 201, 0.76)","rgba(235, 245, 255, 0.14)"]}
                    style={[styles.cabecalho, { paddingBottom: height * 0.05 }]}
                >
                    <SafeAreaView edges={['top']}>
                        <View style={styles.cabecalhoContent}>
                            <Text style={[styles.cabecalhoTitulo, { fontSize: width * 0.05 } ]}>Meu Perfil</Text>
                            
                            <View style={[styles.avatarContainer, { width: width * 0.26, height: width * 0.26, borderRadius: width * 0.13 }]}>
                                <Text style={[styles.avatarTexto, { fontSize: width * 0.12 }]}>{getInitials(user.nome)}</Text>
                            </View>
                            
                            <Text style={[styles.userNome, { fontSize: width * 0.065 }]}>{user.nome}</Text>
                            <Text style={[styles.userEmail, { fontSize: width * 0.04 }]}>{user.email}</Text>
                            <Text style={[styles.tempoDeUso, { fontSize: width * 0.032 }]}>Membro desde {user.createdAt ? formatDate(user.createdAt) : "-"}</Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                {/*informações*/}
                <View style={styles.body}>
                    
                    <Text style={[styles.secaoTitulo, { fontSize: width * 0.045 }]}>Documentação Pessoal</Text>
                    <View style={styles.divisor} />
                    <View style={[styles.card, { padding: width * 0.02 }]}>
                        <InfoItem 
                            icon="card-outline" 
                            label="CPF" 
                            value={user.cpf} 
                        />
                        <View style={[styles.divisor2, { marginLeft: width * 0.18 }]} />
                        <InfoItem 
                            icon="medical-outline" 
                            label="Cartão Nacional de Saúde (CNS)" 
                            value={user.cns} 
                        />
                    </View>

                    <Text style={[styles.secaoTitulo, { fontSize: width * 0.045 }]}>Dados da Conta</Text>
                    <View style={styles.divisor} />
                    <View style={[styles.card, { padding: width * 0.02 }]}>
                        <InfoItem 
                            icon="mail-outline" 
                            label="E-mail Cadastrado" 
                            value={user.email} 
                        />
                        <View style={[styles.divisor2, { marginLeft: width * 0.18 }]} />
                        <InfoItem 
                            icon="shield-checkmark-outline" 
                            label="Status da Conta" 
                            value="Ativa / Verificada" 
                        />
                    </View>

                    {/*sair*/}
                    <TouchableOpacity 
                        style={[
                            styles.sairBtn, 
                            { paddingVertical: height * 0.017, borderRadius: width * 0.07 }
                        ]} 
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={width * 0.06} color={"#E53E3E"} />
                        <Text style={[styles.sairTexto, { fontSize: width * 0.045 }]}>Sair da Conta</Text>
                    </TouchableOpacity>

                    <Text style={[styles.versaoTexto, { fontSize: width * 0.032 }]}>B Health App v1.0.2</Text>
                </View>
            </ScrollView>

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
    
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 15,
        color: '#666',
        fontSize: 16,
    },

    cabecalho: {
        alignItems: 'center',
    },

    cabecalhoContent: {
        alignItems: 'center',
        paddingTop: 10,
    },

    cabecalhoTitulo: {
        color: '#fff',
        fontWeight: '600',
        marginBottom: 20,
    },

    avatarContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 15,
    },

    avatarTexto: {
        color: 'white',
        fontWeight: 'bold',
    },

    userNome: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },

    userEmail: {
        color: 'rgba(255, 255, 255, 1)',
        marginBottom: 5,
        fontWeight: 'bold'
    },

    tempoDeUso: {
        color: 'rgba(255, 255, 255, 1)',
        fontStyle: 'italic',
        fontWeight: 'bold'
    },

    body: {
        paddingHorizontal: 20,
        marginTop: -20,
    },

    secaoTitulo: {
        fontWeight: '700',
        color: "#718096",
        marginTop: 35,
        marginLeft: 5,
        marginBottom: 15,
        letterSpacing: 0.5,
    },

    card: {
        backgroundColor: "#FFFFFF",
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
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        width: 45,
        height: 45,
        borderRadius: 12,
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
        marginRight: 20,
    },

    sairBtn: {
        marginTop: 20,
        backgroundColor: '#FFF5F5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FED7D7',
    },

    sairTexto: {
        color: "#E53E3E",
        fontWeight: 'bold',
        marginLeft: 10,
    },

    versaoTexto: {
        textAlign: 'center',
        color: "#718096",
        marginTop: 10,
        opacity: 0.6
    }
});

export default PerfilScreen;
