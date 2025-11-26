import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { getCampanhas } from '../../services/authService';
import { Ionicons } from '@expo/vector-icons';

const CampanhaItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.7}>
        {/* Imagem da Campanha (Topo do Card) */}
        <Image 
            source={{ uri: item.imagem_url || 'https://via.placeholder.com/300x150' }} 
            style={styles.cardImage} 
            resizeMode="cover"
        />
        
        <View style={styles.cardContent}>
            <Text style={styles.campanhaTitulo}>{item.titulo}</Text>
            
            <View style={styles.row}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.dataText}> {item.data_inicio} até {item.data_fim}</Text>
            </View>

            <Text style={styles.tipoBadge}>{item.tipo_vacina}</Text>
            
            <Text style={styles.clickHint}>Toque para ver detalhes e mapa</Text>
        </View>
    </TouchableOpacity>
);

// Recebe a função onSelectCampanha do App.js
const CampanhasScreen = ({ onSelectCampanha }) => { 
    const [campanhas, setCampanhas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Buscando campanhas ativas...');

    useEffect(() => {
        const fetchCampanhas = async () => {
            try {
                const response = await getCampanhas();
                if (response.data.campanhas && response.data.campanhas.length > 0) {
                    setCampanhas(response.data.campanhas);
                } else {
                    setMessage('Nenhuma campanha ativa no momento.');
                }
            } catch (error) {
                setMessage('Erro ao carregar campanhas.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampanhas();
    }, []);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.messageText}>{message}</Text>
            </View>
        );
    }

    if (campanhas.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.messageText}>{message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Campanhas Disponíveis</Text>
            <FlatList
                data={campanhas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <CampanhaItem item={item} onPress={onSelectCampanha} />}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#00245aff', marginBottom: 20, textAlign: 'center' },
    
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        elevation: 4, // Sombra Android
        shadowColor: '#000', // Sombra iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden'
    },
    cardImage: {
        width: '100%',
        height: 150,
    },
    cardContent: {
        padding: 15,
    },
    campanhaTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dataText: {
        fontSize: 14,
        color: '#555',
        marginLeft: 5,
    },
    tipoBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#e3f2fd',
        color: '#007AFF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10
    },
    clickHint: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        fontStyle: 'italic'
    },
    messageText: { marginTop: 10, color: '#666' }
});

export default CampanhasScreen;