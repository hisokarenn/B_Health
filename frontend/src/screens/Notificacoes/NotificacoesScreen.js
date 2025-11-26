import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator 
} from 'react-native';
import { getCampanhas } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const NotificacaoItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
        <View style={styles.row}>
            {/* Miniatura da imagem */}
            <Image 
                source={{ uri: item.imagem_url || 'https://via.placeholder.com/100' }} 
                style={styles.thumb} 
            />
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.newBadge}>NOVA</Text>
                    <Text style={styles.dateText}>Publicado recentemente</Text>
                </View>
                <Text style={styles.title}>Nova campanha publicada!</Text>
                <Text style={styles.subtitle}>{item.titulo}</Text>
                <Text style={styles.cta}>Toque para ver detalhes</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const NotificacoesScreen = ({ setScreen, onSelectCampanha }) => {
    const [notificacoes, setNotificacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotificacoes = async () => {
            try {
                // 1. Busca todas as campanhas
                const response = await getCampanhas();
                const todasCampanhas = response.data.campanhas || [];

                // 2. Lógica de Filtro (Simulação de "Novas")
                // Na vida real, você filtraria por data > lastViewDate.
                // Para este protótipo, vamos mostrar as últimas 3 como "novas".
                // Se quiser lógica real de data, precisaríamos do campo 'createdAt' no banco.
                
                // Vamos pegar as campanhas que começam no futuro ou recentemente
                const novas = todasCampanhas.slice(0, 5); // Pega as 5 primeiras (assumindo que backend manda as mais recentes)

                setNotificacoes(novas);

                // 3. Marca como "Lidas" (Atualiza o storage local)
                await AsyncStorage.setItem('lastNotificationView', new Date().toISOString());

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificacoes();
    }, []);

    const handlePress = (campanha) => {
        // Navega para a tela de detalhes (via App.js)
        if (onSelectCampanha) {
            onSelectCampanha(campanha);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notificações</Text>
                <TouchableOpacity onPress={() => setScreen('menu')}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {notificacoes.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>Nenhuma campanha publicada recentemente.</Text>
                    <TouchableOpacity style={styles.btnVoltar} onPress={() => setScreen('menu')}>
                        <Text style={styles.btnText}>Voltar ao Início</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={notificacoes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <NotificacaoItem item={item} onPress={handlePress} />}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fa', paddingTop: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        paddingHorizontal: 20, marginBottom: 10 
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#00245aff' },
    
    list: { padding: 15 },
    card: {
        backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15,
        elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    thumb: { width: 60, height: 60, borderRadius: 30, marginRight: 15, backgroundColor: '#eee' },
    content: { flex: 1 },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    newBadge: { 
        fontSize: 10, fontWeight: 'bold', color: '#fff', backgroundColor: '#28a745', 
        paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 
    },
    dateText: { fontSize: 12, color: '#999' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 14, color: '#007AFF', marginTop: 2 },
    cta: { fontSize: 12, color: '#666', marginTop: 5, fontStyle: 'italic' },

    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20, marginBottom: 30 },
    btnVoltar: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
    btnText: { color: '#fff', fontWeight: 'bold' }
});

export default NotificacoesScreen;