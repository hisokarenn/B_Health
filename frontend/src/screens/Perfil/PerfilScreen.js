import React, { useCallback, useEffect, useState } from 'react';
import { fonte } from '../../utilitarios/responsivo';

import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, 
    Dimensions, Alert, StatusBar, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getPerfil } from '../../services/authService'; 
import { obterMensagemFalhaTemporaria } from '../../utilitarios/Erros';

const { width, height } = Dimensions.get("window");

const PerfilScreen = ({ setScreen, pacienteInfo }) => {

    const [perfilCompleto, setPerfilCompleto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erroPerfil, setErroPerfil] = useState('');

    const carregarDadosDoServidor = useCallback(async () => {
        setLoading(true);

        if (!pacienteInfo?.uid) {
            setErroPerfil('Faça login novamente para carregar seu perfil.');
            setLoading(false);
            return;
        }

        try {
            setErroPerfil('');
            const response = await getPerfil(pacienteInfo.uid);
            setPerfilCompleto(response.data);
        } catch (error) {
            setErroPerfil(obterMensagemFalhaTemporaria(
                error,
                'Não foi possível carregar seu perfil. Tente novamente.'
            ));
            console.error("Erro ao atualizar perfil:", error);
        } finally {
            setLoading(false);
        }
    }, [pacienteInfo?.uid]);

    useEffect(() => {
        carregarDadosDoServidor();
    }, [carregarDadosDoServidor]);

    if (loading) {
        return (
            <View testID="perfil-loading" accessibilityLabel="perfil-loading" style={styles.loadingContainer}>
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
                <Ionicons name={icon} size={fonte(21)} color={"#1d4886ff"} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
            {isCopyable && (
                <TouchableOpacity>
                    <Ionicons name="copy-outline" size={fonte(17)} color={"#718096"} />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safe} testID="tela-perfil" accessibilityLabel="tela-perfil">
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={"#052858ff"} />
            
            <ScrollView
                testID="perfil-scroll"
                accessibilityLabel="perfil-scroll" 
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
                            <Text testID="perfil-titulo" accessibilityLabel="perfil-titulo" style={[styles.cabecalhoTitulo, { fontSize: fonte(19) } ]}>Meu Perfil</Text>
                            
                            <View style={[styles.avatarContainer, { width: width * 0.26, height: width * 0.26, borderRadius: width * 0.13 }]}>
                                <Text style={[styles.avatarTexto, { fontSize: fonte(45) }]}>{getInitials(user.nome)}</Text>
                            </View>
                            
                            <Text testID="perfil-nome" accessibilityLabel="perfil-nome" style={[styles.userNome, { fontSize: fonte(24) }]}>{user.nome}</Text>
                            <Text testID="perfil-email" accessibilityLabel="perfil-email"style={[styles.userEmail, { fontSize: fonte(15) }]}>{user.email}</Text>
                            <Text style={[styles.tempoDeUso, { fontSize: fonte(12) }]}>Membro desde {user.createdAt ? formatDate(user.createdAt) : "-"}</Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                {/*informações*/}
                <View style={styles.body}>
                    {erroPerfil ? (
                        <View testID="perfil-erro" accessibilityLabel="perfil-erro" style={styles.erroCard}>
                            <Ionicons name="alert-circle-outline" size={fonte(21)} color="#B42318" />
                            <View style={styles.erroConteudo}>
                                <Text style={styles.erroTexto}>{erroPerfil}</Text>
                                <TouchableOpacity
                                    testID="perfil-botao-recarregar"
                                    accessibilityLabel="perfil-botao-recarregar"
                                    style={styles.erroBotao}
                                    onPress={carregarDadosDoServidor}
                                    disabled={loading}
                                >
                                    <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
                                    <Text style={styles.erroBotaoTexto}>Tentar novamente</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null}
                    
                    <Text style={[styles.secaoTitulo, { fontSize: fonte(17) }]}>Documentação Pessoal</Text>
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

                    <Text style={[styles.secaoTitulo, { fontSize: fonte(17) }]}>Dados da Conta</Text>
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
                        testID="perfil-botao-sair"
                        accessibilityLabel="perfil-botao-sair" 
                        style={[
                            styles.sairBtn, 
                            { paddingVertical: height * 0.017, borderRadius: width * 0.07 }
                        ]} 
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={fonte(23)} color={"#E53E3E"} />
                        <Text style={[styles.sairTexto, { fontSize: fonte(17) }]}>Sair da Conta</Text>
                    </TouchableOpacity>

                    <Text style={[styles.versaoTexto, { fontSize: fonte(12) }]}>B Health App v1.0.2</Text>
                </View>
            </ScrollView>

        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#08366171"
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

    erroCard: {
        marginTop: 20,
        padding: 14,
        borderRadius: 12,
        backgroundColor: '#FFF4ED',
        borderWidth: 1,
        borderColor: '#FECDCA',
        flexDirection: 'row',
        alignItems: 'center',
    },

    erroTexto: {
        color: '#B42318',
        fontSize: 14,
        fontWeight: '600',
    },

    erroConteudo: {
        flex: 1,
        marginLeft: 10,
    },

    erroBotao: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#B42318',
        borderRadius: 18,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },

    erroBotaoTexto: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
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
