package com.intuit.craftdemo.NetWorthCalculatorService;

import java.time.Duration;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;

@Component
public class FreeCurrencyConverterClient {
	Logger logger = LoggerFactory.getLogger(CalculatorController.class);

	@Value("${free.currconv.access-key}")
	private String apiKey;

	private final WebClient webClient;

	FreeCurrencyConverterClient(WebClient.Builder webClientBuilder) {
		webClient = webClientBuilder.baseUrl("https://free.currconv.com").build();
	}

	public float getExchangeRate(String baseCurrency, String targetCurrency) {
		String currencyKey = baseCurrency + "_" + targetCurrency;

		Flux<Map<String, Float>> request = webClient.get()
				.uri("/api/v7/convert?q=" + currencyKey + "&compact=ultra&apiKey=" + apiKey).retrieve()
				.bodyToFlux(new ParameterizedTypeReference<Map<String, Float>>() {
				});

		Map<String, Float> result = request.blockLast(Duration.ofMillis(5000));
		Float exchangeRate = result.get(currencyKey);
		logger.info("Retrieved Exchange rate " + currencyKey + ": " + exchangeRate);

		return exchangeRate;
	}
}
