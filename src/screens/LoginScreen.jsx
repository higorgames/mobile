import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import { useState } from "react";

import api from "../services/api";

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert(
        "Atenção",
        "Preencha o e-mail e a senha."
      );
      return;
    }

    try {
      const response = await api.post("/users/login", {
        email: email,
        password: password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);

      Alert.alert(
        "Sucesso",
        "Login realizado com sucesso!"
      );

      navigation.navigate("Tabs");

    } catch (error) {
      console.log("Erro no login:", error);

      Alert.alert(
        "Login inválido",
        "E-mail ou senha inválidos."
      );
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Faça seu login</Text>

      <Text style={styles.label}>E-mail</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Não possui uma conta?{" "}

        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate("Cadastro")}
        >
          Cadastre-se
        </Text>
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
  },

  label: {
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginTop: 20
  },

  input: {
    width: "100%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    outlineStyle: "none"
  },

  button: {
    marginTop: 30,
    backgroundColor: "#4A5D23",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "50%",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },

  registerText: {
    marginTop: 20,
    textAlign: "center"
  },

  registerLink: {
    color: "#4A5D23",
    fontWeight: "bold"
  }
});