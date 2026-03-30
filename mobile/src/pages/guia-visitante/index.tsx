import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { style } from './style';
import Logo from '../../assets/logo2.png';
import { parques } from '../../data/parques';



const eventos = [
  {
    id: '1',
    titulo: 'Passeio Guiado',
    data: '27 Mar',
    local: 'Parque Serra Verde',
  },
  {
    id: '2',
    titulo: 'Observação de Aves',
    data: '29 Mar',
    local: 'Vale das Águas',
  },
];

export default function GuiaVisitante() {
  const [busca, setBusca] = useState('');

  const parquesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return parques;

    return parques.filter(
      (parque) =>
        parque.nome.toLowerCase().includes(termo) ||
        parque.local.toLowerCase().includes(termo) ||
        parque.descricao.toLowerCase().includes(termo)
    );
  }, [busca]);

  return (
    <SafeAreaView style={style.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollContainer}
      >
        <View style={style.header}>
          <View style={style.logoArea}>
            <Image source={Logo} style={style.logo} resizeMode="contain" />
            <View>
              <Text style={style.brand}>Terê Verde</Text>
              <Text style={style.brandSub}>Guia do visitante</Text>
            </View>
          </View>

          <Pressable style={style.profileButton}>
            <Feather name="user" size={18} color="#0F172A" />
          </Pressable>
        </View>

        <View style={style.heroCard}>
          <Text style={style.heroBadge}>TERÊ VERDE</Text>
          <Text style={style.heroTitle}>
             PARQUES, TRILHAS e EVENTOS
          </Text>
          <Text style={style.heroDescription}>
            Descubra a natureza de Teresópolis com nosso guia do visitante.
          </Text>

          <View style={style.heroButtons}>
            <Pressable style={style.primaryButton}>
              <Text style={style.primaryButtonText}>Explorar agora</Text>
            </Pressable>

            <Pressable style={style.secondaryButton}>
              <Text style={style.secondaryButtonText}>Ver eventos</Text>
            </Pressable>
          </View>
        </View>

        <View style={style.searchBox}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar parques, locais ou experiências"
            placeholderTextColor="#94A3B8"
            style={style.searchInput}
          />
        </View>

        <Text style={style.sectionTitle}>Resumo rápido</Text>
        <View style={style.statsGrid}>
          <View style={[style.statCard, style.greenCard]}>
            <Feather name="tree" size={20} color="#fff" />
            <Text style={style.statNumber}>3</Text>
            <Text style={style.statLabel}>Parques</Text>
          </View>

          <View style={[style.statCard, style.blueCard]}>
            <Feather name="map" size={20} color="#fff" />
            <Text style={style.statNumber}>12</Text>
            <Text style={style.statLabel}>Trilhas</Text>
          </View>

          <View style={[style.statCard, style.purpleCard]}>
            <Feather name="calendar" size={20} color="#fff" />
            <Text style={style.statNumber}>8</Text>
            <Text style={style.statLabel}>Eventos</Text>
          </View>

          <View style={[style.statCard, style.lightGreenCard]}>
            <Feather name="heart" size={20} color="#fff" />
            <Text style={style.statNumber}>42</Text>
            <Text style={style.statLabel}>Espécies</Text>
          </View>
        </View>

        <Text style={style.sectionTitle}>Parques em destaque</Text>

        {parquesFiltrados.map((parque) => (
          <View key={parque.id} style={style.card}>
            <View style={style.cardBanner}>
              <Feather name="tree" size={40} color="rgba(255,255,255,0.8)" />
            </View>

            <View style={style.cardBody}>
              <Text style={style.cardTitle}>{parque.nome}</Text>

              <View style={style.cardMetaRow}>
                <Feather name="map-pin" size={14} color="#64748B" />
                <Text style={style.cardMeta}>{parque.local}</Text>
              </View>

              <Text style={style.cardDescription}>{parque.descricao}</Text>

              <Pressable style={style.outlineButton}>
                <Text style={style.outlineButtonText}>Ver detalhes</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <Text style={style.sectionTitle}>Próximos eventos</Text>

        {eventos.map((evento) => (
          <View key={evento.id} style={style.eventCard}>
            <View style={style.eventDateBox}>
              <Text style={style.eventDate}>{evento.data}</Text>
            </View>

            <View style={style.eventInfo}>
              <Text style={style.eventTitle}>{evento.titulo}</Text>
              <Text style={style.eventLocation}>{evento.local}</Text>
            </View>

            <Feather name="chevron-right" size={20} color="#94A3B8" />
          </View>
        ))}

        <View style={style.footerBox}>
          <Text style={style.footerTitle}>Experiência do turista</Text>
          <Text style={style.footerText}>
            Feedback
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}