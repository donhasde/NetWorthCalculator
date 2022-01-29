package com.intuit.craftdemo.NetWorthCalculatorService;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.reactive.function.client.WebClient;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;

@SpringBootTest
public class FreeCurrencyConverterClientTests extends UnitTestBase {

	@Mock
	private WebClient.Builder mockBuilder;

	private WebClient webClient;
	private MockWebServer mockWebServer;

	@BeforeEach
	public void init() throws IOException {
		mockWebServer = new MockWebServer();
		mockWebServer.start();

		MockitoAnnotations.openMocks(this);
		webClient = WebClient.builder().baseUrl(mockWebServer.url("/").toString()).build();
		Mockito.when(mockBuilder.baseUrl(Mockito.anyString())).thenReturn(mockBuilder);
		Mockito.when(mockBuilder.build()).thenReturn(webClient);
	}

	@AfterEach
	public void tearDown() throws IOException {
		mockWebServer.shutdown();
	}

	@Test
	void test_GetExchangeRate_Parse_Response() {
		mockWebServer.enqueue(new MockResponse().setResponseCode(HttpStatus.OK.value())
				.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).setBody("{\"USD_CAD\": 1.2}"));

		FreeCurrencyConverterClient client = new FreeCurrencyConverterClient(mockBuilder);
		float exchangeRate = client.getExchangeRate("USD", "CAD");
		assertEquals(1.2f, exchangeRate);
	}
}
