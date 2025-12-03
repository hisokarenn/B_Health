import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import LoginScreen from './src/screens/Login/LoginScreen';
import CadastroScreen from './src/screens/Cadastro/CadastroScreen';
import MenuScreen from './src/screens/Menu/MenuScreen'; 
import HistoricoScreen from './src/screens/Historico/HistoricoScreen';
import CampanhasScreen from './src/screens/Campanhas/CampanhasScreen'; 
import PerfilScreen from "./src/screens/Perfil/PerfilScreen";
import CampanhaDetalheScreen from './src/screens/CampanhaDetalhe/CampanhaDetalheScreen'; 
import NotificacoesScreen from './src/screens/Notificacoes/NotificacoesScreen'; 

import ScreenTransition from "./src/components/ScreenTransition";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [pacienteInfo, setPacienteInfo] = useState(null); 
  const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);

  const handleSuccessfulLogin = (userInfo) => {
    setPacienteInfo(userInfo);
    setCurrentScreen('menu');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        if (pacienteInfo) setPacienteInfo(null);
        return (
          <LoginScreen 
            setScreen={setCurrentScreen} 
            onLoginSuccess={handleSuccessfulLogin} 
          />
        );

      case 'cadastro':
        return <CadastroScreen setScreen={setCurrentScreen} />;

      case 'menu':
        return (
          <MenuScreen 
            setScreen={setCurrentScreen} 
            pacienteInfo={pacienteInfo} 
          />
        );

      case 'historico':
        if (!pacienteInfo) return <Text>Erro: Usuário não autenticado.</Text>;
        return (
          <HistoricoScreen 
            pacienteId={pacienteInfo.uid} 
            setScreen={setCurrentScreen} 
          />
        );

      case 'campanhas':
        return (
          <View style={styles.fullScreen}>
            <CampanhasScreen 
              onSelectCampanha={(item) => {
                setCampanhaSelecionada(item);
                setCurrentScreen('campanhaDetalhe');
              }}
              setScreen={setCurrentScreen}
            />
          </View>
        );

      case 'campanhaDetalhe':
        return (
          <CampanhaDetalheScreen 
            campanhaDados={campanhaSelecionada}
            setScreen={setCurrentScreen}
          />
        );

      case 'notificacoes':
        return (
          <NotificacoesScreen 
            setScreen={setCurrentScreen}
            onSelectCampanha={(item) => {
              setCampanhaSelecionada(item);
              setCurrentScreen('campanhaDetalhe');
            }}
          />
        );

      case 'perfil':
        return (
          <PerfilScreen 
            pacienteInfo={pacienteInfo} 
            setScreen={setCurrentScreen}
          />
        );

      default:
        return (
          <LoginScreen 
            setScreen={setCurrentScreen} 
            onLoginSuccess={handleSuccessfulLogin} 
          />
        );
    }
  };

  return (
    <View style={styles.rootContainer}>
      <ScreenTransition screenKey={currentScreen}>
        {renderScreen()}
      </ScreenTransition>
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
  },
});