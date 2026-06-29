# =========================
# 1) BUILD STAGE
# =========================
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /workspace

# Copier uniquement pom.xml pour cache Docker (optimisation)
COPY pom.xml .

# Télécharger dépendances (cache layer Docker)
RUN mvn -B dependency:go-offline

# Copier le code source
COPY src ./src

# Build robuste (fix erreurs réseau Maven)
RUN mvn -B -DskipTests -U -e \
    -Dmaven.wagon.http.retryHandler.count=5 \
    -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 \
    package


# =========================
# 2) RUNTIME STAGE
# =========================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copier le jar généré
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]