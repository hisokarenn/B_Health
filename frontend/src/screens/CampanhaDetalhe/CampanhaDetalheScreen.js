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
                            label="Horário de Funcionamento" 
                            value={item.unidade_horario} 
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

            <BottomNav active="home" setScreen={setScreen} />
            
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },

    container: {
        flex: 1, 
        backgroundColor: "#F8F9FA" 
    },

    detalhesCabecalho: { 
        height: 320, 
        width: '100%', 
        position: 'relative' 
    },

    detalhesImg: { 
        width: '100%', 
        height: '90%', 
        resizeMode: 'cover' 
    },

    detailOverlay: { ...StyleSheet.absoluteFillObject },

    btnVoltar: {
        position: 'absolute', 
        top: Platform.OS === 'android' ? 50 : 40, 
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.47)', 
        padding: 10, 
        borderRadius: 20,
        zIndex: 20,
    },

    headerTexto: { 
        position: 'absolute', 
        bottom: 40, 
        left: 20, 
        right: 20, 
        zIndex: 10 
    },

    tipoBadge: { 
        backgroundColor: "#699ed0ff", 
        alignSelf: 'flex-start', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 12,
        marginBottom: 10,
        top: -35,
    },

    tipoBadgeTexto: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 12, 
        textTransform: 'uppercase' 
    },

    detalheTitulo: { 
        fontSize: 25, 
        fontWeight: '800', 
        color: 'white', 
        lineHeight: 34, 
        textShadowColor: 'rgba(0,0,0,0.5)', 
        textShadowRadius: 10,
        top: -35,
    },
    
    // Body Styles
    detalhes: {
        backgroundColor: "#F8F9FA",
        marginTop: -62,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 24,
        paddingTop: 32,
        flex: 1,
    },

    secaoDetalhe: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: "#152545ff", 
        marginBottom: 16 
    },

    descricaoDet: { 
        fontSize: 16, 
        color: '#4A5568', 
        lineHeight: 26 
    },

    divisor: { 
        height: 2, 
        backgroundColor: '#dadfffb4', 
        marginVertical: 25,
        borderRadius: 10, 
    },
    
    // Info Rows
    infoContainer: { 
        gap: 16 
    },

    infoRow: { 
        flexDirection: 'row', 
        alignItems: 'flex-start' 
    },

    iconeDetalhes: { 
        width: 40, 
        height: 40, 
        borderRadius: 16, 
        backgroundColor: '#c0d3fcff', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 15 
    },

    infoLabel: { 
        fontSize: 14, 
        color: "#455061ff", 
        marginBottom: 2,
        fontWeight: 'bold' 
    },

    infoValor: { 
        fontSize: 13, 
        color: '#5f6b80ff', 
        lineHeight: 22 
    },

    locCard: { 
        backgroundColor: "#ffff", 
        borderRadius: 35, 
        padding: 20, 
        elevation: 2, 
        shadowColor: "#000", 
        shadowOpacity: 0.05, 
        shadowRadius: 10 
    },

    nome: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: "#022e6aff", 
        marginBottom: 6 
    },

    locTexto: { 
        fontSize: 15, 
        color: '#4A5568', 
        marginBottom: 16, 
        lineHeight: 22 
    },

    mapaWrap: { 
        height: 180, 
        borderRadius: 16, 
        overflow: 'hidden', 
        position: 'relative', 
        marginBottom: 16, 
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
        paddingVertical: 16, 
        borderRadius: 25,
        shadowColor: "#60b6d2ff", 
        shadowOffset: { 
            width: 0, 
            height: 4 
        },

        shadowOpacity: 0.3, 
        shadowRadius: 8, 
        elevation: 4
    },

    gpsBtnTexto: { 
        color: "#ffff", 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
});

export default CampanhaDetalheScreen;