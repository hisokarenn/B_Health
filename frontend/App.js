import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// Importa todas as telas
import LoginScreen from './src/screens/Login/LoginScreen';
import CadastroScreen from './src/screens/Cadastro/CadastroScreen';
import MenuScreen from './src/screens/Menu/MenuScreen'; 
import HistoricoScreen from './src/screens/Historico/HistoricoScreen';
import CampanhasScreen from './src/screens/Campanhas/CampanhasScreen'; 

// REMOVIDO: import ForgotPasswordScreen
// REMOVIDO: import ResetPasswordScreen

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('login'); 
    const [pacienteInfo, setPacienteInfo] = useState(null); 
    // REMOVIDO: Estado resetTokenInfo

    const handleSuccessfulLogin = (userInfo) => {
        setPacienteInfo(userInfo);
        setCurrentScreen('menu');
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'login':
                if (pacienteInfo) setPacienteInfo(null);
                return <LoginScreen setScreen={setCurrentScreen} onLoginSuccess={handleSuccessfulLogin} />;
            
            case 'cadastro':
                return <CadastroScreen setScreen={setCurrentScreen} />;
            
            // REMOVIDO: case 'forgotPassword'
            // REMOVIDO: case 'resetPassword'

            case 'menu':
                return <MenuScreen setScreen={setCurrentScreen} pacienteInfo={pacienteInfo} />;
            
            case 'historico':
                if (!pacienteInfo) return <Text>Erro: Usuário não autenticado.</Text>;
                return <HistoricoScreen pacienteId={pacienteInfo.id} setScreen={setCurrentScreen} />;
            
            case 'campanhas':
                return (
                    <View style={styles.fullScreen}>
                        <CampanhasScreen />
                        <Button title="Voltar ao Menu" onPress={() => setCurrentScreen('menu')} />
                    </View>
                );
            
            default:
                return <LoginScreen setScreen={setCurrentScreen} onLoginSuccess={handleSuccessfulLogin} />;
        }
    };

    return (
        <View style={styles.rootContainer}>
            {renderScreen()}
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    fullScreen: { 
        flex: 1,
    }
});