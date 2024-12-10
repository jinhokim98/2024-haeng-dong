package haengdong.event.config;

import jakarta.annotation.PreDestroy;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    private static final int THREAD_POOL_SIZE = 10;

    private final ExecutorService executorService = Executors.newFixedThreadPool(THREAD_POOL_SIZE);

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.AP_NORTHEAST_2)
                .build();
    }

    @Bean
    public ExecutorService executorService() {
        return executorService;
    }

    @PreDestroy
    public void shutdown() {
        executorService.shutdown();
    }
}
