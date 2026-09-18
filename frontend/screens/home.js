import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
 
// endereço
const API_URL = "http://192.168.0.3:3000";
 
export default function Home({ navigation }) {
  // expo image picker
  // npx expo install expo-image-picker
  const [imagem, setImagem] = useState(null);
  const [enviando, setEnviando] = useState(false);
 
  // expo location
  // npx expo install expo-location
  const [localizacao, setLocalizacao] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
 
  // expo maps
  // npx expo install react-native-maps
  const [regiao, setRegiao] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [localAtual, setLocalAtual] = useState(null);
  const [aviso, setAviso] = useState("Obtendo localização...");
  const pontos = [
{ id: '1', nome: 'Unisinos - Campus São Leopoldo', descricao: 'Av. Unisinos, 950 - Cristo Rei',
latitude: -29.7976, longitude: -51.1518 },
{ id: '2', nome: 'Tecnosinos - Av. Theodomiro Porto da Fonseca', descricao: 'Hospital Centenário',
latitude: -29.7935, longitude: -51.1490 },
{ id: '3', nome: 'Tecnosinos - Av. SAP', descricao: 'Cristo Rei',
latitude: -29.7970, longitude: -51.1500 },
];
 
  useEffect(() => {
    let ativo = true;
    async function localizar() {
      try {
        const permissao = await Location.requestForegroundPermissionsAsync();
        if (permissao.status !== "granted") {
          if (ativo) setAviso("Permissão negada. Mapa padrão.");
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        if (!ativo) return;
        const coord = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocalAtual(coord);
        setRegiao({ ...coord, latitudeDelta: 0.02, longitudeDelta: 0.02 });
        setAviso("Localização encontrada");
      } catch (erro) {
        if (ativo) setAviso("GPS indisponível. Mapa padrão.");
      }
    }
    localizar();
    return () => {
      ativo = false;
    };
  }, []);
 
  useEffect(() => {
    buscarUltimaImagem();
  }, []);
 
  async function buscarUltimaImagem() {
    try {
      const resposta = await fetch(`${API_URL}/imagens`);
      const dados = await resposta.json();
 
      if (Array.isArray(dados) && dados.length > 0) {
        setImagem({
          uri: `${API_URL}/uploads/${encodeURIComponent(dados[0].nome_arquivo)}?v=${Date.now()}`,
        });
      }
    } catch (erro) {
      console.log("Erro ao buscar imagem existente:", erro.message);
    }
  }
 
  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à câmera para tirar uma foto.",
      );
      return;
    }
 
    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
 
    if (!resultado.canceled) setImagem(resultado.assets[0]);
  }
 
  async function escolherImagem() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à galeria para escolher uma foto.",
      );
      return;
    }
 
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });
 
    if (!resultado.canceled) setImagem(resultado.assets[0]);
  }
 
  async function enviarArquivo() {
    if (!imagem) {
      Alert.alert("Selecione ou tire uma foto antes de enviar.");
      return;
    }
 
    const formData = new FormData();
    formData.append("arquivo", {
      uri: imagem.uri,
      name: imagem.fileName || `foto-${Date.now()}.jpg`,
      type: imagem.mimeType || "image/jpeg",
    });
 
    const controlador = new AbortController();
    const tempoLimite = setTimeout(() => controlador.abort(), 15000);
 
    try {
      setEnviando(true);
      const resposta = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        signal: controlador.signal,
      });
      const corpo = await resposta.text();
      let dados;
 
      try {
        dados = JSON.parse(corpo);
      } catch {
        throw new Error(
          `O servidor respondeu em formato inválido (HTTP ${resposta.status}). Reinicie o backend.`,
        );
      }
 
      if (!resposta.ok)
        throw new Error(dados.erro || "Não foi possível enviar a foto.");
 
      Alert.alert("Sucesso", dados.mensagem);
      setImagem({
        uri: `${API_URL}/uploads/${encodeURIComponent(dados.imagem.nome_arquivo)}?v=${Date.now()}`,
      });
    } catch (erro) {
      const mensagem =
        erro.name === "AbortError"
          ? "Não foi possível alcançar o servidor em 15 segundos. Confira o IP e se o backend está rodando."
          : erro.message;
      Alert.alert("Erro ao enviar foto", mensagem);
    } finally {
      clearTimeout(tempoLimite);
      setEnviando(false);
    }
  }
 
  async function obterLocalizacao() {
    setCarregando(true);
    setErro(null);
 
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErro("Permissão de localização negada.");
        return;
      }
      const servicoAtivo = await Location.hasServicesEnabledAsync();
      if (!servicoAtivo) {
        setErro("Serviço de localização desativado.");
        return;
      }
      const resultado = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocalizacao(resultado);
    } catch (erro) {
      setErro("Ocorreu um erro ao obter a localização.");
    } finally {
      setCarregando(false);
    }
  }
 
  useEffect(() => {
    obterLocalizacao();
  }, []);
 
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
 
      <Text style={styles.subtitulo}>Minha foto</Text>
      {imagem ? (
<Image source={{ uri: imagem.uri }} style={styles.foto} />
      ) : (
<Text>Nenhuma imagem selecionada.</Text>
      )}
 
      <Pressable onPress={tirarFoto} style={styles.botao} disabled={enviando}>
<Text style={styles.textoBotao}>Tirar foto</Text>
</Pressable>
<Pressable
        onPress={escolherImagem}
        style={styles.botao}
        disabled={enviando}
>
<Text style={styles.textoBotao}>Escolher da galeria</Text>
</Pressable>
<Pressable
        onPress={enviarArquivo}
        style={styles.botao}
        disabled={enviando}
>
<Text style={styles.textoBotao}>
          {enviando ? "Enviando..." : "Enviar foto"}
</Text>
</Pressable>
 
      <View>
<Text style={styles.titulo}>Minha localização</Text>
        {carregando && <ActivityIndicator size="large" />}
        {erro && <Text style={styles.erro}>{erro}</Text>}
        {localizacao && (
<Text>
            Latitude: {localizacao.coords.latitude.toFixed(5)}
            {"\n"}
            Longitude: {localizacao.coords.longitude.toFixed(5)}
            {"\n"}
            Precisão: {Math.round(localizacao.coords.accuracy)} m
</Text>
        )}
<Pressable style={styles.botao} onPress={obterLocalizacao}>
<Text style={styles.botaoTexto}>Atualizar posição</Text>
</Pressable>
</View>
 
      <Text style={styles.titulo}>Mapa</Text>
<View style={styles.tela}>
<Text style={styles.aviso}>{aviso}</Text>
<MapView
          style={styles.mapa}
          region={regiao}
          onRegionChangeComplete={setRegiao}
>
          {localAtual && (
<Marker
              coordinate={localAtual}
              title="Você está aqui"
              pinColor="#55D6C2"
            />
          )}
          {pontos.map((p) => (
<Marker
              key={p.id}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={p.nome}
              description={p.descricao}
            />
          ))}
</MapView>
</View>
</View>
  );
}
 
const styles = StyleSheet.create({
  tela: { flex: 1 }, mapa: { flex: 1 },
  aviso: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 12 },
 
 
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
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
  foto: {
    width: 220,
    height: 220,
    borderRadius: 12,
    alignSelf: "center",
  },
  erro: { color: "#b00020" },
  botao: {
    backgroundColor: "#146C94",
    padding: 14,
    borderRadius: 8,
  },
  botaoTexto: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
