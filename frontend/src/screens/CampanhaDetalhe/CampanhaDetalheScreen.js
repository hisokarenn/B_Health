import React from 'react';
import { 
    View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
    Linking, Platform, Dimensions 
} from 'react-native';
import { WebView } from 'react-native-webview'; 
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../../components/BarraNavegacao';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get("window");

const CampanhaDetalheScreen = ({ campanhaDados, setScreen }) => {
    
    const item = campanhaDados;

    if (!item) return null;

    let lat = -3.10719; //Manaus
    let lng = -60.0261;

    if (item.unidade_latitude && item.unidade_longitude) {
        lat = parseFloat(item.unidade_latitude);
        lng = parseFloat(item.unidade_longitude);
    } else if (item.localizacao) {
        lat = item.localizacao.latitude || item.localizacao._lat;
        lng = item.localizacao.longitude || item.localizacao._long;
    }

    const openGPS = () => {
        const label = item.unidade_saude_nome || item.locais_aplicacao || 'Local de Vacinação';
        const url = Platform.select({
            ios: `maps:0,0?q=${label}@${lat},${lng}`,
            android: `geo:0,0?q=${lat},${lng}(${label})`
        });
        Linking.openURL(url);
    };

    const mapHtml = `
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
          src="https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed" 
          frameborder="0" style="border:0">
        </iframe>
      </body>
      </html>
    `;

    const InfoRow = ({ icon, label, value, isBold = false }) => (
        <View style={styles.infoRow}>
            <View style={styles.iconeDetalhes}>
                <Ionicons name={icon} size={20} color={"#0d2a53ff"} />
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={[styles.infoValor, isBold && { color: "#5f6b80ff" }]}>
                    {value || 'Não informado'}
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
                        source={{ uri: item.imagem_url || item.imagemUrl || 'https://via.placeholder.com/600x400' }} 
                        style={styles.detalhesImg} 
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
                            <Text style={styles.tipoBadgeTexto}>{item.tipo_vacina}</Text>
                        </View>
                        <Text style={styles.detalheTitulo}>{item.titulo}</Text>
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
                            value={`${item.hora_inicio} - ${item.hora_fim}`} 
                            isBold={true}
                        />

                        <InfoRow 
                            icon="calendar-outline" 
                            label="Período da Campanha" 
                            value={`${item.data_inicio} até ${item.data_fim}`} 
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

                        {/*mapa*/}
                        <View style={styles.mapaWrap}>
                            <WebView 
                                originWhitelist={['*']}
                                source={{ html: mapHtml }}
                                style={styles.webViewMap}
                                scrollEnabled={false}
                            />
                            <TouchableOpacity style={styles.mapClickOverlay} onPress={openGPS} />
                        </View>

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

    mapClickOverlay: { 
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: 'transparent' 
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