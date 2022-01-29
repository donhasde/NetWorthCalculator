package com.intuit.craftdemo.NetWorthCalculatorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class CalculatorController {
	Logger logger = LoggerFactory.getLogger(CalculatorController.class);

	@Autowired
	NetWorthCalculatorService nwcService;

	@GetMapping("/api/v1/calculateNetWorth")
	public UserData calculateNetWorth(@RequestBody UserData request) {
		logger.debug("Calculate networth called");

		UserData response = nwcService.calculateNetWorth(request);
		return response;
	}
}
