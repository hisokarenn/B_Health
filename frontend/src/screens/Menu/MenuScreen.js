import React, { useState, useEffect, useCallback } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, Platform, Image, Dimensions
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context"; 
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../../components/BarraNavegacao";          
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../services/firebaseConfig'; // Verifique se o caminho está correto para seu projeto

const { width, height } = Dimensions.get("window");

const MenuScreen = ({ setScreen, pacienteInfo }) => {
    const [modalVisibleImp, setModalVisibleImp] = useState(false);
    const [modalVisibleFale, setModalVisibleFale] = useState(false);
    const [modalVisibleNos, setModalVisibleNos] = useState(false);
    
    // Estado para controlar a bolinha de notificação
    const [temNotificacao, setTemNotificacao] = useState(false);

    // Lógica para verificar notificações novas
    const checarNotificacoes = async () => {
        try {
            // 1. Busca todas as campanhas do banco
            const snapshot = await getDocs(collection(db, "campanhas"));
            const totalCampanhasIds = snapshot.docs.map(doc => doc.id);

            // 2. Busca quais já foram lidas no AsyncStorage
            const lidasStorage = await AsyncStorage.getItem('@notificacoes_lidas');
            const idsLidas = lidasStorage ? JSON.parse(lidasStorage) : [];

            // 3. Se existe algum ID no banco que NÃO está nas lidas, ativa a bolinha
            const haNovas = totalCampanhasIds.some(id => !idsLidas.includes(id));
            setTemNotificacao(haNovas);
        } catch (error) {
            console.log("Erro ao verificar notificações:", error);
        }
    };

    // Verifica sempre que a tela é montada
    useEffect(() => {
        checarNotificacoes();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Deseja realmente sair?",
            "Você será desconectado do aplicativo.",
            [
                { text: "Não", style: "cancel" },
                { text: "Sair", style: "destructive", onPress: () => setScreen("login") }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                {/*scroll bar*/}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: height * 0.15 }}
                    showsVerticalScrollIndicator
                >

                {/*cabecalhor*/}
                <LinearGradient
                    colors={["#0b4786ff", "#001c42ff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View>
                        <Image
                            source={require('../../../assets/bhealth.png')}
                            style={styles.logo}
                        />

                        <Text style={styles.cabecalhoTitulo}>
                            Seja bem-vindo(a) ao{"\n"}B Health
                        </Text>
                        
                        <Text style={styles.cabSubtitulo}>Olá, {pacienteInfo?.displayName || "Usuário"}!</Text>
                    
                    </View>

                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={width * 0.065} color="white" />
                    </TouchableOpacity>
                </LinearGradient>

                    <Text style={styles.secaoTitulo}>Minha Carteira</Text>

                    <TouchableOpacity
                        style={styles.bigBtn}
                        onPress={() => setScreen("historico")}
                    >
                        <Text style={styles.bigBtnTexto}>Carteira de {"\n"}Vacina</Text>
                        <Ionicons style={styles.iconeBigBtn} name="document-text-outline" size={width * 0.14} color="white"/>
                    </TouchableOpacity>

                    <Text style={styles.secaoTitulo}>Ações de Vacinação</Text>

                        <TouchableOpacity style={styles.miniBtn} onPress={() => setScreen("campanhas")}>
                            <Text style={styles.miniBtnTexto}>Campanhas</Text>
                            <Ionicons style={styles.miniIcones} name="megaphone-outline" size={width * 0.07} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.miniBtn} onPress={() => setScreen("menu")}>
                            <Text style={styles.miniBtnTexto}>Informações Vacinais</Text>
                            <Ionicons style={styles.miniIcones} name="information-circle-outline" size={width * 0.07} color="white" />
                        </TouchableOpacity>

                    {/*ajuda e informações*/}
                    <Text style={styles.secaoTitulo}>Ajuda e Informações</Text>

                    <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisibleImp(true)}>
                        <Ionicons name="alert-circle-outline" size={width * 0.07} color="#313B8D" />
                        <Text style={styles.infoBtnText}>Importância da Vacina</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisibleFale(true)}>
                        <Ionicons name="call-outline" size={width * 0.07} color="#313B8D" />
                        <Text style={styles.infoBtnText}>Fale conosco</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoBtn} onPress={() => setModalVisibleNos(true)}>
                        <Ionicons name="people-circle-outline" size={width * 0.07} color="#313B8D" />
                        <Text style={styles.infoBtnText}>Sobre nós</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/*chamando o componente barraNavegação COM a nova prop temNotificacao*/}
                <BottomNav active="home" setScreen={setScreen} temNotificacao={temNotificacao} />

                {/*modal - importancia*/}
                <Modal visible={modalVisibleImp} transparent animationType="fade">
                    <View style={styles.ModalImportancia}>
                        <View style={styles.ImpModal}>
                            <Text style={styles.ImpModalTitulo}>Importância</Text>

                            <Text style={styles.ImpModalTexto}>
                                Conforme a Sociedade Brasileira de Imunizações (SBIm),
                                a vacina gera imunidade e contribui para o controle e
                                eliminação de doenças causadas por vírus e bactérias.
                            </Text>

                            <TouchableOpacity
                                style={styles.FecharModal}
                                onPress={() => setModalVisibleImp(false)}
                            >
                                <Text style={{ color: "white" }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/*modal - contato*/}
                <Modal visible={modalVisibleFale} transparent animationType="fade">
                    <View style={styles.ModalFale}>
                        <View style={styles.FaleModal}>
                            <Text style={styles.FaleModalTitulo}>Fale Conosco</Text>

                            <Text style={styles.FaleModalTexto}>
                                Contato: (92) 99121-9076{"\n"}
                                Email: bhealth@org.com.br{"\n"}
                                2089, R. Nossa Sra. do Rosário,{"\n"}
                                1951, Itacoatiara - AM{"\n"}
                                69100-000
                            </Text>

                            <TouchableOpacity
                                style={styles.FecharModal}
                                onPress={() => setModalVisibleFale(false)}
                            >
                                <Text style={{ color: "white" }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/*modal - sobreNos*/}
                <Modal visible={modalVisibleNos} transparent animationType="fade">
                    <View style={styles.ModalSobreNos}>
                        <View style={styles.SobreNosModal}>
                            <Text style={styles.NosModalTitulo}>Sobre Nós</Text>

                            <Text style={styles.NosModalTexto}>
                                Nós somos uma equipe de estudantes
                                de Engenharia de Software da Universidade
                                Federal do Amazonas (UFAM).
                            </Text>

                            <TouchableOpacity
                                style={styles.FecharModal}
                                onPress={() => setModalVisibleNos(false)}
                            >
                                <Text style={{ color: "white" }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
        backgroundColor: "#fff" 
    },

    //cabeçalho
    header: {
        paddingTop: Platform.OS === "android" ? 0 : 0,
        paddingBottom: height * 0.04,
        paddingHorizontal: width * 0.05,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logo: {
        width: width * 0.17,
        height: width * 0.17,
        tintColor: "#fff",
        marginLeft: width * 0.03,
        marginTop: height * 0.03
    },

    cabecalhoTitulo: {
        color: "white",
        fontSize: width * 0.04,
        fontWeight: "bold",
        lineHeight: width * 0.065,
        marginTop: height * -0.075,
        marginLeft: width * 0.25,
    },

    cabSubtitulo: {
        color: "rgba(255,255,255,0.9)",
        marginTop: height * 0.005,
        fontSize: width * 0.035,
        marginLeft: width * 0.25,
    },

    logoutBtn: {
        padding: width * 0.02,
        borderRadius: 10,
    },

    //seção de titluos
    secaoTitulo: {
        marginTop: height * 0.02,
        marginLeft: width * 0.05,
        fontSize: width * 0.045,
        color: "#444",
        fontWeight: "bold",
    },

    //carteira
    bigBtn: {
        width: width * 0.88,
        backgroundColor: "#6c9fd9ff",
        marginTop: height * 0.02,
        padding: width * 0.06,
        borderRadius: 28,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "center",
        height: height * 0.16,
        elevation: 9,
    },

    bigBtnTexto: {
        color: "white",
        fontSize: width * 0.065,
        fontWeight: "bold",
        width: "60%",
    },

    iconeBigBtn: {
        alignSelf: "center",
    },

    //mini botões
    miniBtn: {
        backgroundColor: "#2b61b7ff",
        width: width * 0.88,
        height: height * 0.065,
        paddingHorizontal: width * 0.04,
        borderRadius: 20,
        justifyContent: "center",
        alignSelf: "center",
        elevation: 9,
        marginTop: height * 0.015,
    },

    miniBtnTexto: {
        color: "white",
        fontWeight: "bold",
        fontSize: width * 0.040,
    },

    miniIcones: {
        position: "absolute",
        right: width * 0.05,
        top: height * 0.015,
    },

    //Informações Btn
    infoBtn: {
        backgroundColor: "#dfeef5ff",
        padding: width * 0.035,
        marginHorizontal: width * 0.08,
        marginTop: height * 0.02,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: width * 0.04,
        elevation: 5,
        alignSelf: "center",
        width: width * 0.85,
    },

    infoBtnText: {
        fontSize: width * 0.043,
        color: "#333",
    },

    //Modal Importancia
    ModalImportancia: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    ImpModal: {
        backgroundColor: "white",
        width: width * 0.80,
        padding: width * 0.06,
        borderRadius: 20,
    },

    ImpModalTitulo: {
        fontSize: width * 0.055,
        fontWeight: "bold",
        marginBottom: 15,
    },

    ImpModalTexto: {
        fontSize: width * 0.04,
        lineHeight: width * 0.055,
        color: "#555",
    },

    //Modal Fale Conosco
    ModalFale: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    FaleModal: {
        backgroundColor: "white",
        width: width * 0.80,
        padding: width * 0.06,
        borderRadius: 20,
    },

    FaleModalTitulo: {
        fontSize: width * 0.055,
        fontWeight: "bold",
        marginBottom: 15,
    },

    FaleModalTexto: {
        fontSize: width * 0.04,
        lineHeight: width * 0.055,
        color: "#555",
    },

    //Modal Sobre Nós
    ModalSobreNos: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    SobreNosModal: {
        backgroundColor: "white",
        width: width * 0.80,
        padding: width * 0.06,
        borderRadius: 20,
    },

    NosModalTitulo: {
        fontSize: width * 0.055,
        fontWeight: "bold",
        marginBottom: 15,
    },

    NosModalTexto: {
        fontSize: width * 0.04,
        lineHeight: width * 0.055,
        color: "#555",
    },

    //fechar modal
    FecharModal: {
        backgroundColor: "#5758b9ff",
        marginTop: height * 0.02,
        padding: width * 0.03,
        borderRadius: 15,
        alignItems: "center",
    },
});

export default MenuScreen;