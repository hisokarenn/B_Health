import React, { useCallback, useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, StatusBar, Platform, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCampanhas } from '../../services/authService';
import { obterMensagemFalhaTemporaria } from '../../utilitarios/Erros';

const { width, height } = Dimensions.get('window');
const IMAGEM_PLACEHOLDER = require('../../../assets/bhealth.png');
const TEMPO_LOADING_PROLONGADO_MS = 8000;
const LIMITE_CAMPANHAS = 20;

const obterImagemCampanha = (item) => {
    const uri = String(item?.imagem_url || item?.imagemUrl || '').trim();
    return /^https?:\/\//i.test(uri) ? { uri } : IMAGEM_PLACEHOLDER;
};

const obterIdCampanha = (item) => String(item?.id || item?.id_campanha || item?.uid || '');

const CampanhaItem = ({ item, onPress }) => {
    const [imagemFalhou, setImagemFalhou] = useState(false);
    const imagemCampanha = imagemFalhou ? IMAGEM_PLACEHOLDER : obterImagemCampanha(item);

    return (
        <TouchableOpacity
            style={styles.cartao}
            onPress={() => onPress(item)}
            activeOpacity={0.8}
        >
            <View style={styles.containerImagem}>
                <Image
                    source={imagemCampanha}
                    style={styles.imagemCartao}
                    resizeMode="cover"
                    onError={() => setImagemFalhou(true)}
                />
                
                <View style={styles.seloData}>
                    <Text style={styles.textoDataSelo}>{item.data_inicio || 'Data a definir'}</Text>
                    <Text style={styles.subTextoDataSelo}>INÍCIO</Text>
                </View>
            </View>

            <View style={styles.conteudoCartao}>
                <View style={styles.containerTag}>
                    <View style={[styles.tag, { backgroundColor: '#e9e9e9ff' }]}>
                        <Text style={[styles.textoTag, { color: '#717776ff' }]}>
                            {item.tipo_vacina || 'Campanha'}
                        </Text>
                    </View>
                    
                    {(item.hora_inicio || item.hora_fim) && (
                        <View style={[styles.tag, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons 
                                name="time-outline" 
                                size={width * 0.035}
                                color="#23569dff" 
                                style={styles.iconeTag}
                            />
                            <Text style={[styles.textoTag, { color: "#23569dff" }]}>
                                {item.hora_inicio || '--:--'} - {item.hora_fim || '--:--'} 
                            </Text>
                        </View>
                    )}
                </View>

                <Text style={styles.tituloCampanha} numberOfLines={2}>
                    {item.titulo || 'Campanha de vacinação'}
                </Text>

                <View style={styles.rodapeCartao}>
                    <Text style={styles.textoLocalizacao} numberOfLines={1}>
                        <Ionicons name="location-sharp" size={width * 0.04} color="#d55656ff" />
                        {' '}{item.unidade_saude_nome || item.locais_aplicacao || "Unidade de Saúde"}
                    </Text>
                    <Ionicons 
                        name="arrow-forward-circle" 
                        size={width * 0.1}
                        color="#41669aff" 
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const CampanhasScreen = ({ onSelectCampanha, setScreen }) => {
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Atualizando campanhas...');
    const [erroCarregamento, setErroCarregamento] = useState(false);
    const [loadingProlongado, setLoadingProlongado] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [temMais, setTemMais] = useState(false);
    const [loadingMais, setLoadingMais] = useState(false);

    const fetchCampanhas = useCallback(async ({ pagina = 1, append = false } = {}) => {
        let timeoutLoading = null;

        if (append) {
            setLoadingMais(true);
        } else {
            setLoading(true);
        }

        setErroCarregamento(false);
        setLoadingProlongado(false);
        setMessage(append ? '' : 'Atualizando campanhas...');

        if (!append) {
            timeoutLoading = setTimeout(() => {
                setLoadingProlongado(true);
                setMessage('A API pode demorar até 50 segundos na primeira abertura. Ainda estamos buscando as campanhas.');
            }, TEMPO_LOADING_PROLONGADO_MS);
        }

        try {
            const response = await getCampanhas({
                pagina,
                limite: LIMITE_CAMPANHAS,
            });
            const campanhasRecebidas = response.data?.campanhas || response.data?.camapnhas || [];
            const paginacao = response.data?.paginacao || {};

            setPaginaAtual(paginacao.pagina || pagina);
            setTemMais(Boolean(paginacao.proximaPagina));

            if (campanhasRecebidas.length > 0) {
                setCampanhas((prev) => {
                    if (!append) {
                        return campanhasRecebidas;
                    }

                    const idsExistentes = new Set(prev.map(obterIdCampanha).filter(Boolean));
                    const novasCampanhas = campanhasRecebidas.filter((campanha, index) => {
                        const id = obterIdCampanha(campanha) || `pagina-${pagina}-${index}`;
                        if (idsExistentes.has(id)) {
                            return false;
                        }

                        idsExistentes.add(id);
                        return true;
                    });

                    return [...prev, ...novasCampanhas];
                });
                setMessage('');
            } else {
                if (!append) {
                    setCampanhas([]);
                }
                setMessage(response.data?.message || 'Nenhuma campanha ativa no momento.');
            }
        } catch (error) {
            if (!append) {
                setCampanhas([]);
            }
            setErroCarregamento(true);
            setMessage(obterMensagemFalhaTemporaria(
                error,
                'Não foi possível carregar as campanhas. Tente novamente.'
            ));
        } finally {
            clearTimeout(timeoutLoading);
            if (append) {
                setLoadingMais(false);
            } else {
                setLoading(false);
            }
            setLoadingProlongado(false);
        }
    }, []);

    useEffect(() => {
        fetchCampanhas();
    }, [fetchCampanhas]);

    const carregarMaisCampanhas = useCallback(() => {
        if (!temMais || loadingMais || loading) {
            return;
        }

        fetchCampanhas({
            pagina: paginaAtual + 1,
            append: true,
        });
    }, [fetchCampanhas, loading, loadingMais, paginaAtual, temMais]);

    const renderStatusLista = () => (
        erroCarregamento && campanhas.length > 0 ? (
            <View style={styles.statusLista}>
                <Ionicons name="alert-circle-outline" size={18} color="#B42318" />
                <Text style={styles.statusListaTexto}>{message}</Text>
                <TouchableOpacity
                    style={styles.statusListaBotao}
                    onPress={carregarMaisCampanhas}
                    disabled={loadingMais}
                >
                    <Text style={styles.statusListaBotaoTexto}>Recarregar</Text>
                </TouchableOpacity>
            </View>
        ) : null
    );

    const renderFooterLista = () => (
        loadingMais ? (
            <View style={styles.listaFooter}>
                <ActivityIndicator size="small" color="#0c2c5aff" />
                <Text style={styles.listaFooterTexto}>Carregando mais campanhas...</Text>
            </View>
        ) : null
    );
        
    if (loading) {
        return (
            <SafeAreaView style={styles.containerCentralizado}>
                <ActivityIndicator size="large" color="#0c2c5aff" />
                <Text style={styles.textoCarregamento}>
                    {loadingProlongado ? message : 'Buscando informações...'}
                </Text>
            </SafeAreaView>
        );
    }

    return (
         <SafeAreaView style={styles.safe}>
            <View style={styles.telaCheia}>
                
                <StatusBar 
                    barStyle="light-content" 
                    backgroundColor="#0b4786ff" 
                    translucent={false}
                />
                        
                <LinearGradient 
                    colors={["#0b4786ff", "#001c42ff"]}
                    style={styles.header}>
            
                    <TouchableOpacity 
                        onPress={() => setScreen('menu')}
                        style={styles.headerIcone}
                    >
                        <Ionicons name="arrow-back" size={width * 0.07} color="#FFFFFF" />
                    </TouchableOpacity>
            
                    <Text style={styles.tituloHeader}>B Health</Text>
                    <View style={styles.wrapperIconeCabecalho} /> 
                </LinearGradient>

                <View style={styles.wrapperConteudo}>

                    <View style={styles.containerCabecalhoSecao}>
                        <Text style={styles.tituloCabecalhoSecao}>Campanhas</Text>
                        <Text style={styles.subtituloCabecalhoSecao}>Mantenha sua vacinação em dia</Text>
                    </View>

                    {campanhas.length === 0 ? (
                        <View style={styles.containerCentralizado}>
                            <Ionicons
                                name={erroCarregamento ? 'alert-circle-outline' : 'folder-open-outline'}
                                size={width * 0.15}
                                color={erroCarregamento ? '#B42318' : '#CBD5E0'}
                            />
                            <Text style={styles.textoMensagem}>{message}</Text>
                            {erroCarregamento && (
                                <TouchableOpacity
                                    style={styles.botaoTentarNovamente}
                                    onPress={() => fetchCampanhas()}
                                >
                                    <Ionicons name="refresh-outline" size={width * 0.05} color="#FFFFFF" />
                                    <Text style={styles.textoBotaoTentarNovamente}>Tentar novamente</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                    ) : (

                        <FlatList
                            data={campanhas}
                            keyExtractor={(item, index) => obterIdCampanha(item) || index.toString()}
                            renderItem={({ item }) => (
                                <CampanhaItem 
                                    item={item} 
                                    onPress={onSelectCampanha} 
                                />
                            )}
                            ListHeaderComponent={renderStatusLista}
                            ListFooterComponent={renderFooterLista}
                            contentContainerStyle={styles.conteudoLista}
                            onEndReached={carregarMaisCampanhas}
                            onEndReachedThreshold={0.4}
                            showsVerticalScrollIndicator={false}
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
        backgroundColor: "#08366171",
    },

    telaCheia: {
        flex: 1, 
        backgroundColor: "#ffff",
    },

    wrapperConteudo: { 
        flex: 1, 
        backgroundColor: "#F8F9FA",
    },

    conteudoLista: { 
        padding: 20, 
        paddingBottom: height * 0.12,
    },
    
    header: {
        paddingTop: Platform.OS === "android" ? height * 0.02 : height * 0.02,
        paddingBottom: height * 0.02,
        paddingHorizontal: width * 0.05,
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: "center",
    },

    headerIcone: {
        width: width * 0.07, 
        alignItems: 'flex-start',
    },

    tituloHeader: {
        color: "#fff",
        fontSize: width * 0.055,
        fontWeight: "bold",
        marginLeft: width * 0.07,
    },

    containerCabecalhoSecao: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: "#F8F9FA",
    },

    tituloCabecalhoSecao: { 
        fontSize: width * 0.06, 
        fontWeight: '800', 
        color: "#1A202C", 
        letterSpacing: -0.5,
    },

    subtituloCabecalhoSecao: { 
        fontSize: width * 0.04, 
        color: "#718096", 
        marginTop: 4,
    },

    containerCentralizado: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20,
        backgroundColor: "#F8F9FA",
    },

    textoCarregamento: { 
        marginTop: 15, 
        color: "#718096", 
        fontSize: width * 0.045,
    },

    textoMensagem: { 
        marginTop: 15, 
        color: "#718096", 
        fontSize: width * 0.045, 
        textAlign: 'center',
    },

    botaoTentarNovamente: {
        marginTop: 18,
        backgroundColor: '#41669aff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 24,
    },

    textoBotaoTentarNovamente: {
        color: '#FFFFFF',
        fontWeight: '700',
        marginLeft: 8,
        fontSize: width * 0.04,
    },

    statusLista: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF4ED',
        borderWidth: 1,
        borderColor: '#FECDCA',
        borderRadius: 14,
        marginBottom: 18,
        padding: 12,
    },

    statusListaTexto: {
        flex: 1,
        color: '#B42318',
        fontSize: width * 0.035,
        fontWeight: '600',
        marginLeft: 8,
    },

    statusListaBotao: {
        backgroundColor: '#B42318',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginLeft: 8,
    },

    statusListaBotaoTexto: {
        color: '#FFFFFF',
        fontSize: width * 0.032,
        fontWeight: '700',
    },

    listaFooter: {
        alignItems: 'center',
        paddingVertical: 18,
    },

    listaFooterTexto: {
        color: '#718096',
        fontSize: width * 0.035,
        marginTop: 8,
    },

    cartao: {
        backgroundColor: "#FFFFFF",
        borderRadius: 30,
        marginBottom: 25,
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
        width: width * 0.9,
        alignSelf: 'center',
        marginTop: height * -0.01,
    },

    containerImagem: {
        height: height * 0.22, 
        position: 'relative',
        backgroundColor: "#fff",
        color: "#fff"
    },

    imagemCartao: { 
        width: width * 0.85, 
        height: height * 0.21,
        borderRadius: 25,
        alignSelf: 'center',
        marginTop: height * 0.015
    },

    overlayImagem: {
        ...StyleSheet.absoluteFillObject, 
        zIndex: 1,
    },

    seloData: {
        position: 'absolute',
        top: 20, 
        right: 15,
        backgroundColor: "#FFFFFF", 
        borderRadius: 20,
        paddingVertical: 8, 
        paddingHorizontal: 12,
        alignItems: 'center', 
        zIndex: 10,
        shadowColor: "#6b72c7ff", 
        shadowOpacity: 0.15, 
        shadowRadius: 3, 
        elevation: 3,
    },

    textoDataSelo: {
        fontWeight: '900', 
        fontSize: width * 0.03, 
        color: "#244994ff",
    },

    subTextoDataSelo: {
        fontSize: width * 0.025, 
        color: "#718096", 
        fontWeight: '700',
    },

    conteudoCartao: { 
        padding: 18,
    },

    containerTag: { 
        flexDirection: 'row', 
        marginBottom: 5, 
        gap: 8,
    },

    tag: { 
        paddingHorizontal: 13, 
        paddingVertical: 5, 
        borderRadius: 15, 
        flexDirection: 'row', 
        alignItems: 'center',
    },

    iconeTag: {
        marginRight: 2,
    },

    textoTag: { 
        fontSize: width * 0.025, 
        fontWeight: '600', 
        textTransform: 'uppercase', 


    },

    tituloCampanha: { 
        fontSize: width * 0.05, 
        fontWeight: '600', 
        color: "#1A202C", 
        lineHeight: width * 0.065, 
        marginBottom: 2,
    },

    rodapeCartao: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 5,
    },

    textoLocalizacao: { 
        color: "#718096", 
        fontSize: width * 0.038, 
        flex: 1, 
        marginRight: 10,
    },
});

export default CampanhasScreen;
