import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import LoginScreen from './src/screens/Login/LoginScreen';
import CadastroScreen from './src/screens/Cadastro/CadastroScreen';
import MenuScreen from './src/screens/Menu/MenuScreen'; 
import HistoricoScreen from './src/screens/Historico/HistoricoScreen';
import CampanhasScreen from './src/screens/Campanhas/CampanhasScreen'; 
import PerfilScreen from "./src/screens/Perfil/PerfilScreen";
import CampanhaDetalheScreen from './src/screens/CampanhaDetalhe/CampanhaDetalheScreen'; 
import NotificacoesScreen from './src/screens/Notificacoes/NotificacoesScreen'; 
import InicioScreen from './src/screens/Inicio/InicioScreen';
import ScreenTransition from "./src/components/ScreenTransition";
import BottomNav from './src/components/BarraNavegacao';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from './src/services/firebaseConfig';

export default function App() {
  const [pacienteInfo, setPacienteInfo] = useState(null); 
  const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('inicio'); 
  const [temNotificacao, setTemNotificacao] = useState(false);

  const checarNotificacoes = async () => {
    try {
        const snapshot = await getDocs(collection(db, "campanhas"));
        const totalCampanhasIds = snapshot.docs.map(doc => doc.id);

        const lidasStorage = await AsyncStorage.getItem('@notificacoes_lidas');
        const idsLidas = lidasStorage ? JSON.parse(lidasStorage) : [];

        const haNovas = totalCampanhasIds.some(id => !idsLidas.includes(id));
        setTemNotificacao(haNovas);
    } catch (error) {
        console.log("Erro ao verificar notificações:", error);
    }
  };

  useEffect(() => {
    if (pacienteInfo) {
      checarNotificacoes();
    }
  }, [currentScreen, pacienteInfo]);

  const handleSuccessfulLogin = (userInfo) => {
    setPacienteInfo(userInfo);
    setCurrentScreen('menu');
  };

  const renderScreen = () => {
    switch (currentScreen) {

      case 'inicio':
        return <InicioScreen setScreen={setCurrentScreen} />;

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
            checarNotificacoes={checarNotificacoes}
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
              onCampanhasAccessed={checarNotificacoes}
            />
          </View>
        );

      case 'campanhaDetalhe':
        return (
          <CampanhaDetalheScreen 
            campanhaDados={campanhaSelecionada}
            setScreen={setCurrentScreen}
            onDetailAccessed={checarNotificacoes}
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
            onNotificationsAccessed={checarNotificacoes}
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

  const showBottomNav = pacienteInfo && 
    ['menu', 'historico', 'campanhas', 'perfil', 'notificacoes', 'campanhaDetalhe'].includes(currentScreen);

  return (
    <View style={styles.rootContainer}>
      <ScreenTransition screenKey={currentScreen}>
        {renderScreen()}
      </ScreenTransition>
    
      {showBottomNav && (
          <BottomNav
            style={styles.navBar}
            active={currentScreen} 
            setScreen={setCurrentScreen} 
            temNotificacao={temNotificacao} 
          />
      )}
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

  navBar: {
    marginBottom: 20
  }

});