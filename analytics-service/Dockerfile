# Build stage
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# Copy Maven wrapper and project files
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x mvnw

# Download dependencies first for better Docker caching
RUN ./mvnw dependency:go-offline -B

# Copy source
COPY src ./src

# Build application
RUN ./mvnw clean package -DskipTests -B


# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy built jar
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8004

ENTRYPOINT ["java", "-jar", "app.jar"]
