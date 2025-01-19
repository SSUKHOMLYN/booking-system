api: ./mvnw clean package && java -Dserver.port=$PORT -jar api/target/api-0.0.1-SNAPSHOT.jar
book: ./mvnw clean package && java -Dserver.port=$PORT -jar book/target/book-0.0.1-SNAPSHOT.jar
web: cd api && ./mvnw spring-boot:run & cd ../frontend/vite-project && npm start



