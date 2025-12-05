import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, ActivityIndicator, Button,
    RefreshControl, TouchableOpacity, Platform, Dimensions
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getHistorico } from '../../services/authService';

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
                <Text style={styles.detalheText}>Profissional: {item.profissional_responsavel}</Text>
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
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState('Buscando histórico...');

    const avisoCard = (
    <View style={styles.cardAviso}>
        <Ionicons
        name="information-circle-outline"
        size={17}
        color="#302569ff"
        style={{ marginRight: width * 0.03 }}
        />
        <View>
        <Text style={styles.avisoTitulo}>Mantenha sua carteira sempre atualizada</Text>
        <Text style={styles.avisoTexto}>
            Mantenha seu histórico de vacinação completo!{"\n"}Visite a UBS e atualize suas vacinas.
        </Text>
        </View>
    </View>
    );

    const fetchHistorico = useCallback(async () => {
        try {
            const response = await getHistorico(pacienteId);

            if (response.data.historico?.length > 0) {
                setHistorico(response.data.historico);
                setMessage('');
            } else {
                setHistorico([]);
                setMessage('Não há registros de vacina disponíveis.');
            }
        } catch (error) {
            setMessage('Erro ao carregar o histórico.');
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
                <ActivityIndicator size="large" color="#103d6dff" />
                <Text style={styles.messageText}>{message}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                
                {/*cabeçalho*/}
                <LinearGradient 
                    colors={["#0b4786ff", "#001c42ff"]}
                    style={styles.header}>

                    <TouchableOpacity onPress={() => setScreen('menu')}>
                        <Ionicons name="arrow-back" size={26} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>B Health</Text>
                    <View style={{ width: 20 }} />
                </LinearGradient>

                <View style={styles.historicoContainer}>

                    <Text style={styles.historicoTitle}>Minhas Vacinas</Text>
                    
                    {/*lista*/}
                    {historico.length === 0 ? (
                        <FlatList
                            data={[]}
                            renderItem={null}
                            ListHeaderComponent={avisoCard}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.messageText}>{message}</Text>
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
                            ListHeaderComponent={avisoCard}
                            contentContainerStyle={{ paddingBottom: 75 }}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { 
        flex: 1, 
        backgroundColor: "#08366171"
    },

    header: {
        paddingTop: Platform.OS === "android" ? height * 0.02 : height * 0,
        paddingBottom: height * 0.02,
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
        backgroundColor: "#fde7c8",
        borderRadius: width * 0.07,
        flexDirection: 'row',
        padding: width * 0.05,
        marginBottom: height * 0.03,
    },

    avisoTitulo: {
        fontWeight: 'bold',
        fontSize: width * 0.04,
        marginBottom: height * 0.003,
        color: "#333",
    },

    avisoTexto: {
        fontSize: width * 0.035,
        color: "#555",
    },

    itemContainer: {
        padding: width * 0.05,
        marginBottom: height * 0.02,
        borderRadius: width * 0.09,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        elevation: 1,
    },

    headerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    vacinaNome: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: width * 0.03,
    },

    doseBadge: {
        backgroundColor: '#e3f2fd',
        color: '#034a95ff',
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.004,
        borderRadius: width * 0.03,
        fontSize: width * 0.03,
        fontWeight: 'bold',
    },

    dataText: {
        fontSize: width * 0.035,
        marginTop: height * 0.008,
        color: '#555',
        marginLeft: width * 0.03,
    },

    detalhesContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: height * 0.015,
        paddingTop: height * 0.01,
    },

    detalheText: {
        fontSize: width * 0.032,
        color: '#777',
        marginLeft: width * 0.03,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    emptyContainer: {
        alignItems: 'center',
        marginTop: height * 0.12,
    },

    messageText: {
        marginTop: 15, 
        color: "#718096", 
        fontSize: width * 0.045,
    },
});

export default HistoricoScreen;