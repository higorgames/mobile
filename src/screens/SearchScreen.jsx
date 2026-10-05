import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import api from "../services/api";

export default function SearchScreen() {
  const [pesquisa, setPesquisa] = useState("");
  const [plantas, setPlantas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const imagemProvisoria =
    "https://images.unsplash.com/photo-1545241047-6083a3684587";

const buscarPlantas = async (nome = "") => {
  try {
    setCarregando(true);
    setErro("");

    console.log("Pesquisando:", nome);

    const response = await api.get("/plants", {
      params: nome.trim() !== "" ? { nome: nome.trim() } : {},
    });

    console.log("Resposta da API:", response.data);

    setPlantas(response.data);
  } catch (error) {
    console.log("Erro ao buscar plantas:", error);

    setErro("Não foi possível carregar as plantas.");
    setPlantas([]);
  } finally {
    setCarregando(false);
  }
};

  useEffect(() => {
    const tempo = setTimeout(() => {
      buscarPlantas(pesquisa);
    }, 400);

    return () => clearTimeout(tempo);
  }, [pesquisa]);

  const renderPlanta = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.imagem || imagemProvisoria,
        }}
        style={styles.cardImage}
      />

      <View style={styles.cardContent}>
        <Text style={styles.plantName}>
          {item.nome}
        </Text>

        <Text style={styles.price}>
          R$ {Number(item.preco).toFixed(2).replace(".", ",")}
        </Text>

        <Text style={styles.quantity}>
          Quantidade: {item.quantidade}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pesquisar plantas
      </Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquisar plantas..."
          placeholderTextColor="#666"
          style={styles.input}
          value={pesquisa}
          onChangeText={setPesquisa}
        />

        <Ionicons
          name="search"
          size={20}
          color="#000000"
          style={styles.icon}
        />
      </View>

      {carregando ? (
        <ActivityIndicator
          size="large"
          color="#4A5D23"
          style={styles.loading}
        />
      ) : erro ? (
        <Text style={styles.message}>
          {erro}
        </Text>
      ) : plantas.length === 0 ? (
        <Text style={styles.message}>
          Nenhuma planta encontrada.
        </Text>
      ) : (
        <FlatList
          data={plantas}
          keyExtractor={(item) =>
            item.id_plantas.toString()
          }
          renderItem={renderPlanta}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4A5D23",
    marginBottom: 20,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9e2d5",
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  icon: {
    marginLeft: 10,
  },

  loading: {
    marginTop: 40,
  },

  message: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },

  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },

  cardContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },

  plantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },

  price: {
    fontSize: 16,
    color: "#4A5D23",
    fontWeight: "bold",
    marginTop: 5,
  },

  quantity: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});