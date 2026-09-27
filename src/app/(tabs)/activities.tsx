import { Colors } from "@/constants/Colors";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type Activity = { id: string; title: string; date: string; notes: string; category: string; done: boolean };
const STORAGE_KEY = "cong.activities.prototype.v1";
const today = () => new Date().toLocaleDateString("en-CA");

export default function Activities() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Voluntariado");
  const [filter, setFilter] = useState("Todas");

  useEffect(() => {
    (async () => {
      try {
        const raw = Platform.OS === "web" ? localStorage.getItem(STORAGE_KEY) : await SecureStore.getItemAsync(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch { /* Dados locais indisponíveis: a agenda começa vazia. */ }
      finally { setLoaded(true); }
    })();
  }, []);
  useEffect(() => {
    if (!loaded) return;
    const raw = JSON.stringify(items);
    try {
      if (Platform.OS === "web") localStorage.setItem(STORAGE_KEY, raw);
      else SecureStore.setItemAsync(STORAGE_KEY, raw).catch(() => {});
    } catch { /* A agenda continua utilizável nesta sessão. */ }
  }, [items, loaded]);

  function add() {
    const clean = title.trim();
    if (!clean || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date + "T12:00:00").toLocaleDateString("en-CA") !== date) {
      Alert.alert("Confira a atividade", "Informe uma demanda e uma data válida no formato AAAA-MM-DD.");
      return;
    }
    setItems(current => [...current, { id: `${Date.now()}-${Math.random()}`, title: clean, date, notes: notes.trim(), category, done: false }]);
    setTitle(""); setNotes("");
  }
  function remove(id: string) {
    Alert.alert("Excluir atividade?", "Esta demanda será removida da sua agenda.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => setItems(current => current.filter(item => item.id !== id)) },
    ]);
  }
  const visible = items.filter(item => filter === "Todas" || (filter === "Pendentes" ? !item.done : item.done))
    .sort((a, b) => a.date.localeCompare(b.date) || Number(a.done) - Number(b.done));
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>SUA ROTINA NA CONG</Text>
      <Text style={styles.heading}>Atividades</Text>
      <Text style={styles.subtitle}>Organize suas demandas de desenvolvimento, voluntariado e projetos.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nova atividade</Text>
        <Text style={styles.label}>O que você precisa fazer?</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ex.: revisar a tela de cadastro" placeholderTextColor="#8A91A0" maxLength={120} />
        <Text style={styles.label}>Dia (AAAA-MM-DD)</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-09-27" keyboardType="numbers-and-punctuation" maxLength={10} />
        <Text style={styles.label}>Área</Text>
        <View style={styles.row}>{["Voluntariado", "Desenvolvimento", "Pessoal"].map(value => <Pressable key={value} onPress={() => setCategory(value)} style={[styles.chip, category === value && styles.selected]}><Text style={[styles.chipText, category === value && styles.selectedText]}>{value}</Text></Pressable>)}</View>
        <Text style={styles.label}>Observação (opcional)</Text>
        <TextInput style={[styles.input, styles.notes]} value={notes} onChangeText={setNotes} multiline textAlignVertical="top" placeholder="Detalhes, materiais ou lembretes..." placeholderTextColor="#8A91A0" maxLength={500} />
        <Pressable onPress={add} style={styles.button}><Text style={styles.buttonText}>Adicionar à rotina</Text></Pressable>
      </View>
      <Text style={styles.listHeading}>Minha agenda</Text>
      <View style={styles.row}>{["Todas", "Pendentes", "Concluídas"].map(value => <Pressable key={value} onPress={() => setFilter(value)} style={[styles.chip, filter === value && styles.selected]}><Text style={[styles.chipText, filter === value && styles.selectedText]}>{value}</Text></Pressable>)}</View>
      {visible.length === 0 ? <Text style={styles.empty}>Nenhuma atividade nesta lista. Adicione uma demanda acima para começar.</Text> : visible.map(item => (
        <View style={styles.task} key={item.id}>
          <View style={styles.taskHeader}><Text style={styles.date}>{item.date.split("-").reverse().join("/")} · {item.category}</Text><Pressable onPress={() => remove(item.id)} accessibilityLabel={`Excluir ${item.title}`}><Text style={styles.delete}>Excluir</Text></Pressable></View>
          <Text style={[styles.taskTitle, item.done && styles.done]}>{item.title}</Text>
          {item.notes ? <Text style={styles.note}>{item.notes}</Text> : null}
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: item.done }} onPress={() => setItems(current => current.map(value => value.id === item.id ? { ...value, done: !value.done } : value))} style={styles.complete}><Text style={styles.completeText}>{item.done ? "✓ Concluída · marcar pendente" : "○ Marcar como concluída"}</Text></Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: Colors.pageBackground },
  content: { padding: 20, paddingBottom: 36, gap: 12 },
  eyebrow: { fontSize: 11, fontWeight: "700", color: Colors.primary, letterSpacing: 1 },
  heading: { fontSize: 30, fontWeight: "800", color: Colors.ink },
  subtitle: { fontSize: 15, color: Colors.muted, marginBottom: 8, lineHeight: 22 },
  card: { backgroundColor: Colors.white, padding: 18, borderRadius: 20, gap: 10, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: 20, fontWeight: "700", color: Colors.ink },
  label: { fontSize: 14, fontWeight: "600", color: Colors.ink, marginTop: 6 },
  input: { minHeight: 48, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, color: Colors.ink, backgroundColor: Colors.white },
  notes: { height: 86, paddingTop: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: Colors.border, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 9, backgroundColor: Colors.white },
  selected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.ink, fontSize: 12, fontWeight: "600" },
  selectedText: { color: Colors.white },
  button: { backgroundColor: Colors.primary, borderRadius: 12, padding: 15, alignItems: "center", marginTop: 7 },
  buttonText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  listHeading: { color: Colors.ink, fontSize: 22, fontWeight: "700", marginTop: 12 },
  empty: { color: Colors.muted, textAlign: "center", padding: 25, lineHeight: 22 },
  task: { backgroundColor: Colors.white, borderColor: Colors.border, borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  taskHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  date: { color: Colors.primary, fontSize: 12, fontWeight: "700" },
  delete: { color: "#B44040", fontSize: 13 },
  taskTitle: { fontSize: 17, fontWeight: "700", color: Colors.ink },
  done: { textDecorationLine: "line-through", color: Colors.muted },
  note: { color: Colors.muted, fontSize: 14, lineHeight: 20 },
  complete: { alignSelf: "flex-start", paddingVertical: 5 },
  completeText: { color: Colors.primary, fontWeight: "600", fontSize: 13 },
});
