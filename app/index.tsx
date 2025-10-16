import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather, FontAwesome } from "@expo/vector-icons";

type TabKey = "search" | "bundles";

type IconName = keyof typeof Feather.glyphMap;

const SAMPLE_ENTRIES = [
  {
    id: 1,
    headword: "policy",
    reading: "",
    pos: "n.",
    tags: ["freq:alta", "diplomacia"],
    definition:
      "conjunto de diretrizes adotadas por um governo, organização ou indivíduo para orientar decisões",
    examples: [
      {
        sentence: "Foreign policy is shaped by national interests.",
        translation: "A política externa é moldada por interesses nacionais.",
      },
    ],
  },
  {
    id: 2,
    headword: "treaty",
    reading: "",
    pos: "n.",
    tags: ["direito internacional"],
    definition: "acordo formal entre Estados, regido pelo direito internacional",
    examples: [
      {
        sentence: "The treaty entered into force in 2016.",
        translation: "O tratado entrou em vigor em 2016.",
      },
    ],
  },
  {
    id: 3,
    headword: "equidistance",
    reading: "",
    pos: "n.",
    tags: ["história do Brasil"],
    definition:
      "postura de política externa que busca manter distância igual em disputas entre grandes potências",
    examples: [
      {
        sentence: "The policy of equidistance aimed to diversify partnerships.",
        translation: "A política de equidistância visava diversificar parcerias.",
      },
    ],
  },
];

const SAMPLE_BUNDLES = [
  {
    id: "en-pt-core",
    name: "Inglês → Português (Core)",
    entries: 25000,
    sizeMB: 28,
    updatedAt: "2025-10-01",
    installed: true,
    premium: false,
  },
  {
    id: "ja-pt-core",
    name: "Japonês → Português (Core)",
    entries: 18000,
    sizeMB: 22,
    updatedAt: "2025-09-20",
    installed: false,
    premium: true,
  },
  {
    id: "en-es-advanced",
    name: "Inglês → Espanhol (Avançado)",
    entries: 32000,
    sizeMB: 34,
    updatedAt: "2025-08-12",
    installed: false,
    premium: false,
  },
];

type Entry = (typeof SAMPLE_ENTRIES)[number];

type Bundle = (typeof SAMPLE_BUNDLES)[number];

