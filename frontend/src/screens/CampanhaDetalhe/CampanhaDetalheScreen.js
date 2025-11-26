import React from 'react';
import { 
    View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Platform, Dimensions 
} from 'react-native';
import { WebView } from 'react-native-webview'; 
import { Ionicons } from '@expo/vector-icons';

const CampanhaDetalheScreen = ({ campanhaDados, setScreen }) => {
    const item = campanhaDados;

    if (!item) return null;

    // --- LÓGICA DE EXTRAÇÃO DE COORDENADAS (CORRIGIDA PARA SEU BANCO) ---
    let lat = null;
    let lng = null;

    // 1. Tenta ler os campos COM O PREFIXO "unidade_" (Conforme sua imagem do Firestore)
    if (item.unidade_latitude !== undefined && item.unidade_longitude !== undefined) {
        lat = parseFloat(item.unidade_latitude);
        lng = parseFloat(item.unidade_longitude);
    }
    // 2. Tenta ler campos diretos (caso tenha campanhas antigas sem o prefixo)
    else if (item.latitude !== undefined && item.longitude !== undefined) {
        lat = parseFloat(item.latitude);
        lng = parseFloat(item.longitude);
    } 
    // 3. Tenta ler objeto GeoPoint
    else if (item.localizacao) {
        lat = item.localizacao.latitude || item.localizacao._lat;
        lng = item.localizacao.longitude || item.localizacao._long;
    }

    // Fallback apenas se tudo falhar
    if (!lat || !lng) {
        console.log("⚠️ Coordenadas não encontradas. Usando padrão.");
        lat = -3.10719; 
        lng = -60.0261;
    } else {
        console.log(`📍 Localização encontrada: ${lat}, ${lng}`);
    }
    // -----------------------------------------------------

    const openGPS = () => {
        // Tenta pegar o nome da unidade específico (da sua imagem) ou o genérico
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
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background-color: #e0e0e0; }
          iframe { width: 100%; height: 100%; border: 0; display: block; }
        </style>
      </head>
      <body>
        <iframe 
          src="https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed" 
          frameborder="0" 
          allowfullscreen>
        </iframe>
      </body>
      </html>
    `;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                <TouchableOpacity style={styles.backButton} onPress={() => setScreen('campanhas')}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <Image 
                    source={{ uri: item.imagem_url || 'https://via.placeholder.com/400x250' }} 
                    style={styles.coverImage} 
                />

                <View style={styles.content}>
                    <Text style={styles.title}>{item.titulo}</Text>
                    <Text style={styles.tipo}>{item.tipo_vacina}</Text>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoBox}>
                            <Ionicons name="calendar" size={20} color="#007AFF" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Período</Text>
                                {/* Ajuste para usar data_inicio se existir, ou unidade_horario se preferir */}
                                <Text style={styles.infoValue}>{item.data_inicio || 'Ver'}</Text>
                                <Text style={styles.infoValue}>até {item.data_fim || 'Detalhes'}</Text>
                            </View>
                        </View>

                        <View style={styles.infoBox}>
                            <Ionicons name="people" size={20} color="#007AFF" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Público Alvo</Text>
                                <Text style={styles.infoValue} numberOfLines={2}>{item.publico_alvo}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Sobre a Campanha</Text>
                    <Text style={styles.descricao}>{item.descricao || 'Sem descrição disponível.'}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Local de Vacinação</Text>
                    {/* Usa os nomes específicos que vi na sua imagem */}
                    <Text style={styles.enderecoTitle}>
                        {item.unidade_saude_nome || item.locais_aplicacao}
                    </Text>
                    <Text style={styles.endereco}>
                        {item.unidade_endereco || item.endereco}, {item.unidade_cidade}
                    </Text>

                    {/* Mapa Visual */}
                    <View style={styles.mapContainer}>
                        <WebView 
                            originWhitelist={['*']}
                            source={{ html: mapHtml }}
                            style={styles.mapWebView}
                            scrollEnabled={false}
                            onShouldStartLoadWithRequest={(request) => {
                                const isHttp = request.url.startsWith('http');
                                if (!isHttp) {
                                    Linking.openURL(request.url).catch(() => {});
                                    return false;
                                }
                                return true;
                            }}
                        />
                        <TouchableOpacity style={styles.mapOverlay} onPress={openGPS} />
                    </View>

                    <TouchableOpacity style={styles.gpsButton} onPress={openGPS}>
                        <Ionicons name="navigate" size={22} color="#fff" style={{marginRight: 10}} />
                        <Text style={styles.gpsButtonText}>Traçar Rota (GPS)</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { paddingBottom: 40 },
    backButton: { position: 'absolute', top: 45, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 30 },
    coverImage: { width: '100%', height: 280, resizeMode: 'cover' },
    content: { flex: 1, padding: 25, marginTop: -30, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#00245aff', marginBottom: 8 },
    tipo: { fontSize: 14, color: '#007AFF', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 20, backgroundColor: '#e3f2fd', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    infoBox: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f8f9fa', padding: 12, borderRadius: 12, marginRight: 10 },
    infoTextContainer: { marginLeft: 10, flex: 1 },
    infoLabel: { fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 4 },
    infoValue: { fontSize: 13, fontWeight: 'bold', color: '#333' },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#007AFF', paddingLeft: 10 },
    descricao: { fontSize: 16, color: '#555', lineHeight: 24, textAlign: 'left' },
    enderecoTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    endereco: { fontSize: 14, color: '#666', marginBottom: 10 },
    mapContainer: { height: 200, width: '100%', borderRadius: 15, overflow: 'hidden', marginTop: 15, borderWidth: 1, borderColor: '#eee', position: 'relative', backgroundColor: '#e0e0e0' },
    mapWebView: { flex: 1, backgroundColor: 'transparent' },
    mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'transparent' },
    gpsButton: { flexDirection: 'row', backgroundColor: '#28a745', padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
    gpsButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default CampanhaDetalheScreen;