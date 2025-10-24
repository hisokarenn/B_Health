// frontend/src/screens/Campanhas/CampanhasScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { getCampanhas } from '../../services/authService';

const CampanhaItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.campanhaTitulo}>{item.titulo}</Text>
        <Text style={styles.itemDetalhe}>Tipo: {item.tipo_vacina}</Text>
        <Text style={styles.itemDetalhe}>Público: {item.publico_alvo}</Text>
        <Text style={styles.validade}>Validade: {item.data_inicio} até {item.data_fim}</Text>
        <Text style={styles.locais}>Locais: {item.locais_aplicacao}</Text>
    </View>
);

const CampanhasScreen = () => {
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
                    setMessage(response.data.message || 'Nenhuma campanha ativa no momento.');
                }
            } catch (error) {
                setMessage('Erro ao carregar campanhas. Tente novamente.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampanhas();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.messageText}>{message}</Text>
            </View>
        );
    }

    if (campanhas.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.messageText}>{message}</Text>
                {/* BOTÃO VOLTAR AO MENU - Caso não haja campanhas */}
                <View style={styles.buttonSpacing}> 
                    <Button title="Voltar ao Menu Principal" onPress={() => setScreen('menu')} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.campanhasContainer}>
            <Text style={styles.campanhasTitle}>Campanhas de Vacinação Ativas (RF04)</Text>
            <FlatList
                data={campanhas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <CampanhaItem item={item} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    campanhasContainer: { flex: 1, padding: 20 },
    campanhasTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#007AFF' },
    itemContainer: { padding: 15, marginBottom: 10, borderRadius: 8, backgroundColor: '#f0f0f0' },
    campanhaTitulo: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
    itemDetalhe: { fontSize: 14, color: '#555', marginTop: 3 },
    validade: { fontSize: 14, color: '#FF6347', fontWeight: 'bold', marginTop: 5 },
    locais: { fontSize: 12, color: '#777', marginTop: 3 },
    messageText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
    buttonSpacing: { marginTop: 20 },
});

export default CampanhasScreen;