import React from 'react';
import { 
    View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
    Linking, Platform, Dimensions 
} from 'react-native';
import { WebView } from 'react-native-webview'; 
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Cores do Tema (Repetidas para funcionar standalone)
const COLORS = {
    primary: "#0056D2",
    primaryDark: "#003580",
    secondary: "#00A3FF",
    background: "#F8F9FA",
    card: "#FFFFFF",
    textDark: "#1A202C",
    textGrey: "#718096",
    success: "#38A169",
    white: "#FFFFFF",
};

const CampanhaDetalheScreen = ({ campanhaDados, setScreen }) => {
    const item = campanhaDados;

    if (!item) return null;

    // --- LÓGICA DE COORDENADAS ---
    let lat = -3.10719; // Default (Manaus)
    let lng = -60.0261;

    // Prioriza campos específicos de unidade, depois genéricos, depois objeto GeoPoint
    if (item.unidade_latitude && item.unidade_longitude) {
        lat = parseFloat(item.unidade_latitude);
        lng = parseFloat(item.unidade_longitude);
    } else if (item.localizacao) {
        lat = item.localizacao.latitude || item.localizacao._lat;
        lng = item.localizacao.longitude || item.localizacao._long;
    }

    const openGPS = () => {
        const label = item.unidade_saude_nome || item.locais_aplicacao || 'Local de Vacinação';
        // CORREÇÃO 1: Adicionadas as crases (backticks) aqui
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

    // Componente auxiliar para linhas de informação
    const InfoRow = ({ icon, label, value, isBold = false }) => (
        <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={20} color={COLORS.primary} />
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={[styles.infoValue, isBold && { fontWeight: 'bold', color: COLORS.textDark }]}>
                    {value || 'Não informado'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                
                {/* Header Imersivo com Parallax visual */}
                <View style={styles.detailHeader}>
                    <Image 
                        source={{ uri: item.imagem_url || item.imagemUrl || 'https://via.placeholder.com/600x400' }} 
                        style={styles.detailImage} 
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.detailOverlay}
                    />
                    <TouchableOpacity style={styles.backButtonAbsolute} onPress={() => setScreen('campanhas')}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    
                    <View style={styles.headerTexts}>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeBadgeText}>{item.tipo_vacina}</Text>
                        </View>
                        <Text style={styles.detailTitle}>{item.titulo}</Text>
                    </View>
                </View>

                {/* Corpo do Conteúdo */}
                <View style={styles.detailBody}>
                    
                    {/* Descrição */}
                    <Text style={styles.sectionHeader}>Sobre a Campanha</Text>
                    <Text style={styles.descriptionText}>
                        {item.descricao || 'Confira os detalhes desta campanha de vacinação e compareça à unidade mais próxima.'}
                    </Text>

                    <View style={styles.divider} />

                    {/* Informações Principais */}
                    <Text style={styles.sectionHeader}>Detalhes do Atendimento</Text>
                    
                    <View style={styles.infoContainer}>
                        {/* Exibe o novo campo HORARIO */}
                        <InfoRow 
                            icon="time-outline" 
                            label="Horário de Funcionamento" 
                            value={item.unidade_horario} 
                            isBold={true}
                        />
                        
                        {/* CORREÇÃO 2: Adicionadas as crases (backticks) aqui */}
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

                    <View style={styles.divider} />

                    {/* Localização e Endereço */}
                    <Text style={styles.sectionHeader}>Localização</Text>
                    
                    <View style={styles.addressCard}>
                        <Text style={styles.unitName}>
                            {item.unidade_saude_nome || item.locais_aplicacao || "Unidade de Saúde"}
                        </Text>
                        
                        {/* CORREÇÃO 3: Adicionadas as crases (backticks) aqui */}
                        <Text style={styles.addressText}>
                            {item.unidade_endereco 
                                ? `${item.unidade_endereco}, ${item.unidade_cidade || ''}`
                                : item.endereco || "Endereço não cadastrado"
                            }
                        </Text>

                        {/* Mapa Visual */}
                        <View style={styles.mapWrapper}>
                            <WebView 
                                originWhitelist={['*']}
                                source={{ html: mapHtml }}
                                style={styles.webViewMap}
                                scrollEnabled={false}
                            />
                            {/* Overlay transparente para clique */}
                            <TouchableOpacity style={styles.mapClickOverlay} onPress={openGPS} />
                        </View>

                        <TouchableOpacity style={styles.gpsButton} onPress={openGPS} activeOpacity={0.8}>
                            <Ionicons name="navigate-circle" size={24} color="#FFF" style={{marginRight: 8}} />
                            <Text style={styles.gpsButtonText}>Traçar Rota no GPS</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Espaço final */}
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    
    // Header Styles
    detailHeader: { height: 320, width: '100%', position: 'relative' },
    detailImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    detailOverlay: { ...StyleSheet.absoluteFillObject },
    backButtonAbsolute: {
        position: 'absolute', top: Platform.OS === 'ios' ? 50 : 40, left: 20,
        backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 20,
        zIndex: 20,
    },
    headerTexts: { position: 'absolute', bottom: 40, left: 20, right: 20, zIndex: 10 },
    typeBadge: { 
        backgroundColor: COLORS.secondary, alignSelf: 'flex-start', 
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 10 
    },
    typeBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
    detailTitle: { fontSize: 28, fontWeight: '800', color: 'white', lineHeight: 34, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 10 },
    
    // Body Styles
    detailBody: {
        backgroundColor: COLORS.background,
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 32,
        flex: 1,
    },
    sectionHeader: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginBottom: 16 },
    descriptionText: { fontSize: 16, color: '#4A5568', lineHeight: 26 },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 24 },
    
    // Info Rows
    infoContainer: { gap: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
    iconBox: { 
        width: 40, height: 40, borderRadius: 12, backgroundColor: '#E3F2FD', 
        justifyContent: 'center', alignItems: 'center', marginRight: 15 
    },
    infoLabel: { fontSize: 12, color: COLORS.textGrey, marginBottom: 2 },
    infoValue: { fontSize: 15, color: '#2D3748', lineHeight: 22 },

    // Address Card
    addressCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
    unitName: { fontSize: 18, fontWeight: '700', color: COLORS.primaryDark, marginBottom: 6 },
    addressText: { fontSize: 15, color: '#4A5568', marginBottom: 16, lineHeight: 22 },
    mapWrapper: { height: 180, borderRadius: 16, overflow: 'hidden', position: 'relative', marginBottom: 16, borderWidth: 1, borderColor: '#EDF2F7' },
    webViewMap: { flex: 1 },
    mapClickOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
    gpsButton: {
        backgroundColor: COLORS.success,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        paddingVertical: 16, borderRadius: 16,
        shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
    },
    gpsButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});

export default CampanhaDetalheScreen;