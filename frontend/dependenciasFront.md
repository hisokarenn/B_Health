<h2>Dependencias a serem instaladas para o funcionamento do frontend</h2>

npx expo install expo-linear-gradient</br>
npx expo install @expo/vector-icons</br>
npx expo install react-native-safe-area-context</br>

caso dê problema de versão:</br>
npx expo install expo@54.0.23

<h2>Rodar o frontend localmente</h2>

cd frontend</br>
npm install</br>
cp .env.example .env</br>
npm start</br>

<h2>Gerar APK local com EAS</h2>

cd frontend</br>
npm install</br>
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64</br>
export PATH="$JAVA_HOME/bin:$PATH"</br>
java -version</br>
javac -version</br>
npx eas-cli build --platform android --profile preview --local</br>

Se o Gradle falhar com `JAVA_COMPILER`, use o JDK 17 instalado:</br>

export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64</br>
export PATH="$JAVA_HOME/bin:$PATH"</br>
java -version</br>
javac -version</br>
npx eas-cli build --platform android --profile preview --local</br>

Se outra máquina não tiver o JDK 17:</br>

sudo apt-get update</br>
sudo apt-get install -y openjdk-17-jdk</br>
