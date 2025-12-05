import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../services/firebaseConfig';
import { SafeAreaView } from "react-native-safe-area-context"; 
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

// Agora aceita 'onSelectCampanha' para poder enviar os dados para a tela de detalhes
const NotificacoesScreen = ({ setScreen, onSelectCampanha }) => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar e filtrar campanhas
  const carregarNotificacoes = async () => {
    try {
      setLoading(true);
      
      // 1. Busca todas as campanhas do Firebase
      const querySnapshot = await getDocs(collection(db, "campanhas"));
      const campanhasDoBanco = [];
      querySnapshot.forEach((doc) => {
        campanhasDoBanco.push({ id: doc.id, ...doc.data() });
      });

      // 2. Busca IDs já lidos do armazenamento local
      const lidasStorage = await AsyncStorage.getItem('@notificacoes_lidas');
      const idsLidas = lidasStorage ? JSON.parse(lidasStorage) : [];

      // 3. Filtra apenas as que NÃO estão salvas como lidas
      const naoLidas = campanhasDoBanco.filter(c => !idsLidas.includes(c.id));
      
      setNotificacoes(naoLidas);
    } catch (error) {
      console.error("Erro ao carregar notificações", error);
    } finally {
      setLoading(false);
    }
  };

  // Como sua navegação desmonta a tela ao sair, o useEffect funciona como o "onFocus"
  useEffect(() => {
    carregarNotificacoes();
  }, []);

  const handleAbrirCampanha = async (campanha) => {
    try {
      // 1. Salva o ID da campanha como "lido" no AsyncStorage
      const lidasStorage = await AsyncStorage.getItem('@notificacoes_lidas');
      const idsLidas = lidasStorage ? JSON.parse(lidasStorage) : [];
      
      if (!idsLidas.includes(campanha.id)) {
        const novosIds = [...idsLidas, campanha.id];
        await AsyncStorage.setItem('@notificacoes_lidas', JSON.stringify(novosIds));
      }

      // 2. Atualiza a lista da tela (remove o item clicado instantaneamente)
      setNotificacoes(prev => prev.filter(item => item.id !== campanha.id));

      // 3. Redireciona para a tela de Detalhes da Campanha
      // Usa a função passada pelo App.js para setar os dados e mudar a tela
      if (onSelectCampanha) {
          onSelectCampanha(campanha);
      } else {
          // Fallback caso a prop não tenha sido passada
          setScreen("campanhas");
      }

    } catch (error) {
      console.log("Erro ao salvar leitura da notificação", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreen('menu')}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notificações</Text>
        </View>

        {loading ? (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#143582ff" />
            </View>
        ) : notificacoes.length === 0 ? (

            <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Nenhuma campanha nova</Text>
            </View>
        ) : (
            <FlatList
                data={notificacoes}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card} 
                        onPress={() => handleAbrirCampanha(item)}
                        activeOpacity={0.9}
                    >
                        <View style={styles.badgeNew}>
                            <Ionicons name="sparkles" size={14} color="#3b8214ff" style={{marginRight: 8}}/>
                            <Text style={styles.badgeText}>Nova campanha publicada!</Text>
                        </View>

                        {item.imagemUrl ? (
                            <Image source={{ uri: item.imagemUrl }} style={styles.cardImage} />
                        ) : null}

                        <Text style={styles.cardTitle}>{item.nome || item.titulo || "Nova Campanha de Vacinação"}</Text>

                        <View style={styles.divisor} />
                        
                        <View style={styles.footerCard}>
                            <Text style={styles.clickHint}>Toque para ver</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#08366171"
  },

  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },

  header: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#052858ff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: "#f0f0f0ff",
    marginLeft: width * 0.04,
  },

  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: height * 0.15
  },

  emptyText: { 
    marginTop: 15,
    fontSize: width * 0.04, 
    color: '#888', 
    fontWeight: '500' 
  },

  listContent: {
    padding: width * 0.05,
    paddingBottom: height * 0.18
  },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: width * 0.04,
    paddingVertical: height * 0.02,
    marginBottom: height * 0.025,
    elevation: 4,
  },

  badgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#bceddd76',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.008,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: height * 0.015,
  },

  badgeText: {
    color: '#219b6eff',
    fontWeight: 'bold',
    fontSize: width * 0.03,
  },

  cardImage: {
    width: '100%',
    height: height * 0.22,
    borderRadius: 12,
    marginBottom: height * 0.015,
    resizeMode: 'cover',
    backgroundColor: '#eeeeeeff'
  },

  cardTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
  },

  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    marginTop: height * 0.002,
    backgroundColor: "#aecfef8c",
    height: height * 0.05,
    borderRadius: 15,
  },
  
  clickHint: {
    fontSize: width * 0.038,
    color: '#0f3a72ff',
    fontWeight: '600',
  },

  divisor: { 
    height: 1.5, 
    backgroundColor: '#b3b3b37d', 
    marginVertical: height * 0.015,
    borderRadius: 10, 
  },
});

export default NotificacoesScreen;