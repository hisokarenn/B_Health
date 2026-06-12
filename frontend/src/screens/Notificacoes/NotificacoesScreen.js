import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context"; 
import { Ionicons } from "@expo/vector-icons";
import {
  buscarCampanhasNaoLidas,
  marcarNotificacaoComoLida,
  obterCampanhaId,
} from '../../utilitarios/Notificacoes';

const { width, height } = Dimensions.get("window");
const IMAGEM_PLACEHOLDER = require('../../../assets/bhealth.png');

const obterImagemCampanha = (item) => {
  const uri = String(item?.imagemUrl || item?.imagem_url || '').trim();
  return /^https?:\/\//i.test(uri) ? { uri } : IMAGEM_PLACEHOLDER;
};

const NotificacaoItem = ({ item, onPress, disabled }) => {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const imagemCampanha = imagemFalhou ? IMAGEM_PLACEHOLDER : obterImagemCampanha(item);

  return (
    <TouchableOpacity 
      style={[styles.card, disabled && styles.cardDesabilitado]} 
      onPress={() => onPress(item)}
      activeOpacity={0.9}
      disabled={disabled}
    >
      <View style={styles.badgeNew}>
        <Ionicons name="sparkles" size={14} color="#3b8214ff" style={{marginRight: 8}}/>
        <Text style={styles.badgeText}>Nova campanha publicada!</Text>
      </View>

      <Image
        source={imagemCampanha}
        style={styles.cardImage}
        onError={() => setImagemFalhou(true)}
      />

      <Text style={styles.cardTitle}>{item.nome || item.titulo || "Nova Campanha de Vacinação"}</Text>

      <View style={styles.divisor} />
      
      <View style={styles.footerCard}>
        {disabled ? (
          <ActivityIndicator size="small" color="#0f3a72ff" />
        ) : (
          <Text style={styles.clickHint}>Toque para ver</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const NotificacoesScreen = ({
  setScreen,
  onSelectCampanha,
  onNotificationsAccessed,
  pacienteInfo,
}) => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [processandoId, setProcessandoId] = useState('');

  const uidUsuario = pacienteInfo?.uid;

  const carregarNotificacoes = useCallback(async () => {
    try {
      setLoading(true);
      setErro('');
      setMensagem('');

      const naoLidas = await buscarCampanhasNaoLidas(uidUsuario);
      setNotificacoes(naoLidas);

      if (naoLidas.length === 0) {
        setMensagem('Nenhuma campanha nova');
      }
    } catch (error) {
      console.error("Erro ao carregar notificações", error);
      setNotificacoes([]);
      setErro('Não foi possível carregar suas notificações. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [uidUsuario]);

  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  const handleAbrirCampanha = async (campanha) => {
    const campanhaId = obterCampanhaId(campanha);

    try {
      setProcessandoId(campanhaId);
      setErro('');
      setMensagem('');

      const resultado = await marcarNotificacaoComoLida(campanhaId, uidUsuario);

      if (!resultado.sincronizado && resultado.mensagem) {
        setMensagem(resultado.mensagem);
        Alert.alert('Sincronização pendente', resultado.mensagem);
      }

      setNotificacoes(prev => prev.filter(item => obterCampanhaId(item) !== campanhaId));

      if (onNotificationsAccessed) {
        await onNotificationsAccessed();
      }

      if (onSelectCampanha) {
          onSelectCampanha(campanha);
      } else {
          setScreen("campanhas");
      }

    } catch (error) {
      console.error("Erro ao salvar leitura da notificação", error);
      setErro(error.message || 'Não foi possível marcar a notificação como lida.');
    } finally {
      setProcessandoId('');
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
                <Ionicons
                  name={erro ? 'alert-circle-outline' : 'notifications-off-outline'}
                  size={60}
                  color={erro ? '#B42318' : '#ccc'}
                />
                <Text style={[styles.emptyText, erro && styles.errorText]}>
                  {erro || mensagem || 'Nenhuma campanha nova'}
                </Text>
                {erro ? (
                  <TouchableOpacity style={styles.retryButton} onPress={carregarNotificacoes}>
                    <Ionicons name="refresh-outline" size={width * 0.05} color="#FFFFFF" />
                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                  </TouchableOpacity>
                ) : null}
            </View>
        ) : (
          <>
            {mensagem ? (
              <View style={styles.statusCard}>
                <Ionicons name="information-circle-outline" size={18} color="#0f3a72ff" />
                <Text style={styles.statusText}>{mensagem}</Text>
              </View>
            ) : null}

            <FlatList
                data={notificacoes}
                keyExtractor={(item) => obterCampanhaId(item)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <NotificacaoItem
                      item={item}
                      onPress={handleAbrirCampanha}
                      disabled={processandoId === obterCampanhaId(item)}
                    />
                )}
            />
          </>
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
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: width * 0.08,
  },

  errorText: {
    color: '#B42318',
  },

  retryButton: {
    marginTop: height * 0.025,
    backgroundColor: '#143582ff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.014,
    borderRadius: 24,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: width * 0.04,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#B6D7FF',
    borderRadius: 14,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    padding: width * 0.035,
  },

  statusText: {
    flex: 1,
    color: '#0f3a72ff',
    marginLeft: 8,
    fontSize: width * 0.035,
    lineHeight: width * 0.048,
    fontWeight: '600',
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

  cardDesabilitado: {
    opacity: 0.7,
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
