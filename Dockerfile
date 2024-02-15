FROM openjdk:21-jdk-slim AS builder

# Installa Maven
RUN apt-get update && apt-get install -y maven

# Imposta il working directory nel container
WORKDIR /app

# Copia il progetto nel container
COPY client ./client

# Imposta il working directory nel progetto estratto
WORKDIR /app/client

# Esegui il build del progetto con Maven
RUN mvn clean install -DskipTests

# Stampa il contenuto della directory target per debug
RUN ls ./../client

# Usa un'immagine di OpenJDK come base per l'esecuzione del progetto
FROM openjdk:21-jdk-slim

# Imposta il working directory nel container
WORKDIR /app

# Copia l'intera directory client dalla fase di compilazione nel container
COPY --from=builder /app/client /app/client

# Esponi la porta su cui il server Spring Boot ascolterà le richieste HTTP
EXPOSE 8075

# Avvia l'applicazione Spring Boot quando il container viene avviato
CMD ["java", "-jar", "/app/client/target/client-0.0.1-SNAPSHOT.jar"]



