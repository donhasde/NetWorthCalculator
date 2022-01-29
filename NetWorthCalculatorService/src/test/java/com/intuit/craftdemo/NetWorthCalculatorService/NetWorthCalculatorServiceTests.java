package com.intuit.craftdemo.NetWorthCalculatorService;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
public class NetWorthCalculatorServiceTests extends UnitTestBase {

	private static final float EPSILON = 0.001f;

	@Mock
	private FreeCurrencyConverterClient mockCurrencyConverter;

	@Autowired
	@InjectMocks
	private NetWorthCalculatorService service;

	@BeforeEach
	public void init() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void Test_CalculateNetWorth_WithExchangeRate() {
		// Call CalculateNetWorth and expect the asset/liability math to add up
		UserData request = new UserData();

		request.setBaseCurrencyCode("USD");
		request.setTargetCurrencyCode("CAD");
		Map<String, Float> assets = new HashMap<>();
		assets.put("Cash", 100.0f);
		assets.put("Investments", 200.0f);
		request.setAssets(assets);

		Map<String, Float> liabilities = new HashMap<>();
		liabilities.put("Credit Card", 50.0f);
		liabilities.put("Family Loan", 40.0f);
		request.setLiabilities(liabilities);

		float exchangeRate = 1.2f;
		Mockito.when(mockCurrencyConverter.getExchangeRate("USD", "CAD")).thenReturn(exchangeRate);

		UserData ud = service.calculateNetWorth(request);

		Assertions.assertEquals(210.0f * exchangeRate, ud.getTotalNetWorth(), EPSILON);
		Assertions.assertEquals(300.0f * exchangeRate, ud.getTotalAssets(), EPSILON);
		Assertions.assertEquals(90.0f * exchangeRate, ud.getTotalLiabilities(), EPSILON);
	}

	@Test
	void Test_CalculateNetWorth_NoExchangeRate() {
		// Call CalculateNetWorth and expect the asset/liability math to add up
		UserData request = new UserData();

		request.setBaseCurrencyCode("USD");
		Map<String, Float> assets = new HashMap<>();
		assets.put("Cash", 100.0f);
		assets.put("Investments", 200.0f);
		request.setAssets(assets);

		Map<String, Float> liabilities = new HashMap<>();
		liabilities.put("Credit Card", 50.0f);
		liabilities.put("Family Loan", 40.0f);
		request.setLiabilities(liabilities);

		UserData ud = service.calculateNetWorth(request);

		Assertions.assertEquals(210.0f, ud.getTotalNetWorth(), EPSILON);
		Assertions.assertEquals(300.0f, ud.getTotalAssets(), EPSILON);
		Assertions.assertEquals(90.0f, ud.getTotalLiabilities(), EPSILON);
	}
}
