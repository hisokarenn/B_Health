import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

// Importa todas as telas
import LoginScreen from './src/screens/Login/LoginScreen';
import CadastroScreen from './src/screens/Cadastro/CadastroScreen';
import MenuScreen from './src/screens/Menu/MenuScreen'; 
import HistoricoScreen from './src/screens/Historico/HistoricoScreen';
import CampanhasScreen from './src/screens/Campanhas/CampanhasScreen'; 
import PerfilScreen from "./src/screens/Perfil/PerfilScreen";
import CampanhaDetalheScreen from './src/screens/CampanhaDetalhe/CampanhaDetalheScreen'; // NOVO IMPORT
import NotificacoesScreen from './src/screens/Notificacoes/NotificacoesScreen'; // <--- ADICIONADO AQUI

// Importa componente de transição (se você estiver usando)
import ScreenTransition from "./src/components/ScreenTransition";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [pacienteInfo, setPacienteInfo] = useState(null); 
   
  // NOVO ESTADO: Para guardar os dados da campanha clicada
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
              <CampanhasScreen 
                // Passamos a função que captura o clique na campanha
                onSelectCampanha={(item) => {
                    setCampanhaSelecionada(item); // Salva os dados
                    setCurrentScreen('campanhaDetalhe'); // Muda a tela
                }}
              />
              <Button title="Voltar ao Menu" onPress={() => setCurrentScreen('menu')} />
            </View>
          </ScreenTransition>
        );

      // NOVO CASE: Tela de Detalhes da Campanha
      case 'campanhaDetalhe':
        return (
          <ScreenTransition>
            <CampanhaDetalheScreen 
                campanhaDados={campanhaSelecionada} // Passa os dados salvos
                setScreen={setCurrentScreen} 
            />
          </ScreenTransition>
        );

      // <--- ADICIONADO AQUI: Tela de Notificações
      case 'notificacoes':
        return (
          <ScreenTransition>
            <NotificacoesScreen setScreen={setCurrentScreen} />
          </ScreenTransition>
        );

      case 'perfil':
        return(
          <ScreenTransition>
            {/* O PerfilScreen já tem botão de voltar interno, mas mantivemos sua estrutura */}
            <PerfilScreen pacienteId={pacienteInfo.uid} setScreen={setCurrentScreen}/> 
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
    marginLeft: 20
  },
});