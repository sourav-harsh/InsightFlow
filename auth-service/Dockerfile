# ===========================
# Stage 1 - Build
# ===========================
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy Maven Wrapper
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

# Copy Maven configuration
COPY pom.xml .

# Download dependencies first (Docker layer caching)
RUN ./mvnw dependency:go-offline

# Copy application source
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests


# ===========================
# Stage 2 - Runtime
# ===========================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Create non-root user
RUN groupadd -r spring && useradd -r -g spring spring

# Copy built JAR
COPY --from=builder /app/target/*.jar app.jar

# Run as non-root
USER spring

# Auth Service Port
EXPOSE 9020

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]
