plugins {
	java
	war
	id("org.springframework.boot") version "2.7.18"
	id("io.spring.dependency-management") version "1.1.4"
}

group = "lk.wsam"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

// Boot 2.7.18 manages MySQL Connector/J 8.0.33, which has CVE-2023-22102; 8.4.0 is the
// current LTS line and still supports MySQL 5.7/8.x.
extra["mysql.version"] = "8.4.0"

repositories {
	mavenCentral()
}

dependencies {
	//implementation("io.springfox:springfox-boot-starter:3.0.0")
	//implementation("io.springfox:springfox-swagger2:2.9.2")
	//implementation("io.springfox:springfox-swagger-ui:2.9.2")

	implementation ("org.springdoc:springdoc-openapi-ui:1.8.0")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("io.jsonwebtoken:jjwt-api:0.12.6")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")
	runtimeOnly("com.mysql:mysql-connector-j")
	providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("com.h2database:h2")
	developmentOnly ("org.springframework.boot:spring-boot-devtools")
	// MapStruct
	implementation("org.mapstruct:mapstruct:1.6.3")
	annotationProcessor("org.mapstruct:mapstruct-processor:1.6.3")

	// Lombok (for main code)
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")

	// Required for proper Lombok + MapStruct integration
	annotationProcessor("org.projectlombok:lombok-mapstruct-binding:0.2.0")

	// Lombok (for test code)
	testCompileOnly("org.projectlombok:lombok")
	testAnnotationProcessor("org.projectlombok:lombok")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
tasks.withType<JavaCompile> {
	options.annotationProcessorPath = configurations.annotationProcessor.get()
}

