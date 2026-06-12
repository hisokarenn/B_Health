import React, { useCallback, useMemo, useState } from 'react';
import { 
    View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
    Linking, Platform, Dimensions 
} from 'react-native';
import { WebView } from 'react-native-webview'; 
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");
const IMAGEM_PLACEHOLDER = require('../../../assets/bhealth.png');
const COORDENADAS_MANAUS = {
    lat: -3.1190275,
    lng: -60.0217314,
};

const textoSeguro = (valor, fallback = 'Não informado') => {
    const texto = String(valor || '').trim();
    return texto || fallback;
};

const obterImagemCampanha = (item) => {
    const uri = String(item?.imagem_url || item?.imagemUrl || '').trim();
    return /^https?:\/\//i.test(uri) ? { uri } : IMAGEM_PLACEHOLDER;
};

const parseCoordenada = (valor) => {
    if (valor === undefined || valor === null || valor === '') return null;

    const numero = typeof valor === 'number'
        ? valor
        : Number(String(valor).replace(',', '.').trim());

    return Number.isFinite(numero) ? numero : null;
};

const coordenadasSaoValidas = (lat, lng) => (
    Number.isFinite(lat)
    && Number.isFinite(lng)
    && lat >= -90
    && lat <= 90
    && lng >= -180
    && lng <= 180
);

const obterCoordenadasCampanha = (item) => {
    const candidatos = [
        {
            lat: item?.unidade_latitude,
            lng: item?.unidade_longitude,
        },
        {
            lat: item?.localizacao?.latitude ?? item?.localizacao?._lat,
            lng: item?.localizacao?.longitude ?? item?.localizacao?._long,
        },
    ];

    const candidatoInformado = candidatos.find((coordenada) => (
        coordenada.lat !== undefined
        && coordenada.lat !== null
        && coordenada.lat !== ''
        && coordenada.lng !== undefined
        && coordenada.lng !== null
        && coordenada.lng !== ''
    ));

    if (!candidatoInformado) {
        return {
            ...COORDENADAS_MANAUS,
            usandoFallback: true,
            mensagem: 'Localização não informada. Exibimos Manaus como referência.',
        };
    }

    const lat = parseCoordenada(candidatoInformado.lat);
    const lng = parseCoordenada(candidatoInformado.lng);

    if (!coordenadasSaoValidas(lat, lng)) {
        return {
            ...COORDENADAS_MANAUS,
            usandoFallback: true,
            mensagem: 'Coordenada inválida na campanha. Exibimos Manaus como referência.',
        };
    }

    return {
        lat,
        lng,
        usandoFallback: false,
        mensagem: '',
    };
};

