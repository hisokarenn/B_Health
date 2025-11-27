import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, Text, StyleSheet, FlatList, ActivityIndicator, Button, 
    RefreshControl, Platform, // Importante: Importar RefreshControl
    Dimensions
} from 'react-native';
import { getHistorico } from '../../services/authService';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoricoItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View style={styles.headerItem}>
            <Text style={styles.vacinaNome}>{item.nome_vacina}</Text>
            <Text style={styles.doseBadge}>{item.dose}ª Dose</Text>
        </View>
        
        <Text style={styles.dataText}>Aplicado em: {item.data_aplicacao}</Text>
        
        <View style={styles.detalhesContainer}>
            <Text style={styles.detalheText}>Local: {item.nome_unidade || item.unidade_saude}</Text>
            {item.profissional_responsavel && (
                <Text style={styles.detalheText}>Prof: {item.profissional_responsavel}</Text>
            )}
            {item.lote && (
                <Text style={styles.detalheText}>Lote: {item.lote}</Text>
            )}
        </View>
    </View>
);

const {width, height} = Dimensions.get("window");

const HistoricoScreen = ({ pacienteId, setScreen }) => {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); // Estado para o "Puxar para atualizar"
    const [message, setMessage] = useState('Buscando histórico...');

    // Função de busca extraída para ser reutilizável
    const fetchHistorico = useCallback(async () => {
        try {
            const response = await getHistorico(pacienteId);

            if (response.data.historico && response.data.historico.length > 0) {
                setHistorico(response.data.historico);
                setMessage('');
            } else {
                setHistorico([]); // Limpa se não tiver nada
                setMessage('Não há registros de vacina disponíveis.');
            }
        } catch (error) {
            setMessage('Erro ao carregar o histórico.');
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false); // Para o ícone de refresh
        }
    }, [pacienteId]);

    // Carrega na montagem do componente
    useEffect(() => {
        fetchHistorico();
    }, [fetchHistorico]);

    // Função chamada ao puxar a lista
    const onRefresh = () => {
        setRefreshing(true);
        fetchHistorico();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.messageText}>{message}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView styles={style.safe}>
        <View style={styles.historicoContainer}>
            <Text style={styles.historicoTitle}>Minha Caderneta (RF03)</Text>
            
            {/* Se a lista estiver vazia, mostramos a mensagem dentro de um ScrollView 
                para permitir o "Pull to Refresh" mesmo na tela vazia.
            */}
            {historico.length === 0 ? (
                <FlatList
                    data={[]} 
                    renderItem={null}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.messageText}>{message}</Text>
                            <Button title="Voltar ao Menu" onPress={() => setScreen('menu')} />
                            <Text style={styles.hintText}>(Puxe para baixo para atualizar)</Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <FlatList
                    data={historico}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <HistoricoItem item={item} />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    // Adiciona o controle de atualização
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}

            {historico.length > 0 && (
                <View style={styles.buttonSpacing}>
                    <Button title="Voltar ao Menu Principal" onPress={() => setScreen('menu')} />
                </View>
            )}
        </View>
    </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    safe: { 
        flex: 1, 
        backgroundColor: "#fff" 
    },

    header: {
        paddingTop: Platform.OS === "android" ? height * 0.04 : height * 0.03,
        paddingBottom: height * 0.03,
        paddingHorizontal: width * 0.05,
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
    },

    headerTitle: {
        color: "#fff",
        fontSize: width * 0.055,
        fontWeight: "bold",
        marginLeft: width * 0.07,
    },

    historicoContainer: {
        flex: 1,
        padding: width * 0.05,
        backgroundColor: '#fff',
    },

    historicoTitle: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: height * 0.02,
    },

    cardAviso: {
        display: 'flex',
        backgroundColor: "#fde7c8",
        borderRadius: width * 0.07,
        flexDirection: 'row',
        padding: width * 0.05,
        marginBottom: height * 0.03,
        alignContent: 'space-between',
    },

    avisoTitulo: {
        fontWeight: 'bold',
        fontSize: width * 0.033,
        marginBottom: height * 0.003,
        color: "#333",
    },

    avisoTexto: {
        fontSize: width * 0.033,
        color: "#555",
    },

    itemContainer: {
        padding: width * 0.05,
        marginBottom: height * 0.02,
        borderRadius: width * 0.09,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    vacinaNome: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#333',
        flex: 1, 
    },
    doseBadge: {
        backgroundColor: '#e3f2fd',
        color: '#007AFF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    dataText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        fontWeight: '500',
    },
    detalhesContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    detalheText: { 
        fontSize: 12, 
        color: '#777', 
        marginBottom: 2 
    },
    messageText: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#666' },
    hintText: { fontSize: 12, marginTop: 20, color: '#999', fontStyle: 'italic' },
    buttonSpacing: { marginTop: 10 },
});

export default HistoricoScreen;