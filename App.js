import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,precipitation&hourly=temperature_2m,precipitation_probability,precipitation&forecast_days=2`
      );
      if (!response.ok) {
        throw new Error('Błąd połączenia z serwerem pogodowym.');
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setErrorMsg('Nie udało się pobrać danych pogodowych. Sprawdź połączenie z internetem.');
    } finally {
      setLoading(false);
    }
  };

  const initApp = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Odmówiono dostępu do lokalizacji. Aplikacja wymaga uprawnień GPS do poprawnego działania.');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(loc);
      
      await fetchWeatherData(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      setErrorMsg('Wystąpił błąd podczas próby odczytu lokalizacji z urządzenia.');
      setLoading(false);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Pobieranie lokalizacji i prognozy...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
        <TouchableOpacity style={styles.button} onPress={initApp}>
          <Text style={styles.buttonText}>Spróbuj ponownie</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hourlyTimes = weather?.hourly?.time?.slice(0, 24) || [];
  const hourlyTemps = weather?.hourly?.temperature_2m?.slice(0, 24) || [];
  const hourlyPrecip = weather?.hourly?.precipitation_probability?.slice(0, 24) || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Pogoda „Tu i Teraz”</Text>
        
        {}
        <View style={styles.currentCard}>
          <Text style={styles.cardHeader}>Aktualne warunki dla Twojej pozycji</Text>
          <Text style={styles.temp}>{weather?.current?.temperature_2m}°C</Text>
          
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>💨 Wiatr: {weather?.current?.wind_speed_10m} km/h</Text>
            <Text style={styles.detailText}>💧 Opad: {weather?.current?.precipitation} mm</Text>
          </View>
          
          <Text style={styles.coords}>
            Szer: {location?.coords.latitude.toFixed(4)} | Dług: {location?.coords.longitude.toFixed(4)}
          </Text>
        </View>

        {}
        <Text style={styles.sectionTitle}>Prognoza godzinowa (Najbliższe 24h)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
          {hourlyTimes.map((time, index) => {
            const hour = new Date(time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
            return (
              <View key={index} style={styles.hourlyItem}>
                <Text style={styles.hourText}>{hour}</Text>
                <Text style={styles.hourTemp}>{hourlyTemps[index]}°C</Text>
                <Text style={styles.hourRain}>🌧️ {hourlyPrecip[index]}%</Text>
              </View>
            );
          })}
        </ScrollView>

        {}
        <TouchableOpacity style={styles.refreshButton} onPress={initApp}>
          <Text style={styles.buttonText}>🔄 Odśwież dane</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  scrollContainer: { padding: 20, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f7fa' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a', marginTop: 40, marginBottom: 20 },
  currentCard: { width: '100%', backgroundColor: '#ffffff', padding: 20, borderRadius: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, marginBottom: 25 },
  cardHeader: { fontSize: 14, color: '#666', fontWeight: '600' },
  temp: { fontSize: 52, fontWeight: 'bold', color: '#0066cc', marginVertical: 10 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 15 },
  detailText: { fontSize: 15, color: '#444', fontWeight: '500' },
  coords: { fontSize: 12, color: '#999', marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', alignSelf: 'flex-start', marginBottom: 15 },
  hourlyScroll: { width: '100%', flexDirection: 'row', marginBottom: 30 },
  hourlyItem: { backgroundColor: '#ffffff', padding: 15, borderRadius: 12, marginRight: 12, alignItems: 'center', minWidth: 85, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  hourText: { fontSize: 13, color: '#666', marginBottom: 5 },
  hourTemp: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  hourRain: { fontSize: 12, color: '#0066cc', fontWeight: '500' },
  refreshButton: { backgroundColor: '#0066cc', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 25, width: '100%', alignItems: 'center', shadowColor: '#0066cc', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3, marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loadingText: { marginTop: 15, fontSize: 16, color: '#555', fontWeight: '500' },
  errorText: { fontSize: 16, color: '#d9534f', textAlign: 'center', marginBottom: 20, fontWeight: '500', lineHeight: 22 },
  button: { backgroundColor: '#d9534f', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 }
});