const CampanhaDetalheScreen = ({ campanhaDados, setScreen }) => {
    const [imagemFalhou, setImagemFalhou] = useState(false);
    const [mapaFalhou, setMapaFalhou] = useState(false);
    const [mapaMensagem, setMapaMensagem] = useState('');
    const item = campanhaDados || {};

    const coordenadas = useMemo(() => obterCoordenadasCampanha(item), [item]);
    const imagemCampanha = imagemFalhou ? IMAGEM_PLACEHOLDER : obterImagemCampanha(item);

    const openGPS = useCallback(async () => {
        const label = encodeURIComponent(
            textoSeguro(item.unidade_saude_nome || item.locais_aplicacao, 'Local de Vacinação')
        );
        const { lat, lng } = coordenadas;
        const url = Platform.select({
            ios: `maps:0,0?q=${label}@${lat},${lng}`,
            android: `geo:0,0?q=${lat},${lng}(${label})`,
            default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        });
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

        try {
            setMapaMensagem('');
            let destino = fallbackUrl;

            try {
                const podeAbrirUrlNativa = await Linking.canOpenURL(url);
                destino = podeAbrirUrlNativa ? url : fallbackUrl;
            } catch (error) {
                destino = fallbackUrl;
            }

            await Linking.openURL(destino);
        } catch (error) {
            setMapaMensagem('Não foi possível abrir o mapa neste dispositivo. Tente novamente mais tarde.');
        }
    }, [coordenadas, item]);

    const mapHtml = useMemo(() => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
          iframe { width: 100%; height: 100%; border: 0; }
        </style>
      </head>
      <body>
        <iframe 
          src="https://maps.google.com/maps?q=${coordenadas.lat},${coordenadas.lng}&z=15&output=embed" 
          frameborder="0" style="border:0">
        </iframe>
      </body>
      </html>
    `, [coordenadas.lat, coordenadas.lng]);

    const InfoRow = ({ icon, label, value, isBold = false }) => (
        <View style={styles.infoRow}>
            <View style={styles.iconeDetalhes}>
                <Ionicons name={icon} size={20} color={"#0d2a53ff"} />
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={[styles.infoValor, isBold && { color: "#5f6b80ff" }]}>
                    {textoSeguro(value)}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                
                <View style={styles.detalhesCabecalho}>
                    <Image 
                        source={imagemCampanha} 
                        style={styles.detalhesImg} 
                        onError={() => setImagemFalhou(true)}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.detailOverlay}
                    />
                    <TouchableOpacity style={styles.btnVoltar} onPress={() => setScreen('campanhas')}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    
                    <View style={styles.headerTexto}>
                        <View style={styles.tipoBadge}>
                            <Text style={styles.tipoBadgeTexto}>{textoSeguro(item.tipo_vacina, 'Campanha')}</Text>
                        </View>
                        <Text style={styles.detalheTitulo}>{textoSeguro(item.titulo, 'Campanha de vacinação')}</Text>
                    </View>
                </View>

                <View style={styles.detalhes}>
                    
                    <Text style={styles.secaoDetalhe}>Sobre a Campanha</Text>
                    <Text style={styles.descricaoDet}>
                        {item.descricao || 'Confira os detalhes desta campanha de vacinação e compareça à unidade mais próxima.'}
                    </Text>

                    <View style={styles.divisor} />

                    <Text style={styles.secaoDetalhe}>Detalhes do Atendimento</Text>
                    
                    <View style={styles.infoContainer}>
                        {/*horario*/}
                        <InfoRow 
                            icon="time-outline" 
                            label="Horário da Campanha" 
                            value={item.hora_inicio || item.hora_fim
                                ? `${item.hora_inicio || '--:--'} - ${item.hora_fim || '--:--'}`
                                : ''
                            } 
                            isBold={true}
                        />

                        <InfoRow 
                            icon="calendar-outline" 
                            label="Período da Campanha" 
                            value={item.data_inicio || item.data_fim
                                ? `${item.data_inicio || 'Data inicial não informada'} até ${item.data_fim || 'data final não informada'}`
                                : ''
                            } 
                        />
                        
                        <InfoRow 
                            icon="people-outline" 
                            label="Público Alvo" 
                            value={item.publico_alvo} 
                        />
                    </View>

                    <View style={styles.divisor} />

                    {/*localização*/}
                    <Text style={styles.secaoDetalhe}>Localização</Text>
                    
                    <View style={styles.locCard}>
                        <Text style={styles.nome}>
                            {item.unidade_saude_nome || item.locais_aplicacao || "Unidade de Saúde"}
                        </Text>
                        
                        <Text style={styles.locTexto}>
                            {item.unidade_endereco 
                                ? `${item.unidade_endereco}, ${item.unidade_cidade || ''}`
                                : item.endereco || "Endereço não cadastrado"
                            }
                        </Text>

                        {coordenadas.usandoFallback && (
                            <View style={styles.avisoLocalizacao}>
                                <Ionicons name="information-circle-outline" size={18} color="#8A4B0F" />
                                <Text style={styles.avisoLocalizacaoTexto}>{coordenadas.mensagem}</Text>
                            </View>
                        )}

                        {/*mapa*/}
                        <View style={styles.mapaWrap}>
                            {mapaFalhou ? (
                                <View style={styles.mapaFallback}>
                                    <Ionicons name="map-outline" size={36} color="#41669aff" />
                                    <Text style={styles.mapaFallbackTexto}>
                                        Não foi possível carregar o mapa agora.
                                    </Text>
                                </View>
                            ) : (
                                <WebView 
                                    originWhitelist={['*']}
                                    source={{ html: mapHtml }}
                                    style={styles.webViewMap}
                                    scrollEnabled={false}
                                    onError={() => {
                                        setMapaFalhou(true);
                                        setMapaMensagem('Não foi possível carregar o mapa. Você ainda pode tentar abrir a rota no GPS.');
                                    }}
                                    onHttpError={() => {
                                        setMapaFalhou(true);
                                        setMapaMensagem('Não foi possível carregar o mapa. Você ainda pode tentar abrir a rota no GPS.');
                                    }}
                                />
                            )}
                            <TouchableOpacity style={styles.mapClickOverlay} onPress={openGPS} />
                        </View>

                        {mapaMensagem ? (
                            <View style={styles.erroMapa}>
                                <Ionicons name="alert-circle-outline" size={18} color="#B42318" />
                                <Text style={styles.erroMapaTexto}>{mapaMensagem}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity style={styles.gpsBtn} onPress={openGPS} activeOpacity={0.8}>
                            <Ionicons name="navigate-circle" size={24} color="#FFF" style={{marginRight: 8}} />
                            <Text style={styles.gpsBtnTexto}>Traçar Rota no GPS</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ height: 110 }} />
                </View>
            </ScrollView>
            
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#08366171" ,
    },

    container: {
        flex: 1, 
        backgroundColor: "#F8F9FA" 
    },

    detalhesCabecalho: { 
        height: height * 0.38, 
        width: '100%', 
        position: 'relative'
    },

    detalhesImg: { 
        width: '100%', 
        height: '90%', 
        resizeMode: 'cover' 
    },

    detailOverlay: { 
        ...StyleSheet.absoluteFillObject 
    },

    btnVoltar: {
        position: 'absolute', 
        top: Platform.OS === 'android' ? height * 0.06 : height * 0.05,
        left: width * 0.05,
        backgroundColor: 'rgba(255, 255, 255, 0.47)', 
        padding: width * 0.03, 
        borderRadius: width * 0.06,
        zIndex: 20,
    },

    headerTexto: { 
        position: 'absolute', 
        bottom: height * 0.06,
        left: width * 0.05,
        right: width * 0.05,
        zIndex: 10 
    },

    tipoBadge: { 
        backgroundColor: "#699ed0ff", 
        alignSelf: 'flex-start', 
        paddingHorizontal: width * 0.03, 
        paddingVertical: height * 0.007, 
        borderRadius: width * 0.03,
        marginBottom: height * 0.012,
        top: -height * 0.045,
    },

    tipoBadgeTexto: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: width * 0.03,
        textTransform: 'uppercase' 
    },

    detalheTitulo: { 
        fontSize: width * 0.07, 
        fontWeight: '800', 
        color: 'white', 
        lineHeight: width * 0.085,
        textShadowColor: 'rgba(0,0,0,0.5)', 
        textShadowRadius: 10,
        top: -height * 0.045,
    },
    
    detalhes: {
        backgroundColor: "#F8F9FA",
        marginTop: -height * 0.08,
        borderTopLeftRadius: width * 0.1,
        borderTopRightRadius: width * 0.1,
        paddingHorizontal: width * 0.06,
        paddingTop: height * 0.04,
        flex: 1,
    },

    secaoDetalhe: { 
        fontSize: width * 0.05,
        fontWeight: '700', 
        color: "#152545ff", 
        marginBottom: height * 0.02 
    },

    descricaoDet: { 
        fontSize: width * 0.04,
        color: '#4A5568', 
        lineHeight: width * 0.055,
        textAlign: 'justify',
    },

    divisor: { 
        height: 2, 
        backgroundColor: '#dadfffb4', 
        marginVertical: height * 0.03,
        borderRadius: 10, 
    },
    
    infoContainer: { 
        gap: height * 0.02 
    },

    infoRow: { 
        flexDirection: 'row', 
        alignItems: 'flex-start' 
    },

    iconeDetalhes: { 
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: width * 0.04,
        backgroundColor: '#c0d3fcff', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: width * 0.04 
    },

    infoLabel: { 
        fontSize: width * 0.035, 
        color: "#455061ff", 
        marginBottom: 2,
        fontWeight: 'bold' 
    },

    infoValor: { 
        fontSize: width * 0.033, 
        color: '#5f6b80ff', 
        lineHeight: width * 0.05
    },

    locCard: { 
        backgroundColor: "#fff", 
        borderRadius: width * 0.09,
        padding: width * 0.05, 
        elevation: 2, 
        shadowColor: "#000", 
        shadowOpacity: 0.05, 
        shadowRadius: 10,
        marginTop: height * 0.015
    },

    nome: { 
        fontSize: width * 0.05,
        fontWeight: '700', 
        color: "#022e6aff", 
        marginBottom: height * 0.01 
    },

    locTexto: { 
        fontSize: width * 0.04,
        color: '#4A5568', 
        marginBottom: height * 0.02, 
        lineHeight: width * 0.053
    },

    avisoLocalizacao: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF7E8',
        borderWidth: 1,
        borderColor: '#F8D7A1',
        borderRadius: width * 0.035,
        padding: width * 0.035,
        marginBottom: height * 0.02,
    },

    avisoLocalizacaoTexto: {
        flex: 1,
        color: '#8A4B0F',
        marginLeft: 8,
        fontSize: width * 0.033,
        lineHeight: width * 0.047,
        fontWeight: '600',
    },

    mapaWrap: { 
        height: height * 0.22,
        borderRadius: width * 0.04,
        overflow: 'hidden', 
        position: 'relative', 
        marginBottom: height * 0.02, 
        borderWidth: 1, 
        borderColor: '#EDF2F7' 
    },

    webViewMap: { 
        flex: 1 
    },

    mapaFallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEF5FF',
        paddingHorizontal: width * 0.06,
    },

    mapaFallbackTexto: {
        marginTop: 8,
        color: '#41669aff',
        fontSize: width * 0.036,
        textAlign: 'center',
        fontWeight: '700',
    },

    mapClickOverlay: { 
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: 'transparent' 
    },

    erroMapa: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF4ED',
        borderWidth: 1,
        borderColor: '#FECDCA',
        borderRadius: width * 0.035,
        padding: width * 0.035,
        marginBottom: height * 0.02,
    },

    erroMapaTexto: {
        flex: 1,
        marginLeft: 8,
        color: '#B42318',
        fontSize: width * 0.033,
        lineHeight: width * 0.047,
        fontWeight: '600',
    },

    gpsBtn: {
        backgroundColor: "#6095d2ff",
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingVertical: height * 0.02,
        borderRadius: width * 0.07,
        shadowColor: "#60b6d2ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, 
        shadowRadius: 8, 
        elevation: 4
    },

    gpsBtnTexto: { 
        color: "#fff", 
        fontSize: width * 0.045,
        fontWeight: 'bold' 
    },
});

export default CampanhaDetalheScreen;
