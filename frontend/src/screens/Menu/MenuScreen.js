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
                    
                    {/*scroll bar horizontal*/}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator
                        contentContainerStyle={styles.horizontalScrollContent} 
                    >
                        <TouchableOpacity style={styles.miniBtn} onPress={() => setScreen("menu")}>
                            <Text style={styles.miniBtnTexto}>Mapa de{"\n"}Vacinação</Text>
                            <Ionicons style={styles.miniIcones} name="map-outline" size={width * 0.07} color="white"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.miniBtn} onPress={() => setScreen("campanhas")}>
                            <Text style={styles.miniBtnTexto}>Campanhas</Text>
                            <Ionicons style={styles.miniIcones} name="megaphone-outline" size={width * 0.07} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.miniBtn} onPress={() => setScreen("menu")}>
                            <Text style={styles.miniBtnTexto}>Informações Vacinas</Text>
                            <Ionicons style={styles.miniIcones} name="information-circle-outline" size={width * 0.07} color="white" />
                        </TouchableOpacity>
                    </ScrollView>

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
    safe: { flex: 1, backgroundColor: "#fff" },
    container: { flex: 1, backgroundColor: "#fff" },

    //cabeçalho
    header: {
        paddingTop: Platform.OS === "android" ? height * 0.04 : height * 0.03,
        paddingBottom: height * 0.040,
        paddingHorizontal: width * 0.05,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    logo: {
        width: width * 0.15,
        height: width * 0.15,
        tintColor: '#fff',
        marginRight: width * 0.02,
        marginLeft: width * 0.02,
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },

    cabecalhoTitulo: {
        color: "white",
        fontSize: width * 0.045,
        fontWeight: "bold",
        lineHeight: width * 0.065,
        marginLeft: width * 0.20,
        marginTop: height * -0.067,
    },

    cabSubtitulo: {
        color: "rgba(255,255,255,0.9)",
        marginTop: 4,
        fontSize: width * 0.035,
        marginLeft: width * 0.20,
    },

    logoutBtn: {
        padding: width * 0.01,
        borderRadius: 10,
    },

    //seção de titluos
    secaoTitulo: {
        marginTop: height * 0.020,
        marginLeft: width * 0.05,
        fontSize: width * 0.040,
        color: "#444",
        fontWeight: "bold",
    },

    //carteira
    bigBtn: {
        backgroundColor: "#6c9fd9ff",
        margin: width * 0.07,
        padding: width * 0.06,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        height: height * 0.16,
        marginTop: height * 0.020,
        shadowColor: "#000000ff",
        elevation: 2,
    },

    bigBtnTexto: {
        color: "white",
        fontSize: width * 0.07,
        fontWeight: "bold",
        marginRight: width * 0.03,
        marginLeft: width * 0.05,
    },

    iconeBigBtn: {
        marginLeft: width * 0.10,
    },

    //scrollBar horizontal
    horizontalScrollContent: {
        marginTop: height * 0.020,
        paddingLeft: width * 0.05,
        paddingRight: width * 0.03,
        gap: 8,
    },

    miniBtn: {
        backgroundColor: "#2b61b7ff",
        width: width * 0.32,
        height: width * 0.32,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 10,
        marginRight: 2,
        marginLeft: 6,
        shadowColor: "#000000d5",
        elevation: 5,
    },

    miniBtnTexto: {
        color: "white",
        fontWeight: "bold",
        textAlign: "left",
        marginTop: -2,
        fontSize: width * 0.040,
        marginLeft: width * 0.02,
    },

    miniIcones: {
        marginTop: width * 0.03,
        marginLeft: width * 0.17,
    },

    //Informações Btn
    infoBtn: {
        backgroundColor: "#dfeef5ff",
        padding: width * 0.040,
        marginHorizontal: width * 0.08,
        marginTop: 15,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        shadowColor: "#000000d5",
        elevation: 5,
        marginLeft: width * 0.08,
    },

    infoBtnText: {
        fontSize: width * 0.04,
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
        width: "80%",
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

    //Modal fale conosco
    ModalFale: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    FaleModal: {
        backgroundColor: "white",
        width: "80%",
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

    //Modal Sobre nos
    ModalSobreNos: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    SobreNosModal: {
        backgroundColor: "white",
        width: "80%",
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


    //fehcar modal
    FecharModal: {
        backgroundColor: "#5758b9ff",
        marginTop: 20,
        padding: 10,
        borderRadius: 15,
        alignItems: "center",
    },
});

export default MenuScreen;