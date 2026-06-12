import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, ActivityIndicator,
    RefreshControl, TouchableOpacity, Platform, Dimensions
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getHistorico } from '../../services/authService';
import { obterMensagemFalhaTemporaria } from '../../utilitarios/Erros';

const FALLBACK_CAMPO = 'Não informado';

const normalizarTexto = (valor) => {
    const texto = String(valor || '').trim();
    return texto || FALLBACK_CAMPO;
};

const obterDataValida = (valor) => {
    if (!valor) return null;

    if (typeof valor.toDate === 'function') {
        return valor.toDate();
    }

    if (valor.seconds !== undefined || valor._seconds !== undefined) {
        return new Date((valor.seconds ?? valor._seconds) * 1000);
    }

    const texto = String(valor).trim();

    if (!texto) return null;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
        const [dia, mes, ano] = texto.split('/').map(Number);
        const dataBr = new Date(ano, mes - 1, dia);

        return dataBr.getFullYear() === ano
            && dataBr.getMonth() === mes - 1
            && dataBr.getDate() === dia
            ? dataBr
            : null;
    }

    const dataIso = /^\d{4}-\d{2}-\d{2}$/.test(texto)
        ? new Date(`${texto}T00:00:00`)
        : new Date(texto);

    return Number.isNaN(dataIso.getTime()) ? null : dataIso;
};

const formatarDataAplicacao = (valor) => {
    const texto = String(valor || '').trim();

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
        return texto;
    }

    const data = obterDataValida(valor);

    if (!data) {
        return texto || FALLBACK_CAMPO;
    }

    return data.toLocaleDateString('pt-BR');
};

const obterTimestampAplicacao = (valor) => {
    const data = obterDataValida(valor);
    return data ? data.getTime() : 0;
};

const formatarDose = (valor) => {
    const texto = String(valor || '').trim();

    if (!texto) return 'Dose não informada';
    if (/^\d+$/.test(texto)) return `${texto}ª Dose`;
    if (/dose/i.test(texto)) return texto;

    return `Dose ${texto}`;
};

const normalizarRegistroHistorico = (registro, index) => {
    const timestampAplicacao = obterTimestampAplicacao(registro?.data_aplicacao);

    return {
        ...registro,
        _key: registro?.id || `historico-${timestampAplicacao}-${index}`,
        _timestampAplicacao: timestampAplicacao,
        nome_vacina: normalizarTexto(registro?.nome_vacina),
        dose: formatarDose(registro?.dose),
        data_aplicacao: formatarDataAplicacao(registro?.data_aplicacao),
        nome_unidade: normalizarTexto(registro?.nome_unidade || registro?.unidade_saude),
        lote: normalizarTexto(registro?.lote),
        profissional_responsavel: normalizarTexto(registro?.profissional_responsavel),
    };
};

const ordenarHistorico = (registros) => (
    registros
        .map(normalizarRegistroHistorico)
        .sort((a, b) => b._timestampAplicacao - a._timestampAplicacao)
);

const HistoricoItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <View style={styles.headerItem}>
            <Text style={styles.vacinaNome}>{item.nome_vacina}</Text>
            <Text style={styles.doseBadge}>{item.dose}</Text>
        </View>

        <Text style={styles.dataText}>Aplicado em: {item.data_aplicacao}</Text>

        <View style={styles.detalhesContainer}>
            <Text style={styles.detalheText}>Local: {item.nome_unidade}</Text>
            <Text style={styles.detalheText}>Profissional: {item.profissional_responsavel}</Text>
            <Text style={styles.detalheText}>Lote: {item.lote}</Text>
        </View>
    </View>
);

const {width, height} = Dimensions.get("window");

