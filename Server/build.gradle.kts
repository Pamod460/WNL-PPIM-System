plugins {
	java
	war
	id("org.springframework.boot") version "2.7.10"
	id("io.spring.dependency-management") version "1.0.15.RELEASE"
}

group = "lk.wsam"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
	mavenCentral()
}

dependencies {
	//implementation("io.springfox:springfox-boot-starter:3.0.0")
	//implementation("io.springfox:springfox-swagger2:2.9.2")
	//implementation("io.springfox:springfox-swagger-ui:2.9.2")

	implementation ("org.springdoc:springdoc-openapi-ui:1.7.0")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("io.jsonwebtoken:jjwt:0.9.1")
	runtimeOnly("com.mysql:mysql-connector-j")
	providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
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

