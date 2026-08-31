import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function home({ navigation }) {
  const [imagem, setImagem] = useState(null);
  const [erro, setErro] = useState("");
  
  async function tirarFoto() {
    setErro("");
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      setErro("Permissao da camera negada.");
      return;
    }
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!resultado.canceled) setImagem(resultado.assets[0].uri);
  }

  async function escolherImagem() {
    setErro("");
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setErro("Permissao da galeria negada.");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!resultado.canceled) setImagem(resultado.assets[0].uri);
  }

  const enviarArquivo = async (imagemSelecionada) => {
    const formData = new FormData();

    data.append('image', {
      uri: imagemSelecionada.uri,
      type: 'image/jpeg',
      name: 'image.jpg'
    })

    try {
      const resposta = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      })
      const resultado = await resposta.json();
      console.log(resultado);
    } catch (error){
      console.error('Erro no upload: ' ,error);
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>App Escola</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Cadastro")}
      >
        <Text style={styles.textoBotao}>Tela cadastro</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("login")}
      >
        <Text style={styles.textoBotao}>Tela Login</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.titulo}>Minha foto</Text>
        {imagem && <Image source={{ uri: imagem }} style={styles.foto} />}
        {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        <Pressable onPress={tirarFoto} style={styles.botao}>
          <Text>Tirar foto</Text>
        </Pressable>
        <Pressable onPress={escolherImagem} style={styles.botao}>
          <Text>Escolher da galeria</Text>
        </Pressable>
      </View>

      {imagem ? (
        <Image
          source={{ uri: imagem }}
          style={{ width: 220, height: 220, borderRadius: 12 }}
        />
      ) : (
        <Text>Nenhuma imagem selecionada.</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },

  nomeFilme: {
    fontSize: 16,
    fontWeight: "bold",
  },

  generoFilme: {
    fontSize: 14,
    color: "#666",
  },

  botao: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  textoBotao: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