const HistoricoScreen = ({ pacienteId, setScreen }) => {
    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState('Buscando histórico...');
    const [estadoLista, setEstadoLista] = useState('carregando');

    const avisoCard = (
    <View style={styles.cardAviso}>
        <Ionicons
        name="information-circle-outline"
        size={17}
        color="#302569ff"
        style={{ marginRight: width * 0.03 }}
        />
        <View style={styles.avisoConteudo}>
        <Text style={styles.avisoTitulo}>Mantenha sua carteira sempre atualizada</Text>
        <Text style={styles.avisoTexto}>
            Mantenha seu histórico de vacinação completo!{"\n"}Visite a UBS e atualize suas vacinas.
        </Text>
        </View>
    </View>
    );

    const renderHistoricoItem = useCallback(({ item }) => (
        <HistoricoItem item={item} />
    ), []);

    const keyExtractor = useCallback((item) => item._key, []);

    const fetchHistorico = useCallback(async () => {
        try {
            const response = await getHistorico(pacienteId);
            const registros = Array.isArray(response.data.historico)
                ? ordenarHistorico(response.data.historico)
                : [];

            if (registros.length > 0) {
                setHistorico(registros);
                setMessage('');
                setEstadoLista('com_registros');
            } else {
                setHistorico([]);
                setMessage('Não há registros de vacina disponíveis.');
                setEstadoLista('vazio');
            }
        } catch (error) {
            setHistorico([]);
            setMessage(obterMensagemFalhaTemporaria(
                error,
                'Não foi possível carregar o histórico. Tente novamente.'
            ));
            setEstadoLista('erro');
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

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons
                name={estadoLista === 'erro' ? 'alert-circle-outline' : 'file-tray-outline'}
                size={42}
                color={estadoLista === 'erro' ? '#B42318' : '#718096'}
            />
            <Text style={styles.emptyTitle}>
                {estadoLista === 'erro' ? 'Não foi possível carregar' : 'Nenhum registro encontrado'}
            </Text>
            <Text style={styles.messageText}>{message}</Text>
            {estadoLista === 'erro' ? (
                <TouchableOpacity
                    style={styles.botaoTentarNovamente}
                    onPress={() => {
                        setLoading(true);
                        fetchHistorico();
                    }}
                >
                    <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.textoBotaoTentarNovamente}>Tentar novamente</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );

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
                    
                    <FlatList
                        data={historico}
                        keyExtractor={keyExtractor}
                        renderItem={renderHistoricoItem}
                        ListHeaderComponent={avisoCard}
                        ListEmptyComponent={renderEmptyState}
                        contentContainerStyle={[
                            styles.listaConteudo,
                            historico.length === 0 && styles.listaConteudoVazia
                        ]}
                        initialNumToRender={8}
                        maxToRenderPerBatch={8}
                        updateCellsBatchingPeriod={50}
                        windowSize={7}
                        removeClippedSubviews={Platform.OS === 'android'}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
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

    avisoConteudo: {
        flex: 1,
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
        alignItems: 'flex-start',
    },

    vacinaNome: {
        flex: 1,
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: width * 0.03,
        marginRight: width * 0.03,
    },

    doseBadge: {
        maxWidth: width * 0.34,
        backgroundColor: '#e3f2fd',
        color: '#034a95ff',
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.004,
        borderRadius: width * 0.03,
        fontSize: width * 0.03,
        fontWeight: 'bold',
        textAlign: 'center',
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
        marginBottom: height * 0.004,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    emptyContainer: {
        alignItems: 'center',
        marginTop: height * 0.08,
        paddingHorizontal: width * 0.06,
    },

    emptyTitle: {
        marginTop: 12,
        color: '#2D3748',
        fontSize: width * 0.045,
        fontWeight: '700',
    },

    messageText: {
        marginTop: 8, 
        color: "#718096", 
        fontSize: width * 0.045,
        textAlign: 'center',
    },

    botaoTentarNovamente: {
        marginTop: height * 0.025,
        backgroundColor: '#103d6dff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.014,
        borderRadius: 24,
    },

    textoBotaoTentarNovamente: {
        color: '#FFFFFF',
        fontWeight: '700',
        marginLeft: 8,
        fontSize: width * 0.04,
    },

    listaConteudo: {
        paddingBottom: 75,
    },

    listaConteudoVazia: {
        flexGrow: 1,
    },
});

export default HistoricoScreen;
