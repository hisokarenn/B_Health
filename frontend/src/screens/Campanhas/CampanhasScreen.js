import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, FlatList, ActivityIndicator, 
    TouchableOpacity, Image, StatusBar, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../services/firebaseConfig';

// Cores do Tema
const COLORS = {
    primary: "#0056D2",
    background: "#F8F9FA",
    card: "#FFFFFF",
    textDark: "#1A202C",
    textGrey: "#718096",
    white: "#FFFFFF",
};

const CampanhaItem = ({ item, onPress }) => (
    <TouchableOpacity 
        style={styles.card} 
        onPress={() => onPress(item)} 
        activeOpacity={0.9}
    >
        <View style={styles.imageContainer}>
            {/* Tenta buscar imagemUrl (padrão novo) ou imagem_url (legado) */}
            <Image 
                source={{ uri: item.imagemUrl || item.imagem_url || 'https://via.placeholder.com/600x300' }} 
                style={styles.cardImage} 
                resizeMode="cover"
            />
            {/* Badge de Data Flutuante */}
            <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>{item.data_inicio || "HOJE"}</Text>
                <Text style={styles.dateBadgeSub}>INÍCIO</Text>
            </View>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.imageOverlay}
            />
        </View>
        
        <View style={styles.cardContent}>
            <View style={styles.tagContainer}>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{item.tipo_vacina || "Vacinação"}</Text>
                </View>
                {/* Exibe o horário se existir */}
                {item.unidade_horario && (
                    <View style={[styles.tag, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="time-outline" size={12} color={COLORS.primary} style={{marginRight:4}}/>
                        <Text style={[styles.tagText, { color: COLORS.primary }]}>
                            {item.unidade_horario.split(' ')[0]}... 
                        </Text>
                    </View>
                )}
            </View>

            <Text style={styles.campanhaTitulo} numberOfLines={2}>
                {item.titulo || item.nome || "Campanha de Vacinação"}
            </Text>
            
            <View style={styles.cardFooter}>
                <Text style={styles.locationText} numberOfLines={1}>
                    <Ionicons name="location-sharp" size={14} color={COLORS.textGrey} /> 
                    {' '}{item.unidade_saude_nome || "Unidades de Saúde Parceiras"}
                </Text>
                <Ionicons name="arrow-forward-circle" size={32} color={COLORS.primary} />
            </View>
        </View>
    </TouchableOpacity>
);

const CampanhasScreen = ({ onSelectCampanha }) => { 
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Atualizando campanhas...');

    useEffect(() => {
        const fetchCampanhas = async () => {
            try {
                // BUSCA DIRETA DO FIREBASE
                const querySnapshot = await getDocs(collection(db, "campanhas"));
                const listaCampanhas = [];
                
                querySnapshot.forEach((doc) => {
                    listaCampanhas.push({ id: doc.id, ...doc.data() });
                });

                if (listaCampanhas.length > 0) {
                    setCampanhas(listaCampanhas);
                } else {
                    setMessage('Nenhuma campanha ativa no momento.');
                }
            } catch (error) {
                console.error("Erro Firebase:", error);
                setMessage('Não foi possível carregar as campanhas.');
            } finally {
                setLoading(false);
            }
        };
        fetchCampanhas();
    }, []);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Buscando informações...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Campanhas</Text>
                <Text style={styles.headerSubtitle}>Mantenha sua vacinação em dia</Text>
            </View>

            {campanhas.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="folder-open-outline" size={60} color="#CBD5E0" />
                    <Text style={styles.messageText}>{message}</Text>
                </View>
            ) : (
                <FlatList
                    data={campanhas}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <CampanhaItem item={item} onPress={onSelectCampanha} />}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 20 : 60,
        paddingBottom: 10,
        backgroundColor: COLORS.background,
    },
    headerTitle: { fontSize: 32, fontWeight: '800', color: COLORS.textDark, letterSpacing: -1 },
    headerSubtitle: { fontSize: 16, color: COLORS.textGrey, marginTop: 4 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { marginTop: 12, color: COLORS.textGrey, fontSize: 16 },
    messageText: { marginTop: 12, color: COLORS.textGrey, fontSize: 16, textAlign: 'center' },
    
    // Card Styles
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 6,
        overflow: 'hidden',
    },
    imageContainer: { height: 180, width: '100%', position: 'relative' },
    cardImage: { width: '100%', height: '100%' },
    imageOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
    dateBadge: {
        position: 'absolute', top: 15, right: 15,
        backgroundColor: COLORS.white, borderRadius: 12,
        paddingVertical: 6, paddingHorizontal: 12,
        alignItems: 'center', zIndex: 10,
        shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 5
    },
    dateBadgeText: { fontWeight: 'bold', fontSize: 14, color: COLORS.textDark },
    dateBadgeSub: { fontSize: 10, color: COLORS.textGrey, fontWeight: '800' },
    cardContent: { padding: 20 },
    tagContainer: { flexDirection: 'row', marginBottom: 10, gap: 8 },
    tag: { 
        backgroundColor: '#F0F4F8', paddingHorizontal: 10, paddingVertical: 4, 
        borderRadius: 8, flexDirection: 'row', alignItems: 'center' 
    },
    tagText: { fontSize: 12, fontWeight: '600', color: COLORS.textGrey, textTransform: 'uppercase' },
    campanhaTitulo: { fontSize: 20, fontWeight: '700', color: COLORS.textDark, lineHeight: 28, marginBottom: 12 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    locationText: { color: COLORS.textGrey, fontSize: 14, flex: 1, marginRight: 10 },
});

export default CampanhasScreen;