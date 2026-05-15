Dokumentacja Projektu - Pogoda Tu i Teraz
1. Cel aplikacji

Aplikacja ma szybko pokazywać aktualną pogodę oraz prognozę godzinową na najbliższe 24 godziny w miejscu, w którym aktualnie znajduje się użytkownik. Pomaga to w szybkim sprawdzeniu warunków przed wyjściem z domu, bez konieczności ręcznego wpisywania miasta.
2. Wykorzystane dane z urządzenia

Aplikacja pobiera z telefonu współrzędne geograficzne przez GPS lub sieć komórkową, w tym szerokość geograficzną oraz długość geograficzną. Aplikacja nie pobierze tych danych, dopóki użytkownik nie wyrazi zgody w systemowym oknie uprawnień.
3. Wykorzystane biblioteki i API

Paczka expo-location to oficjalne rozwiązanie od Expo, które zostało użyte do obsługi okna z pytaniem o uprawnienia do GPS oraz do pobrania współrzędnych i nazwy miejscowości.
Open-Meteo API to darmowe i otwarte API pogodowe, które nie wymaga rejestracji ani generowania kluczy dostępu, a dane są pobierane bezpośrednio przez funkcję fetch.
4. Przepływ danych w aplikacji

Użytkownik włącza aplikację, która od razu wysyła zapytanie do systemu o dostęp do lokalizacji.
Jeśli użytkownik odmówi, aplikacja przerywa działanie i pokazuje komunikat z błędem oraz przycisk do ponownej próby.
Jeśli da zgodę, telefon pobiera pozycję GPS oraz nazwę miejscowości za pomocą funkcji reverseGeocodeAsync.
Szerokość i długość geograficzna są dodawane do adresu URL zapytania do API Open-Meteo.
Aplikacja wykonuje żądanie GET, odbiera dane i zapisuje je w stanie komponentu.
Z pobranej tablicy wycinane są pierwsze 24 godziny za pomocą metody slice i przekazywane do poziomej listy przewijanej, a aktualna temperatura wyświetla się na głównej karcie.
Przycisk na dole pozwala ręcznie odświeżyć aplikację i pobrać nowe dane.
5. Ograniczenia i problemy podczas robienia projektu

W przypadku braku zgody na GPS aplikacja nie pobierze danych, co zostało rozwiązane przez dodanie osobnego widoku dla błędu, zapobiegającego zawieszeniu aplikacji.
Przy braku internetu funkcja fetch wyrzucała błąd, dlatego kod został zamknięty w bloku try-catch, dzięki czemu w razie braku połączenia wyskakuje komunikat informacyjny.
API zwracało czas w formacie ISO, więc użyto metody toLocaleTimeString, aby dostosować format wyświetlania godzin do lokalnych ustawień zegara w telefonie.
