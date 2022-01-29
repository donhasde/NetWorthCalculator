package com.intuit.craftdemo.NetWorthCalculatorService;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class NetWorthCalculatorServiceTests {

	@Autowired
	private NetWorthCalculatorService service;

	@BeforeEach
	public void init() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void Test_CalculateNetWorth() {
		// Call CalculateNetWorth and expect the asset/liability math to add up
		UserData request = new UserData();
		
		Map<String, Float> assets = new HashMap<>();
		assets.put("Cash", 100.0f);
		assets.put("Investments", 200.0f);
		request.setAssets(assets);
		
		Map<String, Float> liabilities = new HashMap<>();
		liabilities.put("Credit Card", 50.0f);
		liabilities.put("Family Loan", 40.0f);
		request.setLiabilities(liabilities);
		
		UserData ud = service.calculateNetWorth(request);
		
		Assertions.assertEquals(ud.getTotalNetWorth(), 210.0f);
		Assertions.assertEquals(ud.getTotalAssets(), 300.0f);
		Assertions.assertEquals(ud.getTotalLiabilities(), 90.0f);
	}
}
