# Dokumentacja Projektu - Pogoda Tu i Teraz

## 1. Opis celu aplikacji
Celem aplikacji jest dostarczenie użytkownikowi szybkiej informacji o bieżących warunkach pogodowych oraz szczegółowej, 24-godzinnej prognozie pogody bezpośrednio dla miejsca, w którym aktualnie się znajduje. Projekt ułatwia codzienne planowanie wyjść lub aktywności terenowych na podstawie precyzyjnych danych geolokalizacyjnych.

## 2. Opis wykorzystanych danych z urządzenia
Aplikacja wykorzystuje dane z modułu **GPS / sieci komórkowych** urządzenia mobilnego do określenia współrzędnych geograficznych:
*   Szerokość geograficzna (`latitude`)
*   Długość geograficzna (`longitude`)
Dostęp do danych realizowany jest wyłącznie po wyraźnym udzieleniu zgody przez użytkownika systemu (runtime permissions).

## 3. Opis wykorzystanych bibliotek i API
*   **Expo Location (`expo-location`)**: Oficjalny komponent SDK Expo służący do obsługi zapytań o uprawnienia systemowe oraz pobierania dokładnych współrzędnych geograficznych urządzenia.
*   **Open-Meteo API**: Publiczne, darmowe i niewymagające klucza uwierzytelniającego API pogodowe. Dane pobierane są asynchronicznie za pomocą natywnej funkcji `fetch`.

## 4. Opis przepływu danych w aplikacji
1.  Uruchomienie aplikacji inicjuje proces sprawdzenia i żądania uprawnień lokalizacyjnych.
2.  W przypadku braku uprawnień, przepływ zostaje przerwany, a użytkownik widzi komunikat o błędzie z opcją ponownej próby.
3.  Po uzyskaniu zgody, urządzenie pobiera aktualną pozycję GPS.
4.  Współrzędne (`latitude`, `longitude`) są dynamicznie wstrzykiwane do adresu URL zapytania API Open-Meteo.
5.  Aplikacja wysyła żądanie HTTP GET, odbiera strukturę danych JSON i parsuje ją do stanu komponentu (`weather`).
6.  Zwrócona prognoza godzinowa jest filtrowana (odcinane są dokładnie 24 kolejne godziny), a interfejs użytkownika renderuje dane w formie czytelnych kart oraz poziomej listy przewijanej.
7.  Przycisk "Odśwież dane" pozwala na ponowne przejście całego cyklu i aktualizację parametrów.

## 5. Lista ograniczeń i problemów napotkanych podczas realizacji
*   **Brak uprawnień GPS**: Głównym ograniczeniem jest całkowita zależność aplikacji od zgody użytkownika. Problem rozwiązano poprzez czytelny ekran błędu uniemożliwiający wykrzyczenie się aplikacji.
*   **Brak dostępu do sieci**: Próba odpytania API bez internetu powodowała błąd asynchroniczny. Zaimplementowano blok `try-catch`, który wychwytuje błędy sieciowe i informuje o nich użytkownika, nie zawieszając samej aplikacji.
*   **Formatowanie strefy czasowej**: Dane z API zwracane są w formacie ISO. Wykorzystano metodę `toLocaleTimeString`, aby dostosować format wyświetlania godzin do lokalnych ustawień językowych smartfona.
