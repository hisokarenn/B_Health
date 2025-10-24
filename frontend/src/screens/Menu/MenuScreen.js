// frontend/src/screens/Menu/MenuScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';

const MenuItem = ({ title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
);

const MenuScreen = ({ setScreen, pacienteInfo }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Olá, {pacienteInfo.nome}!</Text>
            <Text style={styles.subtitle}>Selecione uma opção:</Text>

            <MenuItem 
                title="Histórico de Vacinas (RF03)" 
                onPress={() => setScreen('historico')} 
            />
            
            <MenuItem 
                title="Visualizar Campanhas (RF04)" 
                onPress={() => setScreen('campanhas')} 
            />

            <TouchableOpacity style={styles.logoutButton} onPress={() => setScreen('login')}>
                <Text style={styles.logoutText}>Sair (Logout)</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 30, paddingTop: 50 },
    welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
    menuItem: {
        backgroundColor: '#007AFF',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    menuText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 50,
        alignItems: 'center',
    },
    logoutText: {
        color: 'red',
        fontSize: 16,
    }
});

export default MenuScreen;