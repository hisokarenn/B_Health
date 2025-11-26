import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, Text, StyleSheet, FlatList, ActivityIndicator, Button, 
    RefreshControl
} from 'react-native';
import { getHistorico } from '../../services/authService'; // <--- Usando o AuthService com Axios

const HistoricoItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View style={styles.headerItem}>
            <Text style={styles.vacinaNome}>{item.nome_vacina || item.vacina || "Vacina"}</Text>
            <Text style={styles.doseBadge}>{item.dose || "1"}ª Dose</Text>
        </View>
        
        <Text style={styles.dataText}>Aplicado em: {item.data_aplicacao || "Data não informada"}</Text>
        
        <View style={styles.detalhesContainer}>
            <Text style={styles.detalheText}>Local: {item.nome_unidade || item.unidade_saude || "Unidade de Saúde"}</Text>
            {item.profissional_responsavel && (
                <Text style={styles.detalheText}>Prof: {item.profissional_responsavel}</Text>
            )}
            {item.lote && (
                <Text style={styles.detalheText}>Lote: {item.lote}</Text>
            )}
        </View>
    </View>
);

const HistoricoScreen = ({ pacienteId, setScreen }) => {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false); 
    const [message, setMessage] = useState('Buscando histórico...');

    const fetchHistorico = useCallback(async () => {
        if (!pacienteId) {
            setMessage('Erro: ID do paciente não identificado.');
            setLoading(false);
            return;
        }

        try {
            console.log(`Buscando histórico via Axios para: ${pacienteId}`);
            
            // CHAMADA VIA AXIOS (AuthService)
            const response = await getHistorico(pacienteId);
            
            // Ajuste conforme o retorno do seu backend (ex: response.data.historico ou response.data)
            const lista = response.data.historico || response.data || [];

            if (lista.length > 0) {
                setHistorico(lista);
                setMessage('');
            } else {
                setHistorico([]); 
                setMessage('Sua caderneta de vacinação está vazia no momento.');
            }
        } catch (error) {
            console.error("Erro Axios (Histórico):", error);
            setMessage('Não foi possível conectar ao servidor de histórico.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [pacienteId]);

    useEffect(() => {
        fetchHistorico();
    }, [fetchHistorico]);

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
        <View style={styles.historicoContainer}>
            <Text style={styles.historicoTitle}>Minha Caderneta (RF03)</Text>
            
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
                    keyExtractor={(item, index) => (item.id || index).toString()}
                    renderItem={({ item }) => <HistoricoItem item={item} />}
                    contentContainerStyle={{ paddingBottom: 20 }}
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
    );
};

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyContainer: { alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
    historicoContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
    historicoTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#007AFF', textAlign: 'center' },
    
    itemContainer: { 
        padding: 15, 
        marginBottom: 15, 
        borderRadius: 10, 
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
        marginRight: 10
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