function DrawerButton({
  iconName,
  label,
  isActive,
  onPress,
}: {
  iconName: IconName;
  label: string;
  isActive?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-3 rounded-2xl px-4 py-3 ${
        isActive
          ? "bg-slate-900/90"
          : "bg-transparent"
      }`}
    >
      <Feather name={iconName} size={18} color={isActive ? "#cbd5f5" : "#94a3b8"} />
      <Text
        className={`text-sm font-medium ${
          isActive ? "text-slate-100" : "text-slate-300"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Sidebar({
  activeTab,
  onNavigate,
}: {
  activeTab: TabKey;
  onNavigate: (tab: TabKey) => void;
}) {
  return (
    <View className="mr-4 hidden w-64 flex-col rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5 backdrop-blur-lg lg:flex">
      <View className="mb-6 flex-row items-center gap-3">
        <View className="items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-950/80 p-2">
          <Feather name="globe" size={20} color="#cbd5f5" />
        </View>
        <View>
          <Text className="text-base font-semibold text-slate-100">LexiPocket</Text>
          <Text className="text-xs text-slate-400">Dicionário offline</Text>
        </View>
      </View>

      <DrawerButton
        iconName="search"
        label="Buscar"
        isActive={activeTab === "search"}
        onPress={() => onNavigate("search")}
      />
      <DrawerButton
        iconName="package"
        label="Bundles"
        isActive={activeTab === "bundles"}
        onPress={() => onNavigate("bundles")}
      />
      <DrawerButton iconName="star" label="Favoritos" isActive={false} onPress={() => {}} />
      <DrawerButton iconName="book" label="Histórico" isActive={false} onPress={() => {}} />

      <View className="mt-auto space-y-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4">
        <View className="flex-row items-center gap-2">
          <Feather name="shield" size={16} color="#38bdf8" />
          <Text className="text-xs text-slate-300">Privado por design</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Feather name="download" size={16} color="#38bdf8" />
          <Text className="text-xs text-slate-300">Dados locais</Text>
        </View>
      </View>
    </View>
  );
}

function MobileDrawer({
  open,
  onClose,
  activeTab,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  activeTab: TabKey;
  onNavigate: (tab: TabKey) => void;
}) {
  return (
    <Modal animationType="fade" transparent visible={open} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="absolute left-0 top-0 h-full w-72 rounded-r-3xl border-r border-slate-800 bg-slate-950/95 p-6">
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-2">
                <Feather name="globe" size={20} color="#cbd5f5" />
              </View>
              <View>
                <Text className="text-base font-semibold text-slate-100">LexiPocket</Text>
                <Text className="text-xs text-slate-400">Offline & rápido</Text>
              </View>
            </View>
            <Pressable
              accessibilityLabel="Fechar menu"
              className="rounded-2xl border border-slate-800 p-2"
              onPress={onClose}
            >
              <Feather name="x" size={16} color="#cbd5f5" />
            </Pressable>
          </View>

          <DrawerButton
            iconName="search"
            label="Buscar"
            isActive={activeTab === "search"}
            onPress={() => {
              onNavigate("search");
              onClose();
            }}
          />
          <DrawerButton
            iconName="package"
            label="Bundles"
            isActive={activeTab === "bundles"}
            onPress={() => {
              onNavigate("bundles");
              onClose();
            }}
          />

          <View className="mt-auto space-y-3">
            <View className="flex-row items-center gap-2">
              <Feather name="shield" size={16} color="#38bdf8" />
              <Text className="text-xs text-slate-300">Privado por design</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Feather name="download" size={16} color="#38bdf8" />
              <Text className="text-xs text-slate-300">Dados locais</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Badge({ label, icon }: { label: string; icon?: ReactNode }) {
  return (
    <View className="flex-row items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/80 px-3 py-1">
      {icon}
      <Text className="text-xs font-medium text-slate-300">{label}</Text>
    </View>
  );
}

function EntryCard({
  entry,
  isSelected,
  onPress,
}: {
  entry: Entry;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-3xl border px-4 py-4 ${
        isSelected
          ? "border-indigo-400/70 bg-indigo-500/10"
          : "border-slate-800/80 bg-slate-900/40"
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Feather name="book" size={18} color="#cbd5f5" />
          <Text className="text-lg font-semibold text-slate-100">{entry.headword}</Text>
          <Text className="text-xs uppercase tracking-wide text-slate-400">
            {entry.pos}
          </Text>
        </View>
        <View className="flex-row gap-2">
          {entry.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} label={tag} />
          ))}
        </View>
      </View>
      <Text className="mt-3 text-sm leading-relaxed text-slate-300">
        {entry.definition}
      </Text>
    </Pressable>
  );
}

function EntryDetail({
  entry,
  isFavorite,
  onToggleFavorite,
}: {
  entry: Entry | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  if (!entry) {
    return (
      <View className="items-center justify-center rounded-3xl border border-dashed border-slate-800/80 bg-slate-900/40 p-10">
        <Text className="text-center text-sm text-slate-400">
          Selecione um verbete para visualizar detalhes.
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-5 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6">
      <View className="flex-row items-start justify-between gap-4">
        <View>
          <Text className="text-3xl font-extrabold tracking-tight text-slate-100">
            {entry.headword}
          </Text>
          <Text className="text-xs uppercase tracking-[4px] text-slate-400">
            {entry.pos}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityLabel="Favoritar verbete"
            className="rounded-full border border-slate-800 bg-slate-950 p-3"
            onPress={onToggleFavorite}
          >
            {isFavorite ? (
              <FontAwesome name="star" size={18} color="#facc15" />
            ) : (
              <Feather name="star" size={18} color="#cbd5f5" />
            )}
          </Pressable>
          <Pressable
            accessibilityLabel="Reproduzir áudio"
            className="rounded-full border border-slate-800 bg-slate-950 p-3"
            onPress={() => {}}
          >
            <Feather name="volume-2" size={18} color="#cbd5f5" />
          </Pressable>
        </View>
      </View>

      <Text className="text-base leading-relaxed text-slate-200">
        {entry.definition}.
      </Text>

      <View className="space-y-3">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-slate-400">
          Exemplos
        </Text>
        {entry.examples.map((example, index) => (
          <View key={index} className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
            <Text className="text-sm font-medium text-slate-100">
              {example.sentence}
            </Text>
            <Text className="mt-1 text-xs text-slate-400">{example.translation}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function BundleCard({ bundle, onInstall }: { bundle: Bundle; onInstall: (bundle: Bundle) => void }) {
  return (
    <View className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Feather name="package" size={18} color="#cbd5f5" />
            <Text className="text-base font-semibold text-slate-100">{bundle.name}</Text>
          </View>
          <Text className="mt-2 text-xs text-slate-400">
            {bundle.entries.toLocaleString()} verbetes • {bundle.sizeMB} MB • Atualizado em {" "}
            {bundle.updatedAt}
          </Text>
        </View>
        {bundle.installed ? (
          <Badge
            label="Instalado"
            icon={<Feather name="check-circle" size={14} color="#34d399" />}
          />
        ) : bundle.premium ? (
          <Badge
            label="Premium"
            icon={<Feather name="lock" size={14} color="#facc15" />}
          />
        ) : null}
      </View>

      <Pressable
        className={`w-full items-center justify-center rounded-2xl px-4 py-3 ${
          bundle.installed
            ? "border border-slate-700/70 bg-transparent"
            : "bg-indigo-500"
        }`}
        onPress={() => onInstall(bundle)}
      >
        <View className="flex-row items-center gap-2">
          {bundle.installed ? (
            <Text className="text-sm font-semibold text-slate-200">Reinstalar</Text>
          ) : (
            <>
              <Feather name="download" size={16} color="#0f172a" />
              <Text className="text-sm font-semibold text-slate-950">Instalar</Text>
            </>
          )}
        </View>
      </Pressable>
    </View>
  );
}

function PaywallModal({ visible, onClose, bundleName }: { visible: boolean; onClose: () => void; bundleName: string }) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/60 p-6">
        <View className="w-full max-w-md space-y-5 rounded-3xl border border-slate-800/80 bg-slate-950/95 p-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-slate-100">Desbloquear bundle premium</Text>
            <Pressable className="rounded-2xl border border-slate-800 p-2" onPress={onClose}>
              <Feather name="x" size={18} color="#cbd5f5" />
            </Pressable>
          </View>
          <Text className="text-sm leading-relaxed text-slate-300">
            O bundle <Text className="font-semibold text-slate-100">{bundleName}</Text> faz parte do plano premium. Assine para instalar e receber atualizações mensais.
          </Text>
          <View className="space-y-3">
            {[
              "Atualizações de conteúdo",
              "Áudio offline",
              "Sinônimos e exemplos ampliados",
            ].map((benefit) => (
              <View key={benefit} className="flex-row items-center gap-3">
                <Feather name="shield" size={16} color="#38bdf8" />
                <Text className="text-sm text-slate-200">{benefit}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/50 px-4 py-3"
              onPress={onClose}
            >
              <Text className="text-sm font-semibold text-slate-200">Agora não</Text>
            </Pressable>
            <Pressable className="flex-1 items-center justify-center rounded-2xl bg-indigo-500 px-4 py-3">
              <Text className="text-sm font-semibold text-slate-950">Assinar ¥390/mês</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function DictionaryScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;
  const [tab, setTab] = useState<TabKey>("search");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(SAMPLE_ENTRIES[0]?.id ?? null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [pendingBundle, setPendingBundle] = useState<Bundle | null>(null);

  const filteredEntries = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return SAMPLE_ENTRIES;
    }
    return SAMPLE_ENTRIES.filter(
      (entry) =>
        entry.headword.toLowerCase().includes(term) ||
        entry.definition.toLowerCase().includes(term)
    );
  }, [query]);

  const selectedEntry = useMemo(() => {
    if (selectedId == null) {
      return null;
    }
    return SAMPLE_ENTRIES.find((entry) => entry.id === selectedId) ?? null;
  }, [selectedId]);

  const isFavorite = selectedId != null && favoriteIds.includes(selectedId);

  function toggleFavorite() {
    if (selectedId == null) {
      return;
    }
    setFavoriteIds((prev) =>
      prev.includes(selectedId)
        ? prev.filter((id) => id !== selectedId)
        : [...prev, selectedId]
    );
  }

  function handleInstall(bundle: Bundle) {
    if (bundle.premium) {
      setPendingBundle(bundle);
      setPaywallVisible(true);
      return;
    }
    setPendingBundle(bundle);
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar style="light" />

      <MobileDrawer
        open={!isLargeScreen && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={tab}
        onNavigate={setTab}
      />

      <View className="flex-1 flex-row">
        {isLargeScreen && <Sidebar activeTab={tab} onNavigate={setTab} />}

        <View className="flex-1 px-4 pb-6 pt-4 lg:px-8 lg:pt-8">
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              {!isLargeScreen && (
                <Pressable
                  accessibilityLabel="Abrir menu"
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-3"
                  onPress={() => setDrawerOpen(true)}
                >
                  <Feather name="menu" size={18} color="#cbd5f5" />
                </Pressable>
              )}
              <View className="items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/80 p-3">
                <Feather name="globe" size={20} color="#cbd5f5" />
              </View>
              <View>
                <Text className="text-lg font-semibold text-slate-100">LexiPocket</Text>
                <Text className="text-xs text-slate-400">Dicionário offline — rápido e privado</Text>
              </View>
            </View>

            <View className="flex-row rounded-2xl border border-slate-800/80 bg-slate-900/50 p-1">
              <Pressable
                className={`rounded-2xl px-3 py-2 ${
                  tab === "search" ? "bg-slate-800" : ""
                }`}
                onPress={() => setTab("search")}
              >
                <Text className={`text-sm font-semibold ${tab === "search" ? "text-slate-100" : "text-slate-400"}`}>
                  Buscar
                </Text>
              </Pressable>
              <Pressable
                className={`rounded-2xl px-3 py-2 ${
                  tab === "bundles" ? "bg-slate-800" : ""
                }`}
                onPress={() => setTab("bundles")}
              >
                <Text className={`text-sm font-semibold ${tab === "bundles" ? "text-slate-100" : "text-slate-400"}`}>
                  Bundles
                </Text>
              </Pressable>
            </View>
          </View>

          {tab === "search" ? (
            <View className="flex-1 lg:flex-row lg:gap-6">
              <View className="flex-1 lg:pr-2">
                <View className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-4">
                  <View className="flex-row items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/80 px-3">
                    <Feather name="search" size={18} color="#94a3b8" />
                    <TextInput
                      placeholder="Buscar termo…"
                      placeholderTextColor="#64748b"
                      value={query}
                      onChangeText={setQuery}
                      className="flex-1 py-3 text-sm text-slate-100"
                    />
                  </View>
                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="text-xs text-slate-400">
                      {filteredEntries.length} resultado(s)
                    </Text>
                    <View className="flex-row gap-2">
                      <Badge label="EN → PT" />
                      <Badge label="Offline" />
                    </View>
                  </View>
                </View>

                <FlatList
                  data={filteredEntries}
                  keyExtractor={(item) => String(item.id)}
                  ItemSeparatorComponent={() => <View className="h-3" />}
                  contentContainerStyle={{ paddingVertical: 16 }}
                  renderItem={({ item }) => (
                    <EntryCard
                      entry={item}
                      isSelected={selectedId === item.id}
                      onPress={() => setSelectedId(item.id)}
                    />
                  )}
                  ListEmptyComponent={
                    <View className="rounded-3xl border border-dashed border-slate-800/80 bg-slate-900/40 p-10">
                      <Text className="text-center text-sm text-slate-400">
                        Nada encontrado. Tente outro termo.
                      </Text>
                    </View>
                  }
                />
              </View>

              <ScrollView
                className="mt-6 lg:mt-0 lg:w-[40%]"
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                <EntryDetail
                  entry={selectedEntry}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              </ScrollView>
            </View>
          ) : (
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>
              <View>
                <View className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-slate-300">Gerencie seus pacotes offline</Text>
                    <View className="flex-row gap-2">
                      <Badge label="Armazenamento: 48 MB" />
                      <Badge label="Atualizações automáticas" />
                    </View>
                  </View>
                </View>

                {SAMPLE_BUNDLES.map((bundle) => (
                  <View key={bundle.id} className="mt-4">
                    <BundleCard bundle={bundle} onInstall={handleInstall} />
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          <View className="mt-8 flex-row items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/40 px-4 py-3">
            <Text className="text-[11px] uppercase tracking-[3px] text-slate-500">
              Dados locais · Sem rastreamento de texto
            </Text>
            <View className="flex-row items-center gap-2">
              <Feather name="shield" size={14} color="#38bdf8" />
              <Text className="text-xs text-slate-400">Privado por design</Text>
            </View>
          </View>
        </View>
      </View>

      <PaywallModal
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
        bundleName={pendingBundle?.name ?? ""}
      />
    </SafeAreaView>
  );
}
