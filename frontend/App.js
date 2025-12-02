import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Importa todas as telas
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
   
  // Estado para guardar os dados da campanha clicada
  const [campanhaSelecionada, setCampanhaSelecionada] = useState(null);

  // Função chamada quando o login é bem-sucedido no LoginScreen
  const handleSuccessfulLogin = (userInfo) => {
    // userInfo agora vem direto como o objeto User do firebase (conforme alteramos no authService)
    setPacienteInfo(userInfo);
    setCurrentScreen('menu');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        // Limpa dados anteriores ao voltar pro login
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
                onSelectCampanha={(item) => {
                    setCampanhaSelecionada(item); // Salva os dados
                    setCurrentScreen('campanhaDetalhe'); // Muda a tela
                }}
                setScreen={setCurrentScreen}
              />
            </View>
          </ScreenTransition>
        );

      case 'campanhaDetalhe':
        return (
          <ScreenTransition>
            <CampanhaDetalheScreen 
                campanhaDados={campanhaSelecionada} // Passa os dados salvos
                setScreen={setCurrentScreen} 
            />
          </ScreenTransition>
        );

      case 'notificacoes':
        return (
          <ScreenTransition>
            <NotificacoesScreen 
                setScreen={setCurrentScreen} 
                // AQUI: Passamos a função para selecionar a campanha e ir para DETALHES
                onSelectCampanha={(item) => {
                    setCampanhaSelecionada(item); 
                    setCurrentScreen('campanhaDetalhe'); 
                }}
            />
          </ScreenTransition>
        );

      case 'perfil':
        return(
          <ScreenTransition>
            <PerfilScreen 
                pacienteInfo={pacienteInfo} 
                setScreen={setCurrentScreen}
            /> 
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