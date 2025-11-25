import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

// Importa todas as telas
import LoginScreen from './src/screens/Login/LoginScreen';
import CadastroScreen from './src/screens/Cadastro/CadastroScreen';
import MenuScreen from './src/screens/Menu/MenuScreen'; 
import HistoricoScreen from './src/screens/Historico/HistoricoScreen';
import CampanhasScreen from './src/screens/Campanhas/CampanhasScreen'; 
import ScreenTransition from "./src/components/ScreenTransition";
import PerfilScreen from "./src/screens/Perfil/PerfilScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [pacienteInfo, setPacienteInfo] = useState(null); 

  const handleSuccessfulLogin = (userInfo) => {
    setPacienteInfo(userInfo);
    setCurrentScreen('menu');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        if (pacienteInfo) setPacienteInfo(null);
        return (
          <ScreenTransition>
            <LoginScreen setScreen={setCurrentScreen} onLoginSuccess={handleSuccessfulLogin} />
          </ScreenTransition>
        );

      case 'cadastro':
        return (
          <ScreenTransition>
            <CadastroScreen setScreen={setCurrentScreen} />
          </ScreenTransition>
        );

      case 'menu':
        return (
          <ScreenTransition>
            <MenuScreen setScreen={setCurrentScreen} pacienteInfo={pacienteInfo} />
          </ScreenTransition>
        );

      case 'historico':
        if (!pacienteInfo) return <Text>Erro: Usuário não autenticado.</Text>;
        return (
          <ScreenTransition>
            <HistoricoScreen pacienteId={pacienteInfo.uid} setScreen={setCurrentScreen} />
          </ScreenTransition>
        );

      case 'campanhas':
        return (
          <ScreenTransition>
            <View style={styles.fullScreen}>
              <CampanhasScreen />
              <Button title="Voltar ao Menu" onPress={() => setCurrentScreen('menu')} />
            </View>
          </ScreenTransition>
        );

      case 'perfil':
        return(
          <ScreenTransition>
            <TouchableOpacity style={styles.btn} onPress={() => setCurrentScreen("menu")}>
              <Text>Voltar</Text>
            </TouchableOpacity>
            <PerfilScreen/> 
          </ScreenTransition>
        );

      default:
        return (
          <ScreenTransition>
            <LoginScreen setScreen={setCurrentScreen} onLoginSuccess={handleSuccessfulLogin} />
          </ScreenTransition>
        );
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
  },

  btn: {
    backgroundColor: "#cdcefcff",
    marginTop: 80,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    width: 90,
    alignSelf: "flex-start",
    marginLeft: 20,
},

});