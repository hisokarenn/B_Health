// frontend/src/screens/Historico/HistoricoScreen.js (Atualizado)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Button } from 'react-native'; 
import { getHistorico } from '../../services/authService';

// Item renderizado na lista
const HistoricoItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.vacinaNome}>{item.nome_vacina}</Text>
        <Text style={styles.itemDetalhe}>
            Dose: {item.dose} • Aplicado em: {item.data_aplicacao}
        </Text>
        <Text style={styles.unidade}>Unidade: {item.unidade_saude}</Text>
    </View>
);

const HistoricoScreen = ({ pacienteId, setScreen }) => {
    const [historico, setHistorico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Buscando histórico...');

    useEffect(() => {
        const fetchHistorico = async () => {
            try {
                const response = await getHistorico(pacienteId);

                if (response.data.historico && response.data.historico.length > 0) {
                    setHistorico(response.data.historico);
                } else {
                    setMessage(response.data.message || 'Não há registros de vacina disponíveis.');
                }
            } catch (error) {
                setMessage('Erro ao carregar o histórico. Tente novamente.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistorico();
    }, [pacienteId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.messageText}>{message}</Text>
            </View>
        );
    }

    if (!historico || historico.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.messageText}>{message}</Text>
                {/* BOTÃO PARA VOLTAR AO MENU - Caso não haja histórico */}
                <Button title="Voltar" onPress={() => setScreen('menu')} /> 
            </View>
        );
    }

    return (
        <View style={styles.historicoContainer}>
            <Text style={styles.historicoTitle}>Seu Histórico de Vacinação (RF03)</Text>
            <FlatList
                data={historico}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <HistoricoItem item={item} />}
            />
            {/* CÓDIGO ALTERADO: Botão "Voltar ao Menu Principal" em vez de Logout */}
            <View style={styles.buttonSpacing}>
                <Button 
                    title="Voltar ao Menu Principal" 
                    onPress={() => setScreen('menu')} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    historicoContainer: { flex: 1, padding: 20 },
    historicoTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#007AFF' },
    itemContainer: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    vacinaNome: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    itemDetalhe: { fontSize: 14, color: '#555', marginTop: 5 },
    unidade: { fontSize: 12, color: '#777', marginTop: 2 },
    messageText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
    buttonSpacing: { marginTop: 20 }, // Estilo para espaçamento
});

export default HistoricoScreen;