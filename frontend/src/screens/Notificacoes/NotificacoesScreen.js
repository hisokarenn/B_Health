import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../services/firebaseConfig';
import BottomNav from '../../components/BarraNavegacao';
import { SafeAreaView } from "react-native-safe-area-context"; 
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const NotificacoesScreen = ({ setScreen }) => {
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

      // 3. Redireciona para a tela de Campanhas
      // OBS: Aqui seria ideal passar a campanha específica se sua tela de Campanhas suportar,
      // mas como estamos usando setScreen simples, vamos apenas para a lista geral.
      setScreen("campanhas");

    } catch (error) {
      console.log("Erro ao salvar leitura da notificação", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        
        {/* Cabeçalho Simples */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Notificações</Text>
        </View>

        {loading ? (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#143582ff" />
            </View>
        ) : notificacoes.length === 0 ? (
            // Tela Vazia
            <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Nenhuma campanha nova</Text>
            </View>
        ) : (
            // Lista de Notificações
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
                            <Ionicons name="sparkles" size={14} color="#143582ff" style={{marginRight: 5}}/>
                            <Text style={styles.badgeText}>Nova campanha publicada!</Text>
                        </View>

                        {/* Tenta renderizar imagem se existir */}
                        {item.imagemUrl ? (
                            <Image source={{ uri: item.imagemUrl }} style={styles.cardImage} />
                        ) : null}

                        <Text style={styles.cardTitle}>{item.nome || item.titulo || "Nova Campanha de Vacinação"}</Text>
                        
                        <View style={styles.footerCard}>
                            <Text style={styles.clickHint}>Toque para ver</Text>
                            <Ionicons name="chevron-forward" size={16} color="#28a745" />
                        </View>
                    </TouchableOpacity>
                )}
            />
        )}

        {/* Barra de Navegação - Ativa em 'notificacoes' */}
        {/* Passamos temNotificacao={notificacoes.length > 0} para a bolinha continuar acesa se ainda houver itens na lista */}
        <BottomNav 
            active="notificacoes" 
            setScreen={setScreen} 
            temNotificacao={notificacoes.length > 0} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#143582ff"
  },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingBottom: 100 // espaço para nav
  },
  emptyText: { 
    marginTop: 15,
    fontSize: 16, 
    color: '#888', 
    fontWeight: '500' 
  },

  listContent: {
    padding: 20,
    paddingBottom: 120 // Espaço extra para não ficar atrás da BottomNav
  },
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  badgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#143582ff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
    backgroundColor: '#eee'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  clickHint: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
    marginRight: 2
  }
});

export default NotificacoesScreen;