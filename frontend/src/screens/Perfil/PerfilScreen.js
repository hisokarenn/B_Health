import React from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ScrollView, 
    Dimensions, Alert, StatusBar, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../../components/BarraNavegacao'; // Importando a barra

// --- SISTEMA DE CORES (O mesmo das outras telas) ---
const COLORS = {
    primary: "#0056D2",
    primaryDark: "#003580",
    background: "#F8F9FA",
    card: "#FFFFFF",
    textDark: "#1A202C",
    textGrey: "#718096",
    divider: "#E2E8F0",
    danger: "#E53E3E"
};

const { width } = Dimensions.get("window");

const PerfilScreen = ({ setScreen, pacienteInfo }) => {

    // Função para pegar as iniciais do nome (ex: "Karen Vitória" -> "KV")
    const getInitials = (name) => {
        if (!name) return "P";
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    // Função para formatar a data (2025-11-25... -> 25/11/2025)
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
        nome: "Paciente",
        email: "email@exemplo.com",
        cpf: "000.000.000-00",
        cns: "000 0000 0000 0000",
        createdAt: new Date().toISOString()
    };

    // Componente auxiliar para Linha de Dados
    const InfoItem = ({ icon, label, value, isCopyable = false }) => (
        <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
            {isCopyable && (
                <TouchableOpacity>
                    <Ionicons name="copy-outline" size={18} color={COLORS.textGrey} />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
            
            <ScrollView 
                contentContainerStyle={{ paddingBottom: 100 }} 
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* --- HEADER COM AVATAR --- */}
                <LinearGradient
                    colors={[COLORS.primaryDark, COLORS.primary]}
                    style={styles.header}
                >
                    <SafeAreaView edges={['top']}>
                        <View style={styles.headerContent}>
                            <Text style={styles.headerTitle}>Meu Perfil</Text>
                            
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarText}>{getInitials(user.nome)}</Text>
                            </View>
                            
                            <Text style={styles.userName}>{user.nome}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                            <Text style={styles.userSince}>Membro desde {formatDate(user.createdAt)}</Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                {/* --- CONTEÚDO BRANCO (BODY) --- */}
                <View style={styles.body}>
                    
                    {/* Seção de Documentos */}
                    <Text style={styles.sectionTitle}>Documentação Pessoal</Text>
                    <View style={styles.card}>
                        <InfoItem 
                            icon="card-outline" 
                            label="CPF" 
                            value={user.cpf} 
                        />
                        <View style={styles.divider} />
                        <InfoItem 
                            icon="medical-outline" 
                            label="Cartão Nacional de Saúde (CNS)" 
                            value={user.cns} 
                        />
                    </View>

                    {/* Seção de Conta */}
                    <Text style={styles.sectionTitle}>Dados da Conta</Text>
                    <View style={styles.card}>
                        <InfoItem 
                            icon="mail-outline" 
                            label="E-mail Cadastrado" 
                            value={user.email} 
                        />
                        <View style={styles.divider} />
                        <InfoItem 
                            icon="shield-checkmark-outline" 
                            label="Status da Conta" 
                            value="Ativa / Verificada" 
                        />
                    </View>

                    {/* Botão de Logout */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
                        <Text style={styles.logoutText}>Sair da Conta</Text>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>B Health App v1.0.2</Text>
                </View>
            </ScrollView>

            {/* Barra de Navegação Inferior */}
            <BottomNav active="perfil" setScreen={setScreen} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    
    // Header Styles
    header: {
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
    },
    headerContent: {
        alignItems: 'center',
        paddingTop: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)', // Branco translúcido
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 15,
    },
    avatarText: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
    },
    userName: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    userEmail: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 5,
    },
    userSince: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontStyle: 'italic',
    },

    // Body Styles
    body: {
        paddingHorizontal: 20,
        marginTop: -20, // Sobrepõe levemente o header
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textGrey,
        marginTop: 25,
        marginBottom: 10,
        marginLeft: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 5, // Padding interno pequeno, padding nos itens é maior
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    
    // Info Item Styles
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: '#E3F2FD', // Azul bem claro
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: COLORS.textGrey,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: COLORS.textDark,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginLeft: 76, // Alinha com o texto, pulando o ícone
        marginRight: 20,
    },

    // Logout Button
    logoutButton: {
        marginTop: 30,
        backgroundColor: '#FFF5F5', // Fundo vermelho muito claro
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FED7D7',
    },
    logoutText: {
        color: COLORS.danger,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.textGrey,
        fontSize: 12,
        marginTop: 20,
        opacity: 0.6
    }
});

export default PerfilScreen;