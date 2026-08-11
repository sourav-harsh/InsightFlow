# ===========================
# Stage 1 - Build
# ===========================

FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY .mvn .mvn
COPY mvnw .

RUN chmod +x mvnw

COPY pom.xml .

RUN ./mvnw dependency:go-offline

COPY src src

RUN ./mvnw clean package -DskipTests


# ===========================
# Stage 2 - Runtime
# ===========================

FROM eclipse-temurin:21-jre

WORKDIR /app

RUN groupadd -r spring && \
    useradd -r -g spring spring

COPY --from=builder /app/target/*.jar app.jar

RUN chown spring:spring app.jar

USER spring

ENTRYPOINT ["java", "-jar", "app.jar"]
