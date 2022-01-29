package com.intuit.craftdemo.NetWorthCalculatorService.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.intuit.craftdemo.NetWorthCalculatorService.CalculatorController;
import com.intuit.craftdemo.NetWorthCalculatorService.NetWorthCalculatorService;
import com.intuit.craftdemo.NetWorthCalculatorService.UserData;

@SpringBootTest
public class CalculatorControllerTests {

	@Mock
	private NetWorthCalculatorService mockService;

	@InjectMocks
	@Autowired
	private CalculatorController calculatorController;

	@BeforeEach
	public void init() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void Test_CalculateNetWorth_Expect_Service_Called() {
		// Call the CalculateNetWorth API and expect a call to NetWorthCalculatorService
		UserData request = new UserData();
		calculatorController.calculateNetWorth(request);

		Mockito.verify(mockService, Mockito.times(1)).calculateNetWorth(request);
		Mockito.verifyNoMoreInteractions(mockService);
	}
}
