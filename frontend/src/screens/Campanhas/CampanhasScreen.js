import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image, StatusBar, Platform, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCampanhas } from '../../services/authService';
import BottomNav from '../../components/BarraNavegacao';

const { width, height } = Dimensions.get('window');


const CampanhaItem = ({ item, onPress }) => (
    <TouchableOpacity
        style={styles.cartao}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
    >
        <View style={styles.containerImagem}>
            <Image
                source={{ uri: item.imagem_url || 'https://via.placeholder.com/600x300' }}
                style={styles.imagemCartao}
                resizeMode="cover"
            />
            
            <View style={styles.seloData}>
                <Text style={styles.textoDataSelo}>{item.data_inicio}</Text>
                <Text style={styles.subTextoDataSelo}>INÍCIO</Text>
            </View>
        </View>

        <View style={styles.conteudoCartao}>
            <View style={styles.containerTag}>
                <View style={[styles.tag, { backgroundColor: '#e9e9e9ff' }]}>
                    <Text style={[styles.textoTag, { color: '#717776ff' }]}>
                        {item.tipo_vacina}
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
                            {item.hora_inicio} - {item.hora_fim} 
                        </Text>
                    </View>
                )}
            </View>

            <Text style={styles.tituloCampanha} numberOfLines={2}>
                {item.titulo}
            </Text>

            <View style={styles.rodapeCartao}>
                <Text style={styles.textoLocalizacao} numberOfLines={1}>
                    <Ionicons name="location-sharp" size={width * 0.04} color="#d55656ff" />
                    {' '}{item.unidade_saude_nome || "Unidade de Saúde"}
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

const CampanhasScreen = ({ onSelectCampanha, setScreen }) => {
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Atualizando campanhas...');

    useEffect(() => {
        const fetchCampanhas = async () => {
            setLoading(true); 
            try {
                const response = await getCampanhas();
                
                if (response.data && response.data.campanhas?.length > 0) {
                    setCampanhas(response.data.campanhas);
                } else {
                    setCampanhas([]);
                    setMessage('Nenhuma campanha ativa no momento.');
                }
            } catch (error) {
                setCampanhas([]);
                setMessage('Não foi possível carregar as campanhas. Verifique sua conexão.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCampanhas();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.containerCentralizado}>
                <ActivityIndicator size="large" color="#052f68ff" />
                <Text style={styles.textoCarregamento}>Buscando informações...</Text>
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
                            <Ionicons name="folder-open-outline" size={width * 0.15} color="#CBD5E0" />
                            <Text style={styles.textoMensagem}>{message}</Text>
                        </View>

                    ) : (

                        <FlatList
                            data={campanhas}
                            keyExtractor={(item, index) => item.id_campanha ? item.id_campanha.toString() : index.toString()}
                            renderItem={({ item }) => (
                                <CampanhaItem 
                                    item={item} 
                                    onPress={onSelectCampanha} 
                                />
                            )}
                            contentContainerStyle={styles.conteudoLista}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    <BottomNav active="home" setScreen={setScreen} />

                </View>
            </View>
        </SafeAreaView>
        
    );
};

const styles = StyleSheet.create({
    safe: { 
        flex: 1, 
        backgroundColor: "rgba(0,0,0,0)",
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
        paddingTop: Platform.OS === "android" ? height * 0.025 : height * 0.03,
        paddingBottom: height * 0.025,
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